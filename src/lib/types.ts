export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  html_url: string;
}

export interface GitHubRepo {
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
  size: number;
}

export interface RepoLanguages {
  [language: string]: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  repos: string[];
  repoUrls: string[];
  repoHomepages: (string | null)[];
  repoTopics: string[][];
  repoStars: number[];
  repoUpdatedAt: string[];
  repoArchived: boolean[];
}

export interface ScanResult {
  user: GitHubUser;
  categories: SkillCategory[];
  totalRepos: number;
  scannedRepos: number;
}

export interface ApiErrorResponse {
  error: string;
}
