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

/** Fetch all non-fork, non-archived repos (paginated, up to 300) */
export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const cacheKey = `gh_repos_${username}`;
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

  const filtered = allRepos.filter((r) => !r.fork && !r.archived);
  setCache(cacheKey, filtered);
  return filtered;
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

/** Detect skills from a set of repos */
function detectSkillsFromRepos(
  repos: GitHubRepo[],
  languageMaps: Map<string, RepoLanguages>,
): Map<
  string,
  { repos: Map<string, { url: string; homepage: string | null }> }
> {
  const skillMap = new Map<
    string,
    { repos: Map<string, { url: string; homepage: string | null }> }
  >();

  const addSkill = (
    skillName: string,
    repoName: string,
    repoUrl: string,
    homepage: string | null,
  ) => {
    if (!skillMap.has(skillName)) {
      skillMap.set(skillName, { repos: new Map() });
    }
    const entry = skillMap.get(skillName)!;
    if (!entry.repos.has(repoName)) {
      entry.repos.set(repoName, { url: repoUrl, homepage });
    }
  };

  for (const repo of repos) {
    // 1. Detect from primary language
    if (repo.language) {
      addSkill(repo.language, repo.name, repo.html_url, repo.homepage);
    }

    // 2. Detect from language breakdown
    const langs = languageMaps.get(repo.name);
    if (langs) {
      for (const lang of Object.keys(langs)) {
        addSkill(lang, repo.name, repo.html_url, repo.homepage);
      }
    }

    // 3. Detect from topics using keyword map
    const searchText = [...repo.topics, repo.description ?? '', repo.name]
      .join(' ')
      .toLowerCase();

    for (const [skillName, keywords] of Object.entries(TECH_KEYWORDS)) {
      if (keywords.some((kw) => searchText.includes(kw))) {
        addSkill(skillName, repo.name, repo.html_url, repo.homepage);
      }
    }
  }

  return skillMap;
}

/** Organize detected skills into categories */
function categorizeSkills(
  skillMap: Map<
    string,
    { repos: Map<string, { url: string; homepage: string | null }> }
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
): Promise<ScanResult> {
  onProgress?.({ phase: 'user' });
  const user = await fetchUser(username);

  onProgress?.({ phase: 'repos' });
  const repos = await fetchRepos(username);

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

  onProgress?.({ phase: 'analyzing' });
  const skillMap = detectSkillsFromRepos(repos, languageMaps);
  const categories = categorizeSkills(skillMap);

  onProgress?.({ phase: 'done' });

  return {
    user,
    categories,
    totalRepos: repos.length,
    scannedRepos: reposToScan.length,
  };
}
