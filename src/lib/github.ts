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

/** Execute async tasks with max concurrency limit */
async function pLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number = 5,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  const executing: Promise<void>[] = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const promise = Promise.resolve()
      .then(() => task())
      .then((result) => {
        results[i] = result;
      });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p === promise),
        1,
      );
    }
  }

  await Promise.all(executing);
  return results;
}

async function ghFetch<T>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { headers });

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

export async function fetchUser(
  username: string,
  token?: string,
): Promise<GitHubUser> {
  const cacheKey = `gh_user_${username}`;
  const cached = getCached<GitHubUser>(cacheKey);
  if (cached) return cached;

  const user = await ghFetch<GitHubUser>(
    `/users/${encodeURIComponent(username)}`,
    token,
  );
  setCache(cacheKey, user);
  return user;
}

/** Fetch all non-fork repos (optionally include archived), paginated */
export async function fetchRepos(
  username: string,
  includeArchived = true,
  token?: string,
): Promise<GitHubRepo[]> {
  const cacheKey = `gh_repos_${username}_${includeArchived ? 'with_archived' : 'no_archived'}_${token ? 'with_token' : 'no_token'}`;
  const cached = getCached<GitHubRepo[]>(cacheKey);
  if (cached) return cached;

  const allRepos: GitHubRepo[] = [];
  const perPage = 100;
  // With token: load all repos. Without token: load first page only (API limit ~100)
  const maxPages = token ? Infinity : 1;

  for (let page = 1; page <= maxPages; page++) {
    const repos = await ghFetch<GitHubRepo[]>(
      `/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated&type=owner`,
      token,
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

const JS_TS_LANGUAGE_SKILLS = new Set(['JavaScript', 'TypeScript']);
const DOTNET_LANGUAGE_SKILLS = new Set([
  'C# / .NET',
  'C#',
  'F#',
  'Visual Basic .NET',
  'VB.NET',
]);

const FRAMEWORK_LANGUAGE_GUARDS: Partial<Record<string, string[]>> = {
  // Frontend / Node ecosystem
  React: ['JavaScript', 'TypeScript'],
  Vue: ['JavaScript', 'TypeScript'],
  Angular: ['JavaScript', 'TypeScript'],
  Svelte: ['JavaScript', 'TypeScript'],
  'Next.js': ['JavaScript', 'TypeScript'],
  Nuxt: ['JavaScript', 'TypeScript'],
  Astro: ['JavaScript', 'TypeScript'],
  Gatsby: ['JavaScript', 'TypeScript'],
  Redux: ['JavaScript', 'TypeScript'],
  Zustand: ['JavaScript', 'TypeScript'],
  Vite: ['JavaScript', 'TypeScript'],
  Webpack: ['JavaScript', 'TypeScript'],
  'Node.js': ['JavaScript', 'TypeScript'],
  Express: ['JavaScript', 'TypeScript'],
  Fastify: ['JavaScript', 'TypeScript'],
  NestJS: ['JavaScript', 'TypeScript'],
  'React Native': ['JavaScript', 'TypeScript'],

  // Backend ecosystems
  Django: ['Python'],
  Flask: ['Python'],
  FastAPI: ['Python'],
  'Spring Boot': ['Java', 'Kotlin'],
  'Ruby on Rails': ['Ruby'],
  Laravel: ['PHP'],
  Gin: ['Go'],
  Fiber: ['Go'],
  Actix: ['Rust'],
  Flutter: ['Dart'],
  SwiftUI: ['Swift'],
};

function isSkillCompatibleWithLanguages(
  skillName: string,
  repoLanguageSkills: Set<string>,
): boolean {
  if (skillName === 'C# / .NET') {
    for (const lang of DOTNET_LANGUAGE_SKILLS) {
      if (repoLanguageSkills.has(lang)) return true;
    }
    return false;
  }

  const requiredLanguages = FRAMEWORK_LANGUAGE_GUARDS[skillName];
  if (!requiredLanguages) return true;
  return requiredLanguages.some((lang) => repoLanguageSkills.has(lang));
}

/** Fetch language breakdown for a repo */
async function fetchRepoLanguages(
  owner: string,
  repo: string,
  token?: string,
): Promise<RepoLanguages> {
  const cacheKey = `gh_langs_${owner}_${repo}`;
  const cached = getCached<RepoLanguages>(cacheKey);
  if (cached) return cached;

  const langs = await ghFetch<RepoLanguages>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
    token,
  );
  setCache(cacheKey, langs);
  return langs;
}

/** Fetch repository file tree paths (used for infra detection, including nested folders) */
async function fetchRepoTreePaths(
  owner: string,
  repo: string,
  token?: string,
): Promise<string[]> {
  const cacheKey = `gh_tree_${owner}_${repo}`;
  const cached = getCached<string[]>(cacheKey);
  if (cached) return cached;

  try {
    const tree = await ghFetch<{
      tree?: Array<{ path?: string; type?: string }>;
      truncated?: boolean;
    }>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/HEAD?recursive=1`,
      token,
    );
    const paths =
      tree.tree
        ?.map((entry) => entry.path?.toLowerCase())
        .filter((v): v is string => Boolean(v)) ?? [];

    if (paths.length > 0) {
      setCache(cacheKey, paths);
      return paths;
    }

    // Fallback for repos where recursive tree isn't available.
    const contents = await ghFetch<Array<{ name: string; type: string }>>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/`,
      token,
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
        topics: string[];
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
          topics: string[];
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
    topics: string[],
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
        topics,
        stars,
        updatedAt,
        archived,
      });
    }
  };

  for (const repo of repos) {
    const repoPaths = rootFilesMap.get(repo.name) ?? [];
    const hasPackageJson = repoPaths.some(
      (p) => p === 'package.json' || p.endsWith('/package.json'),
    );
    const repoLanguageSkills = new Set<string>();

    const addLanguageSkill = (skillName: string) => {
      repoLanguageSkills.add(skillName);
      addSkill(
        skillName,
        repo.name,
        repo.html_url,
        repo.homepage,
        repo.topics,
        repo.stargazers_count,
        repo.updated_at,
        repo.archived,
      );
    };

    // 1. Detect from primary language
    if (repo.language) {
      const normalized = normalizeLang(repo.language);
      if (normalized) {
        addLanguageSkill(normalized);
      }
    }

    // 2. Detect from language breakdown (normalized to our skill names)
    const langs = languageMaps.get(repo.name);
    if (langs) {
      for (const lang of Object.keys(langs)) {
        const normalized = normalizeLang(lang);
        if (normalized) {
          addLanguageSkill(normalized);
        }
      }
    }

    // Fullstack hint: package.json means JavaScript/TypeScript are likely present.
    if (hasPackageJson) {
      for (const lang of JS_TS_LANGUAGE_SKILLS) {
        addLanguageSkill(lang);
      }
    }

    // 3. Detect from topics using keyword map
    const searchText = [...repo.topics, repo.description ?? '', repo.name]
      .join(' ')
      .toLowerCase();

    for (const [skillName, keywords] of Object.entries(TECH_KEYWORDS)) {
      if (
        keywords.some((kw) => searchText.includes(kw)) &&
        isSkillCompatibleWithLanguages(skillName, repoLanguageSkills)
      ) {
        addSkill(
          skillName,
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
    }

    // 4. Detect from repository file tree (infra/testing candidates)
    // This catches infra/testing patterns even when topics/descriptions are missing.
    // even when the developer hasn't set explicit topics.
    if (repoPaths.length > 0) {
      // GitHub Actions: .github directory is a reliable signal
      if (repoPaths.some((p) => p === '.github' || p.startsWith('.github/'))) {
        addSkill(
          'GitHub Actions',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
      // Kubernetes: canonical folder names anywhere in the repository tree
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
        repoPaths.some((p) =>
          k8sIndicators.some(
            (d) => p.split('/').includes(d) || p.startsWith(`${d}/`),
          ),
        )
      ) {
        addSkill(
          'Kubernetes',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
      // Helm: chart metadata or chart folders in repo tree
      if (
        repoPaths.some(
          (p) =>
            p === 'chart.yaml' ||
            p.endsWith('/chart.yaml') ||
            p.split('/').includes('charts') ||
            p.endsWith('/helmfile.yaml') ||
            p.endsWith('/helmfile.yml') ||
            p === 'helmfile.yaml' ||
            p === 'helmfile.yml',
        )
      ) {
        addSkill(
          'Helm',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
      // Terraform: .tf/.tfvars files or terraform/ directory anywhere
      if (
        repoPaths.some(
          (p) =>
            p.endsWith('.tf') ||
            p.endsWith('.tfvars') ||
            p.split('/').includes('terraform'),
        )
      ) {
        addSkill(
          'Terraform',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
      // Ansible
      if (
        repoPaths.some(
          (p) =>
            p.split('/').includes('ansible') ||
            p === 'galaxy.yml' ||
            p.endsWith('/galaxy.yml') ||
            p.includes('playbook'),
        )
      ) {
        addSkill(
          'Ansible',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }

      // Storybook
      if (
        repoPaths.some(
          (p) =>
            p === '.storybook' ||
            p.startsWith('.storybook/') ||
            p.includes('.stories.'),
        )
      ) {
        addSkill(
          'Storybook',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }

      // Testing tool detection from file conventions/configs
      const hasJest = repoPaths.some(
        (p) =>
          p === 'jest.config.js' ||
          p === 'jest.config.ts' ||
          p.endsWith('/jest.config.js') ||
          p.endsWith('/jest.config.ts') ||
          p.includes('/__tests__/') ||
          /\.(test|spec)\.[cm]?[jt]sx?$/.test(p),
      );
      if (hasJest) {
        addSkill(
          'Jest',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }

      const hasVitest = repoPaths.some(
        (p) =>
          p === 'vitest.config.ts' ||
          p === 'vitest.config.js' ||
          p.endsWith('/vitest.config.ts') ||
          p.endsWith('/vitest.config.js'),
      );
      if (hasVitest) {
        addSkill(
          'Vitest',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }

      const hasCypress = repoPaths.some(
        (p) =>
          p === 'cypress' ||
          p.startsWith('cypress/') ||
          p === 'cypress.config.ts' ||
          p === 'cypress.config.js' ||
          p.endsWith('/cypress.config.ts') ||
          p.endsWith('/cypress.config.js'),
      );
      if (hasCypress) {
        addSkill(
          'Cypress',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }

      const hasPlaywright = repoPaths.some(
        (p) =>
          p === 'playwright.config.ts' ||
          p === 'playwright.config.js' ||
          p.endsWith('/playwright.config.ts') ||
          p.endsWith('/playwright.config.js') ||
          p.includes('/playwright/'),
      );
      if (hasPlaywright) {
        addSkill(
          'Playwright',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }

      const hasPytest = repoPaths.some(
        (p) =>
          p === 'pytest.ini' ||
          p.endsWith('/pytest.ini') ||
          p === 'conftest.py' ||
          p.endsWith('/conftest.py') ||
          /(^|\/)test_.*\.py$/.test(p) ||
          /_test\.py$/.test(p),
      );
      if (hasPytest) {
        addSkill(
          'Pytest',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }

      const hasMocha = repoPaths.some(
        (p) =>
          p === '.mocharc.json' ||
          p === '.mocharc.js' ||
          p === 'mocha.opts' ||
          p.endsWith('/.mocharc.json') ||
          p.endsWith('/.mocharc.js') ||
          p.endsWith('/mocha.opts'),
      );
      if (hasMocha) {
        addSkill(
          'Mocha',
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived,
        );
      }
    }
  }

  return skillMap;
}

export const __testables = {
  detectSkillsFromRepos,
  isSkillCompatibleWithLanguages,
};

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
          topics: string[];
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
          repoTopics: repoEntries.map(([, info]) => info.topics),
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
        repoTopics: repoEntries.map(([, info]) => info.topics),
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

/**
 * Scan user's GitHub profile
 * - Without token: Fast mode (~1-3 requests) - analyzes primary language only
 * - With token: Detailed mode (~100+ requests) - analyzes all languages & file structure
 */
export async function scanUser(
  username: string,
  token?: string,
  onProgress?: (progress: ScanProgress) => void,
  options?: { includeArchived?: boolean },
): Promise<ScanResult> {
  const includeArchived = options?.includeArchived ?? true;

  onProgress?.({ phase: 'user' });
  const user = await fetchUser(username, token);

  onProgress?.({ phase: 'repos' });
  const repos = await fetchRepos(username, includeArchived, token);

  // If no token: fast mode (only primary language + topics)
  if (!token) {
    onProgress?.({ phase: 'analyzing' });
    const skillMap = detectSkillsFromRepos(repos, new Map(), new Map());
    const categories = categorizeSkills(skillMap);

    onProgress?.({ phase: 'done' });
    return {
      user,
      categories,
      totalRepos: repos.length,
      scannedRepos: repos.length,
    };
  }

  // With token: detailed mode (languages + file tree for better detection)
  const sortedRepos = [...repos].sort(
    (a, b) => b.stargazers_count - a.stargazers_count || b.size - b.size,
  );
  const languageMaps = new Map<string, RepoLanguages>();

  // Fetch languages in parallel (max 5 concurrent)
  onProgress?.({
    phase: 'languages',
    current: 0,
    total: sortedRepos.length,
  });

  const languageTasks = sortedRepos.map((repo, idx) => async () => {
    onProgress?.({
      phase: 'languages',
      current: idx + 1,
      total: sortedRepos.length,
    });

    if (repo.language) {
      return { repo: repo.name, langs: {} as RepoLanguages };
    }
    const langs = await fetchRepoLanguages(username, repo.name, token);
    return { repo: repo.name, langs };
  });

  const languageResults = await pLimit(languageTasks, 5);
  languageResults.forEach(({ repo, langs }) => {
    languageMaps.set(repo, langs);
  });

  // Fetch file tree for infra/testing detection
  const infraLanguages = new Set([
    null,
    undefined,
    'YAML',
    'HCL',
    'Shell',
    'Dockerfile',
  ]);
  const infraRepos = sortedRepos.filter((r) =>
    infraLanguages.has(r.language ?? null),
  );

  const fullstackCandidateLanguages = new Set([
    'Go',
    'Python',
    'Java',
    'C#',
    'Rust',
    'Ruby',
    'PHP',
    'Kotlin',
    'Scala',
  ]);
  const fullstackHint = /fullstack|full-stack|frontend|ui|web/i;
  const fullstackRepos = sortedRepos
    .filter((r) => {
      const lang = r.language ?? '';
      if (fullstackCandidateLanguages.has(lang)) return true;
      const text = `${r.name} ${r.description ?? ''} ${r.topics.join(' ')}`;
      return fullstackHint.test(text);
    })
    .slice(0, 40);

  const testingLanguages = new Set(['JavaScript', 'TypeScript', 'Python']);
  const testingHint =
    /test|testing|storybook|cypress|playwright|jest|vitest|pytest|mocha/i;
  const testingRepos = sortedRepos
    .filter((r) => {
      if (testingLanguages.has(r.language ?? '')) return true;
      const text = `${r.name} ${r.description ?? ''} ${r.topics.join(' ')}`;
      return testingHint.test(text);
    })
    .slice(0, 8);

  const treeRepoMap = new Map<string, GitHubRepo>();
  for (const repo of [...infraRepos, ...testingRepos, ...fullstackRepos]) {
    treeRepoMap.set(repo.name, repo);
  }
  const treeRepos = [...treeRepoMap.values()];

  const rootFilesMap = new Map<string, string[]>();

  // Fetch tree paths in parallel (max 5 concurrent)
  const treeTasks = treeRepos.map((repo, idx) => async () => {
    onProgress?.({
      phase: 'languages',
      current: sortedRepos.length + idx + 1,
      total: sortedRepos.length + treeRepos.length,
    });
    const files = await fetchRepoTreePaths(username, repo.name, token);
    return { repo: repo.name, files };
  });

  const treeResults = await pLimit(treeTasks, 5);
  treeResults.forEach(({ repo, files }) => {
    rootFilesMap.set(repo, files);
  });

  onProgress?.({ phase: 'analyzing' });
  const skillMap = detectSkillsFromRepos(repos, languageMaps, rootFilesMap);
  const categories = categorizeSkills(skillMap);

  onProgress?.({ phase: 'done' });

  return {
    user,
    categories,
    totalRepos: repos.length,
    scannedRepos: sortedRepos.length,
  };
}
