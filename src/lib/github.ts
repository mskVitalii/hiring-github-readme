import { SKILL_CATEGORIES, TECH_KEYWORDS } from './keywords';
import type {
  GitHubRepo,
  GitHubUser,
  RepoLanguages,
  ScanResult,
  Skill,
  SkillCategory,
} from './types';

const API_BASE = 'https://api.github.com';

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — ignore
  }
}

async function ghFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (res.status === 403) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    if (remaining === '0') {
      const resetTime = Number(res.headers.get('x-ratelimit-reset')) * 1000;
      const waitMin = Math.ceil((resetTime - Date.now()) / 60000);
      throw new Error(
        `GitHub API rate limit exceeded. Resets in ~${waitMin} minutes.`,
      );
    }
  }

  if (res.status === 404) {
    throw new Error('User not found. Check the username and try again.');
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

/** Parse username from input (handles full GitHub URLs) */
export function parseUsername(input: string): string {
  const trimmed = input.trim().replace(/\/+$/, '');
  try {
    const url = new URL(trimmed);
    if (url.hostname === 'github.com') {
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length >= 1) return parts[0];
    }
  } catch {
    // Not a URL, treat as username
  }
  // Remove @ prefix if present
  return trimmed.replace(/^@/, '');
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  const cacheKey = `gh_user_${username}`;
  const cached = getCached<GitHubUser>(cacheKey);
  if (cached) return cached;

  const user = await ghFetch<GitHubUser>(
    `/users/${encodeURIComponent(username)}`,
  );
  setCache(cacheKey, user);
  return user;
}

/** Fetch all non-fork repos (optionally include archived), paginated up to 300 */
export async function fetchRepos(
  username: string,
  includeArchived = true,
): Promise<GitHubRepo[]> {
  const cacheKey = `gh_repos_${username}_${includeArchived ? 'with_archived' : 'no_archived'}`;
  const cached = getCached<GitHubRepo[]>(cacheKey);
  if (cached) return cached;

  const allRepos: GitHubRepo[] = [];
  const perPage = 100;
  const maxPages = 3;

  for (let page = 1; page <= maxPages; page++) {
    const repos = await ghFetch<GitHubRepo[]>(
      `/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated&type=owner`,
    );
    allRepos.push(...repos);
    if (repos.length < perPage) break;
  }

  const filtered = allRepos.filter(
    (r) => !r.fork && (includeArchived || !r.archived),
  );
  setCache(cacheKey, filtered);
  return filtered;
}

/**
 * Map GitHub API language names → our skill names.
 * null = skip entirely (too noisy to be a meaningful skill)
 */
const LANG_NORMALIZER: Record<string, string | null> = {
  'C#': 'C# / .NET',
  'ASP.NET': 'C# / .NET',
  'ASP.NET Core': 'C# / .NET',
  Dockerfile: 'Docker',
  HCL: 'Terraform',
  'Jupyter Notebook': 'Jupyter',
  SCSS: 'Sass',
  CSS: 'CSS',
  HTML: 'HTML',
  Batchfile: null,
  PowerShell: 'Shell',
  Makefile: null,
  YAML: null, // k8s/GitHub Actions detected via file tree, not raw YAML language
  JSON: null,
  Markdown: null,
  'GitHub Actions Workflow': null, // dedupe — detected via keywords/file tree
};

function normalizeLang(lang: string): string | null {
  if (lang in LANG_NORMALIZER) return LANG_NORMALIZER[lang];
  return lang; // pass-through for JavaScript, Python, Go, etc.
}

/** Fetch language breakdown for a repo */
async function fetchRepoLanguages(
  owner: string,
  repo: string,
): Promise<RepoLanguages> {
  const cacheKey = `gh_langs_${owner}_${repo}`;
  const cached = getCached<RepoLanguages>(cacheKey);
  if (cached) return cached;

  const langs = await ghFetch<RepoLanguages>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
  );
  setCache(cacheKey, langs);
  return langs;
}

/** Fetch root-level file/dir names for a repo (used for infra detection) */
async function fetchRepoRootFiles(
  owner: string,
  repo: string,
): Promise<string[]> {
  const cacheKey = `gh_root_${owner}_${repo}`;
  const cached = getCached<string[]>(cacheKey);
  if (cached) return cached;

  try {
    const contents = await ghFetch<Array<{ name: string; type: string }>>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/`,
    );
    const names = contents.map((f) => f.name.toLowerCase());
    setCache(cacheKey, names);
    return names;
  } catch {
    return [];
  }
}

/** Detect skills from a set of repos */
function detectSkillsFromRepos(
  repos: GitHubRepo[],
  languageMaps: Map<string, RepoLanguages>,
  rootFilesMap: Map<string, string[]>,
): Map<
  string,
  {
    repos: Map<
      string,
      {
        url: string;
        homepage: string | null;
        stars: number;
        updatedAt: string;
        archived: boolean;
      }
    >;
  }
> {
  const skillMap = new Map<
    string,
    {
      repos: Map<
        string,
        {
          url: string;
          homepage: string | null;
          stars: number;
          updatedAt: string;
          archived: boolean;
        }
      >;
    }
  >();

  const addSkill = (
    skillName: string,
    repoName: string,
    repoUrl: string,
    homepage: string | null,
    stars: number,
    updatedAt: string,
    archived: boolean,
  ) => {
    if (!skillMap.has(skillName)) {
      skillMap.set(skillName, { repos: new Map() });
    }
    const entry = skillMap.get(skillName)!;
    if (!entry.repos.has(repoName)) {
      entry.repos.set(repoName, {
        url: repoUrl,
        homepage,
        stars,
        updatedAt,
        archived,
      });
    }
  };

  for (const repo of repos) {
    // 1. Detect from primary language
    if (repo.language) {
      const normalized = normalizeLang(repo.language);
      if (normalized) {
        addSkill(
          normalized,
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
    }

    // 2. Detect from language breakdown (normalized to our skill names)
    const langs = languageMaps.get(repo.name);
    if (langs) {
      for (const lang of Object.keys(langs)) {
        const normalized = normalizeLang(lang);
        if (normalized) {
          addSkill(
            normalized,
            repo.name,
            repo.html_url,
            repo.homepage,
            repo.stargazers_count,
            repo.updated_at,
            repo.archived,
          );
        }
      }
    }

    // 3. Detect from topics using keyword map
    const searchText = [...repo.topics, repo.description ?? '', repo.name]
      .join(' ')
      .toLowerCase();

    for (const [skillName, keywords] of Object.entries(TECH_KEYWORDS)) {
      if (keywords.some((kw) => searchText.includes(kw))) {
        addSkill(
          skillName,
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
    }

    // 4. Detect from root directory structure (infra repos only)
    // This catches k8s manifests, GitHub Actions workflows, Helm charts, Terraform configs
    // even when the developer hasn't set explicit topics.
    const rootFiles = rootFilesMap.get(repo.name) ?? [];
    if (rootFiles.length > 0) {
      // GitHub Actions: .github directory is a reliable signal
      if (rootFiles.includes('.github')) {
        addSkill(
          'GitHub Actions',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
      // Kubernetes: canonical directory names used by the community
      const k8sIndicators = [
        'k8s',
        'kubernetes',
        'manifests',
        'kustomize',
        'gitops',
        'flux',
        'argocd',
      ];
      if (
        rootFiles.some((f) =>
          k8sIndicators.some((d) => f === d || f.startsWith(d)),
        )
      ) {
        addSkill(
          'Kubernetes',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
      // Helm: Chart.yaml at root = this IS a chart; charts/ = app with bundled chart
      if (
        rootFiles.some(
          (f) =>
            f === 'chart.yaml' ||
            f === 'charts' ||
            f === 'helmfile.yaml' ||
            f === 'helmfile.yml',
        )
      ) {
        addSkill(
          'Helm',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
      // Terraform: .tf files or terraform/ directory at root
      if (
        rootFiles.some(
          (f) =>
            f.endsWith('.tf') || f.endsWith('.tfvars') || f === 'terraform',
        )
      ) {
        addSkill(
          'Terraform',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
      // Ansible
      if (
        rootFiles.some(
          (f) =>
            f === 'ansible' || f === 'galaxy.yml' || f.includes('playbook'),
        )
      ) {
        addSkill(
          'Ansible',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
    }
  }

  return skillMap;
}

/** Organize detected skills into categories */
function categorizeSkills(
  skillMap: Map<
    string,
    {
      repos: Map<
        string,
        {
          url: string;
          homepage: string | null;
          stars: number;
          updatedAt: string;
          archived: boolean;
        }
      >;
    }
  >,
): SkillCategory[] {
  const categories: SkillCategory[] = [];

  for (const [categoryName, skillNames] of Object.entries(SKILL_CATEGORIES)) {
    const skills: Skill[] = [];

    for (const skillName of skillNames) {
      const data = skillMap.get(skillName);
      if (data && data.repos.size > 0) {
        const repoEntries = [...data.repos.entries()];
        skills.push({
          name: skillName,
          repos: repoEntries.map(([name]) => name),
          repoUrls: repoEntries.map(([, info]) => info.url),
          repoHomepages: repoEntries.map(([, info]) => info.homepage),
          repoStars: repoEntries.map(([, info]) => info.stars),
          repoUpdatedAt: repoEntries.map(([, info]) => info.updatedAt),
          repoArchived: repoEntries.map(([, info]) => info.archived),
        });
      }
    }

    if (skills.length > 0) {
      // Sort by number of repos (descending)
      skills.sort((a, b) => b.repos.length - a.repos.length);
      categories.push({ name: categoryName, skills });
    }
  }

  // Add uncategorized skills
  const allCategorized = new Set(Object.values(SKILL_CATEGORIES).flat());
  const uncategorized: Skill[] = [];

  for (const [skillName, data] of skillMap) {
    if (!allCategorized.has(skillName) && data.repos.size > 0) {
      const repoEntries = [...data.repos.entries()];
      uncategorized.push({
        name: skillName,
        repos: repoEntries.map(([name]) => name),
        repoUrls: repoEntries.map(([, info]) => info.url),
        repoHomepages: repoEntries.map(([, info]) => info.homepage),
        repoStars: repoEntries.map(([, info]) => info.stars),
        repoUpdatedAt: repoEntries.map(([, info]) => info.updatedAt),
        repoArchived: repoEntries.map(([, info]) => info.archived),
      });
    }
  }

  if (uncategorized.length > 0) {
    uncategorized.sort((a, b) => b.repos.length - a.repos.length);
    categories.push({ name: 'Other', skills: uncategorized });
  }

  return categories;
}

export type ScanProgress = {
  phase: 'user' | 'repos' | 'languages' | 'analyzing' | 'done';
  current?: number;
  total?: number;
};

/** Main scan function */
export async function scanUser(
  username: string,
  onProgress?: (progress: ScanProgress) => void,
  options?: { includeArchived?: boolean },
): Promise<ScanResult> {
  const includeArchived = options?.includeArchived ?? true;

  onProgress?.({ phase: 'user' });
  const user = await fetchUser(username);

  onProgress?.({ phase: 'repos' });
  const repos = await fetchRepos(username, includeArchived);

  // Fetch languages for top 30 repos (by stars, then size)
  const sortedRepos = [...repos].sort(
    (a, b) => b.stargazers_count - a.stargazers_count || b.size - a.size,
  );
  const reposToScan = sortedRepos.slice(0, 30);
  const languageMaps = new Map<string, RepoLanguages>();

  for (let i = 0; i < reposToScan.length; i++) {
    onProgress?.({
      phase: 'languages',
      current: i + 1,
      total: reposToScan.length,
    });
    const repo = reposToScan[i];
    const langs = await fetchRepoLanguages(username, repo.name);
    languageMaps.set(repo.name, langs);
  }

  // Fetch root directory listings for repos with infra-like primary languages.
  // These are the most likely to have k8s manifests, Terraform configs, etc.
  // that are not reflected in topics/description. Capped to avoid rate limit pressure.
  const infraLanguages = new Set([
    null,
    undefined,
    'YAML',
    'HCL',
    'Shell',
    'Dockerfile',
  ]);
  const infraRepos = reposToScan.filter((r) =>
    infraLanguages.has(r.language ?? null),
  );
  const rootFilesMap = new Map<string, string[]>();

  for (let i = 0; i < infraRepos.length; i++) {
    onProgress?.({
      phase: 'languages',
      current: reposToScan.length + i + 1,
      total: reposToScan.length + infraRepos.length,
    });
    const repo = infraRepos[i];
    const files = await fetchRepoRootFiles(username, repo.name);
    rootFilesMap.set(repo.name, files);
  }

  onProgress?.({ phase: 'analyzing' });
  const skillMap = detectSkillsFromRepos(repos, languageMaps, rootFilesMap);
  const categories = categorizeSkills(skillMap);

  onProgress?.({ phase: 'done' });

  return {
    user,
    categories,
    totalRepos: repos.length,
    scannedRepos: reposToScan.length,
  };
}
