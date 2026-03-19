import { c as createComponent } from './astro-component_B53dHmGQ.mjs';
import 'piccolore';
import { r as renderTemplate, l as renderSlot, h as addAttribute, n as renderHead, o as defineScriptVars, u as unescapeHTML, p as renderComponent } from './entrypoint_BXPLeSWz.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useMemo, useEffect, useCallback } from 'react';
import 'clsx';

const CONSENT_KEY = "ga_consent";
function hasGaConsent() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}
function normalizeParams(params) {
  return Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (value === null || value === void 0) return acc;
      acc[key] = value;
      return acc;
    },
    {}
  );
}
function trackAnalyticsEvent(name, params = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  if (!hasGaConsent()) return;
  window.gtag("event", name, normalizeParams(params));
}

const TECH_KEYWORDS = {
  // Languages
  JavaScript: ["javascript", "js"],
  TypeScript: ["typescript", "ts"],
  Python: ["python", "py"],
  Java: ["java"],
  // C# and ASP.NET/.NET are one ecosystem — merged into a single skill
  "C# / .NET": [
    "csharp",
    "c-sharp",
    "dotnet",
    ".net",
    "aspnet",
    "asp-net",
    "asp-net-core",
    "blazor",
    "wpf"
  ],
  "C++": ["cpp", "c-plus-plus", "cplusplus"],
  C: ["c-lang"],
  Go: ["golang", "go"],
  Rust: ["rust", "rust-lang"],
  Ruby: ["ruby"],
  PHP: ["php"],
  Swift: ["swift"],
  Kotlin: ["kotlin"],
  Scala: ["scala"],
  R: ["r-lang", "rstats"],
  Dart: ["dart"],
  Elixir: ["elixir"],
  Haskell: ["haskell"],
  Lua: ["lua"],
  Perl: ["perl"],
  Shell: ["shell", "bash", "zsh", "shellscript"],
  // Frontend
  React: ["react", "reactjs", "react-js"],
  Vue: ["vue", "vuejs", "vue-js"],
  Angular: ["angular", "angularjs"],
  Svelte: ["svelte", "sveltekit"],
  "Next.js": ["nextjs", "next-js", "next"],
  Nuxt: ["nuxt", "nuxtjs"],
  Astro: ["astro", "astrojs"],
  Gatsby: ["gatsby", "gatsbyjs"],
  "Tailwind CSS": ["tailwindcss", "tailwind", "tailwind-css"],
  Bootstrap: ["bootstrap"],
  "Material UI": ["material-ui", "mui"],
  "Styled Components": ["styled-components"],
  HTML: ["html"],
  CSS: ["css"],
  Sass: ["sass", "scss"],
  Redux: ["redux"],
  Zustand: ["zustand"],
  Vite: ["vite", "vitejs"],
  Webpack: ["webpack"],
  // Backend
  "Node.js": ["nodejs", "node", "node-js"],
  Express: ["express", "expressjs"],
  Fastify: ["fastify"],
  NestJS: ["nestjs", "nest-js"],
  Django: ["django"],
  Flask: ["flask"],
  FastAPI: ["fastapi", "fast-api"],
  "Spring Boot": ["spring-boot", "spring", "springboot"],
  "Ruby on Rails": ["rails", "ruby-on-rails"],
  Laravel: ["laravel"],
  Gin: ["gin", "gin-gonic"],
  Fiber: ["fiber", "gofiber"],
  Actix: ["actix", "actix-web"],
  // Databases
  PostgreSQL: ["postgresql", "postgres", "psql"],
  MySQL: ["mysql"],
  MongoDB: ["mongodb", "mongo"],
  Redis: ["redis"],
  SQLite: ["sqlite"],
  Elasticsearch: ["elasticsearch", "elastic"],
  Cassandra: ["cassandra"],
  DynamoDB: ["dynamodb"],
  Firebase: ["firebase", "firestore"],
  Supabase: ["supabase"],
  Prisma: ["prisma"],
  Drizzle: ["drizzle"],
  // DevOps & Cloud
  Docker: ["docker", "dockerfile", "docker-compose"],
  // k8s: catch both formal and shorthand naming, plus gitops tools
  Kubernetes: [
    "kubernetes",
    "k8s",
    "kube",
    "kubectl",
    "gitops",
    "kustomize",
    "flux"
  ],
  AWS: ["aws", "amazon-web-services"],
  GCP: ["gcp", "google-cloud", "google-cloud-platform"],
  Azure: ["azure", "microsoft-azure"],
  Terraform: ["terraform", "opentofu"],
  Ansible: ["ansible"],
  // GitHub Actions: topic github-actions is common; gha shorthand also used
  "GitHub Actions": ["github-actions", "github-action", "gha"],
  Jenkins: ["jenkins"],
  Nginx: ["nginx"],
  Helm: ["helm", "helmfile"],
  ArgoCD: ["argocd", "argo-cd", "argo"],
  Prometheus: ["prometheus"],
  Grafana: ["grafana"],
  // Mobile
  "React Native": ["react-native", "reactnative"],
  Flutter: ["flutter"],
  SwiftUI: ["swiftui"],
  Android: ["android"],
  Expo: ["expo"],
  // ML/AI
  TensorFlow: ["tensorflow"],
  PyTorch: ["pytorch"],
  "Scikit-learn": ["scikit-learn", "sklearn"],
  Pandas: ["pandas"],
  NumPy: ["numpy"],
  Jupyter: ["jupyter", "jupyter-notebook"],
  OpenAI: ["openai", "gpt", "chatgpt"],
  LangChain: ["langchain"],
  "Hugging Face": ["huggingface", "hugging-face", "transformers"],
  // Testing
  Jest: ["jest"],
  Vitest: ["vitest"],
  Cypress: ["cypress"],
  Playwright: ["playwright"],
  Pytest: ["pytest"],
  Mocha: ["mocha"],
  Storybook: ["storybook"],
  // Tools & Infrastructure
  GraphQL: ["graphql", "gql"],
  gRPC: ["grpc"],
  WebSocket: ["websocket", "websockets", "ws"],
  RabbitMQ: ["rabbitmq"],
  Kafka: ["kafka"],
  Monorepo: ["monorepo", "turborepo", "lerna", "nx"],
  Microservices: ["microservices", "microservice"],
  OAuth: ["oauth", "oauth2"],
  JWT: ["jwt", "json-web-token"]
};
const SKILL_CATEGORIES = {
  Languages: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C",
    "Go",
    "Rust",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Scala",
    "R",
    "Dart",
    "Elixir",
    "Haskell",
    "Lua",
    "Perl",
    "Shell"
  ],
  Frontend: [
    "React",
    "Vue",
    "Angular",
    "Svelte",
    "Next.js",
    "Nuxt",
    "Astro",
    "Gatsby",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Styled Components",
    "HTML",
    "CSS",
    "Sass",
    "Redux",
    "Zustand",
    "Vite",
    "Webpack"
  ],
  Backend: [
    "C# / .NET",
    "Node.js",
    "Express",
    "Fastify",
    "NestJS",
    "Django",
    "Flask",
    "FastAPI",
    "Spring Boot",
    "Ruby on Rails",
    "Laravel",
    "Gin",
    "Fiber",
    "Actix"
  ],
  Databases: [
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "SQLite",
    "Elasticsearch",
    "Cassandra",
    "DynamoDB",
    "Firebase",
    "Supabase",
    "Prisma",
    "Drizzle"
  ],
  "DevOps & Cloud": [
    "Docker",
    "Kubernetes",
    "AWS",
    "GCP",
    "Azure",
    "Terraform",
    "Ansible",
    "GitHub Actions",
    "Jenkins",
    "Nginx",
    "Helm",
    "ArgoCD",
    "Prometheus",
    "Grafana"
  ],
  Mobile: ["React Native", "Flutter", "SwiftUI", "Android", "Expo"],
  "ML & AI": [
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Jupyter",
    "OpenAI",
    "LangChain",
    "Hugging Face"
  ],
  Testing: [
    "Jest",
    "Vitest",
    "Cypress",
    "Playwright",
    "Pytest",
    "Mocha",
    "Storybook"
  ],
  "Tools & Infrastructure": [
    "GraphQL",
    "gRPC",
    "WebSocket",
    "RabbitMQ",
    "Kafka",
    "Monorepo",
    "Microservices",
    "OAuth",
    "JWT"
  ]
};

const API_BASE = "https://api.github.com";
const CACHE_TTL = 60 * 60 * 1e3;
function getCached(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}
function setCache(key, data) {
  try {
    const entry = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
  }
}
async function pLimit(tasks, limit = 5) {
  const results = new Array(tasks.length);
  const executing = [];
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const promise = Promise.resolve().then(() => task()).then((result) => {
      results[i] = result;
    });
    executing.push(promise);
    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p === promise),
        1
      );
    }
  }
  await Promise.all(executing);
  return results;
}
async function ghFetch(path, token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (res.status === 403) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      const resetTime = Number(res.headers.get("x-ratelimit-reset")) * 1e3;
      const waitMin = Math.ceil((resetTime - Date.now()) / 6e4);
      throw new Error(
        `GitHub API rate limit exceeded. Resets in ~${waitMin} minutes.`
      );
    }
  }
  if (res.status === 404) {
    throw new Error("User not found. Check the username and try again.");
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
function parseUsername(input) {
  const trimmed = input.trim().replace(/\/+$/, "");
  try {
    const url = new URL(trimmed);
    if (url.hostname === "github.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 1) return parts[0];
    }
  } catch {
  }
  return trimmed.replace(/^@/, "");
}
async function fetchUser(username, token) {
  const cacheKey = `gh_user_${username}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const user = await ghFetch(
    `/users/${encodeURIComponent(username)}`,
    token
  );
  setCache(cacheKey, user);
  return user;
}
async function fetchRepos(username, includeArchived = true, token) {
  const cacheKey = `gh_repos_${username}_${includeArchived ? "with_archived" : "no_archived"}_${token ? "with_token" : "no_token"}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const allRepos = [];
  const perPage = 100;
  const maxPages = token ? Infinity : 1;
  for (let page = 1; page <= maxPages; page++) {
    const repos = await ghFetch(
      `/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated&type=owner`,
      token
    );
    allRepos.push(...repos);
    if (repos.length < perPage) break;
  }
  const filtered = allRepos.filter(
    (r) => !r.fork && (includeArchived || !r.archived)
  );
  setCache(cacheKey, filtered);
  return filtered;
}
const LANG_NORMALIZER = {
  "C#": "C# / .NET",
  "ASP.NET": "C# / .NET",
  "ASP.NET Core": "C# / .NET",
  Dockerfile: "Docker",
  HCL: "Terraform",
  "Jupyter Notebook": "Jupyter",
  SCSS: "Sass",
  CSS: "CSS",
  HTML: "HTML",
  Batchfile: null,
  PowerShell: "Shell",
  Makefile: null,
  YAML: null,
  // k8s/GitHub Actions detected via file tree, not raw YAML language
  JSON: null,
  Markdown: null,
  "GitHub Actions Workflow": null
  // dedupe — detected via keywords/file tree
};
function normalizeLang(lang) {
  if (lang in LANG_NORMALIZER) return LANG_NORMALIZER[lang];
  return lang;
}
async function fetchRepoLanguages(owner, repo, token) {
  const cacheKey = `gh_langs_${owner}_${repo}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const langs = await ghFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
    token
  );
  setCache(cacheKey, langs);
  return langs;
}
async function fetchRepoTreePaths(owner, repo, token) {
  const cacheKey = `gh_tree_${owner}_${repo}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  try {
    const tree = await ghFetch(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/HEAD?recursive=1`,
      token
    );
    const paths = tree.tree?.map((entry) => entry.path?.toLowerCase()).filter((v) => Boolean(v)) ?? [];
    if (paths.length > 0) {
      setCache(cacheKey, paths);
      return paths;
    }
    const contents = await ghFetch(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/`,
      token
    );
    const names = contents.map((f) => f.name.toLowerCase());
    setCache(cacheKey, names);
    return names;
  } catch {
    return [];
  }
}
function detectSkillsFromRepos(repos, languageMaps, rootFilesMap) {
  const skillMap = /* @__PURE__ */ new Map();
  const addSkill = (skillName, repoName, repoUrl, homepage, topics, stars, updatedAt, archived) => {
    if (!skillMap.has(skillName)) {
      skillMap.set(skillName, { repos: /* @__PURE__ */ new Map() });
    }
    const entry = skillMap.get(skillName);
    if (!entry.repos.has(repoName)) {
      entry.repos.set(repoName, {
        url: repoUrl,
        homepage,
        topics,
        stars,
        updatedAt,
        archived
      });
    }
  };
  for (const repo of repos) {
    if (repo.language) {
      const normalized = normalizeLang(repo.language);
      if (normalized) {
        addSkill(
          normalized,
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
    }
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
            repo.topics,
            repo.stargazers_count,
            repo.updated_at,
            repo.archived
          );
        }
      }
    }
    const searchText = [...repo.topics, repo.description ?? "", repo.name].join(" ").toLowerCase();
    for (const [skillName, keywords] of Object.entries(TECH_KEYWORDS)) {
      if (keywords.some((kw) => searchText.includes(kw))) {
        addSkill(
          skillName,
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
    }
    const repoPaths = rootFilesMap.get(repo.name) ?? [];
    if (repoPaths.length > 0) {
      if (repoPaths.some((p) => p === ".github" || p.startsWith(".github/"))) {
        addSkill(
          "GitHub Actions",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
      const k8sIndicators = [
        "k8s",
        "kubernetes",
        "manifests",
        "kustomize",
        "gitops",
        "flux",
        "argocd"
      ];
      if (repoPaths.some(
        (p) => k8sIndicators.some(
          (d) => p.split("/").includes(d) || p.startsWith(`${d}/`)
        )
      )) {
        addSkill(
          "Kubernetes",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
      if (repoPaths.some(
        (p) => p === "chart.yaml" || p.endsWith("/chart.yaml") || p.split("/").includes("charts") || p.endsWith("/helmfile.yaml") || p.endsWith("/helmfile.yml") || p === "helmfile.yaml" || p === "helmfile.yml"
      )) {
        addSkill(
          "Helm",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
      if (repoPaths.some(
        (p) => p.endsWith(".tf") || p.endsWith(".tfvars") || p.split("/").includes("terraform")
      )) {
        addSkill(
          "Terraform",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
      if (repoPaths.some(
        (p) => p.split("/").includes("ansible") || p === "galaxy.yml" || p.endsWith("/galaxy.yml") || p.includes("playbook")
      )) {
        addSkill(
          "Ansible",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
      if (repoPaths.some(
        (p) => p === ".storybook" || p.startsWith(".storybook/") || p.includes(".stories.")
      )) {
        addSkill(
          "Storybook",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
      const hasJest = repoPaths.some(
        (p) => p === "jest.config.js" || p === "jest.config.ts" || p.endsWith("/jest.config.js") || p.endsWith("/jest.config.ts") || p.includes("/__tests__/") || /\.(test|spec)\.[cm]?[jt]sx?$/.test(p)
      );
      if (hasJest) {
        addSkill(
          "Jest",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
      const hasVitest = repoPaths.some(
        (p) => p === "vitest.config.ts" || p === "vitest.config.js" || p.endsWith("/vitest.config.ts") || p.endsWith("/vitest.config.js")
      );
      if (hasVitest) {
        addSkill(
          "Vitest",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
      const hasCypress = repoPaths.some(
        (p) => p === "cypress" || p.startsWith("cypress/") || p === "cypress.config.ts" || p === "cypress.config.js" || p.endsWith("/cypress.config.ts") || p.endsWith("/cypress.config.js")
      );
      if (hasCypress) {
        addSkill(
          "Cypress",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
      const hasPlaywright = repoPaths.some(
        (p) => p === "playwright.config.ts" || p === "playwright.config.js" || p.endsWith("/playwright.config.ts") || p.endsWith("/playwright.config.js") || p.includes("/playwright/")
      );
      if (hasPlaywright) {
        addSkill(
          "Playwright",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
      const hasPytest = repoPaths.some(
        (p) => p === "pytest.ini" || p.endsWith("/pytest.ini") || p === "conftest.py" || p.endsWith("/conftest.py") || /(^|\/)test_.*\.py$/.test(p) || /_test\.py$/.test(p)
      );
      if (hasPytest) {
        addSkill(
          "Pytest",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
      const hasMocha = repoPaths.some(
        (p) => p === ".mocharc.json" || p === ".mocharc.js" || p === "mocha.opts" || p.endsWith("/.mocharc.json") || p.endsWith("/.mocharc.js") || p.endsWith("/mocha.opts")
      );
      if (hasMocha) {
        addSkill(
          "Mocha",
          repo.name,
          repo.html_url,
          repo.homepage,
          repo.topics,
          repo.stargazers_count,
          repo.updated_at,
          repo.archived
        );
      }
    }
  }
  return skillMap;
}
function categorizeSkills(skillMap) {
  const categories = [];
  for (const [categoryName, skillNames] of Object.entries(SKILL_CATEGORIES)) {
    const skills = [];
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
          repoArchived: repoEntries.map(([, info]) => info.archived)
        });
      }
    }
    if (skills.length > 0) {
      skills.sort((a, b) => b.repos.length - a.repos.length);
      categories.push({ name: categoryName, skills });
    }
  }
  const allCategorized = new Set(Object.values(SKILL_CATEGORIES).flat());
  const uncategorized = [];
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
        repoArchived: repoEntries.map(([, info]) => info.archived)
      });
    }
  }
  if (uncategorized.length > 0) {
    uncategorized.sort((a, b) => b.repos.length - a.repos.length);
    categories.push({ name: "Other", skills: uncategorized });
  }
  return categories;
}
async function scanUser(username, token, onProgress, options) {
  const includeArchived = options?.includeArchived ?? true;
  onProgress?.({ phase: "user" });
  const user = await fetchUser(username, token);
  onProgress?.({ phase: "repos" });
  const repos = await fetchRepos(username, includeArchived, token);
  if (!token) {
    onProgress?.({ phase: "analyzing" });
    const skillMap2 = detectSkillsFromRepos(repos, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map());
    const categories2 = categorizeSkills(skillMap2);
    onProgress?.({ phase: "done" });
    return {
      user,
      categories: categories2,
      totalRepos: repos.length,
      scannedRepos: repos.length
    };
  }
  const sortedRepos = [...repos].sort(
    (a, b) => b.stargazers_count - a.stargazers_count || b.size - b.size
  );
  const languageMaps = /* @__PURE__ */ new Map();
  onProgress?.({
    phase: "languages",
    current: 0,
    total: sortedRepos.length
  });
  const languageTasks = sortedRepos.map((repo, idx) => async () => {
    onProgress?.({
      phase: "languages",
      current: idx + 1,
      total: sortedRepos.length
    });
    if (repo.language) {
      return { repo: repo.name, langs: {} };
    }
    const langs = await fetchRepoLanguages(username, repo.name, token);
    return { repo: repo.name, langs };
  });
  const languageResults = await pLimit(languageTasks, 5);
  languageResults.forEach(({ repo, langs }) => {
    languageMaps.set(repo, langs);
  });
  const infraLanguages = /* @__PURE__ */ new Set([
    null,
    void 0,
    "YAML",
    "HCL",
    "Shell",
    "Dockerfile"
  ]);
  const infraRepos = sortedRepos.filter(
    (r) => infraLanguages.has(r.language ?? null)
  );
  const testingLanguages = /* @__PURE__ */ new Set(["JavaScript", "TypeScript", "Python"]);
  const testingHint = /test|testing|storybook|cypress|playwright|jest|vitest|pytest|mocha/i;
  const testingRepos = sortedRepos.filter((r) => {
    if (testingLanguages.has(r.language ?? "")) return true;
    const text = `${r.name} ${r.description ?? ""} ${r.topics.join(" ")}`;
    return testingHint.test(text);
  }).slice(0, 8);
  const treeRepoMap = /* @__PURE__ */ new Map();
  for (const repo of [...infraRepos, ...testingRepos]) {
    treeRepoMap.set(repo.name, repo);
  }
  const treeRepos = [...treeRepoMap.values()];
  const rootFilesMap = /* @__PURE__ */ new Map();
  const treeTasks = treeRepos.map((repo, idx) => async () => {
    onProgress?.({
      phase: "languages",
      current: sortedRepos.length + idx + 1,
      total: sortedRepos.length + treeRepos.length
    });
    const files = await fetchRepoTreePaths(username, repo.name, token);
    return { repo: repo.name, files };
  });
  const treeResults = await pLimit(treeTasks, 5);
  treeResults.forEach(({ repo, files }) => {
    rootFilesMap.set(repo, files);
  });
  onProgress?.({ phase: "analyzing" });
  const skillMap = detectSkillsFromRepos(repos, languageMaps, rootFilesMap);
  const categories = categorizeSkills(skillMap);
  onProgress?.({ phase: "done" });
  return {
    user,
    categories,
    totalRepos: repos.length,
    scannedRepos: sortedRepos.length
  };
}

const TOKEN_KEY = "github_token";
function saveToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    console.error("Failed to save token to localStorage");
  }
}
function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    console.error("Failed to clear token from localStorage");
  }
}
async function validateToken(token) {
  try {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json"
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

const FRAMEWORK_LANGUAGE_MAP = {
  React: "TS/JS",
  Vue: "TS/JS",
  Angular: "TypeScript",
  Svelte: "TS/JS",
  "Next.js": "TS/JS",
  Nuxt: "TS/JS",
  Astro: "TS/JS",
  Gatsby: "TS/JS",
  "Tailwind CSS": "CSS",
  Bootstrap: "CSS",
  "Material UI": "TS/JS",
  "Styled Components": "TS/JS",
  Sass: "CSS",
  Redux: "TS/JS",
  Zustand: "TS/JS",
  Vite: "TS/JS",
  Webpack: "JavaScript",
  "Node.js": "TS/JS",
  Express: "TS/JS",
  Fastify: "TS/JS",
  NestJS: "TypeScript",
  Django: "Python",
  Flask: "Python",
  FastAPI: "Python",
  "Spring Boot": "Java/Kotlin",
  "Ruby on Rails": "Ruby",
  Laravel: "PHP",
  Gin: "Go",
  Fiber: "Go",
  Actix: "Rust",
  "React Native": "TS/JS",
  Flutter: "Dart",
  SwiftUI: "Swift"
};
function skillDisplayName(skillName) {
  const lang = FRAMEWORK_LANGUAGE_MAP[skillName];
  return lang ? `${skillName} (${lang})` : skillName;
}
function toAnchor$1(text) {
  return `#${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}
function skillBadgeUrl(label) {
  const q = new URLSearchParams({
    label: "",
    message: label,
    color: "58a6ff",
    style: "flat"
  });
  return `https://img.shields.io/static/v1?${q.toString()}`;
}
function topicBadgeUrl(topic) {
  const q = new URLSearchParams({
    label: "topic",
    message: topic,
    color: "6e7681",
    style: "flat-square"
  });
  return `https://img.shields.io/static/v1?${q.toString()}`;
}
function generateMarkdown(result, options = {}) {
  const { user, categories } = result;
  const showStars = options.showStars ?? true;
  const showDemo = options.showDemo ?? true;
  const showArchived = options.showArchived ?? true;
  const showTopics = options.showTopics ?? true;
  const lines = [];
  lines.push(`# Tech Stack`);
  lines.push("");
  lines.push("## Skills by Category");
  lines.push("");
  for (const category of categories) {
    lines.push(`### ${category.name}`);
    const badges = category.skills.map((skill) => {
      const displayName = skillDisplayName(skill.name);
      const anchor = toAnchor$1(displayName);
      return `[![${displayName}](${skillBadgeUrl(displayName)})](${anchor})`;
    });
    lines.push(badges.join(" "));
    lines.push("");
  }
  lines.push("---");
  lines.push("");
  for (const category of categories) {
    lines.push(`## ${category.name}`);
    lines.push("");
    for (const skill of category.skills) {
      const displayName = skillDisplayName(skill.name);
      lines.push(`### ${displayName}`);
      lines.push("");
      const repos = skill.repos.map((repoName, i) => ({
        repoName,
        repoUrl: skill.repoUrls[i],
        homepage: skill.repoHomepages[i],
        topics: skill.repoTopics[i] ?? [],
        stars: skill.repoStars[i] ?? 0,
        updatedAt: skill.repoUpdatedAt[i] ?? "",
        archived: skill.repoArchived[i] ?? false
      }));
      repos.sort((a, b) => {
        const updatedDiff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        if (updatedDiff !== 0) return updatedDiff;
        return b.stars - a.stars;
      });
      for (const repo of repos) {
        let line = `- [${repo.repoName}](${repo.repoUrl})`;
        if (showArchived && repo.archived) {
          line += ` [![archived](https://img.shields.io/badge/archived-yes-6e7781?style=flat-square)](${repo.repoUrl})`;
        }
        if (showStars && repo.stars > 0) {
          line += ` [![stars](https://img.shields.io/badge/stars-${repo.stars}-1f6feb?style=flat-square)](${repo.repoUrl})`;
        }
        if (showDemo && repo.homepage) {
          line += ` [![demo](https://img.shields.io/badge/demo-live-2ea043?style=flat-square)](${repo.homepage})`;
        }
        lines.push(line);
        if (showTopics) {
          const topics = repo.topics.filter(Boolean).slice(0, 6).map(
            (topic) => `[![${topic}](${topicBadgeUrl(topic)})](${repo.repoUrl})`
          );
          if (topics.length > 0) {
            lines.push(`  ${topics.join(" ")}`);
          }
        }
      }
      lines.push("");
    }
  }
  lines.push("---");
  lines.push("");
  lines.push(
    "*Generated with [Hiring GitHub Readme](https://hiring-github-readme.vercel.app/)*"
  );
  lines.push("");
  return lines.join("\n");
}

function MarkdownPreview({ result }) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("preview");
  const [showStars, setShowStars] = useState(true);
  const [showDemo, setShowDemo] = useState(true);
  const [showArchived, setShowArchived] = useState(true);
  const [showTopics, setShowTopics] = useState(true);
  const markdown = useMemo(
    () => generateMarkdown(result, {
      showStars,
      showDemo,
      showArchived,
      showTopics
    }),
    [result, showArchived, showDemo, showStars, showTopics]
  );
  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    trackAnalyticsEvent("markdown_copied", {
      active_tab: tab,
      show_stars: showStars,
      show_demo: showDemo,
      show_archived: showArchived,
      show_topics: showTopics,
      markdown_length: markdown.length
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border border-gh-border rounded-t-lg bg-gh-bg-secondary px-4 py-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setTab("preview"),
              className: `px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${tab === "preview" ? "bg-gh-bg text-gh-text border border-gh-border" : "text-gh-text-secondary hover:text-gh-text"}`,
              children: "Preview"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setTab("raw"),
              className: `px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${tab === "raw" ? "bg-gh-bg text-gh-text border border-gh-border" : "text-gh-text-secondary hover:text-gh-text"}`,
              children: "Markdown"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 text-xs text-gh-text-secondary select-none", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: showStars,
              onChange: (e) => setShowStars(e.target.checked),
              className: "h-4 w-4 rounded border-gh-border bg-gh-bg text-gh-accent focus:ring-gh-accent"
            }
          ),
          "Stars"
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 text-xs text-gh-text-secondary select-none", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: showDemo,
              onChange: (e) => setShowDemo(e.target.checked),
              className: "h-4 w-4 rounded border-gh-border bg-gh-bg text-gh-accent focus:ring-gh-accent"
            }
          ),
          "Demo"
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 text-xs text-gh-text-secondary select-none", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: showArchived,
              onChange: (e) => setShowArchived(e.target.checked),
              className: "h-4 w-4 rounded border-gh-border bg-gh-bg text-gh-accent focus:ring-gh-accent"
            }
          ),
          "Archived"
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 text-xs text-gh-text-secondary select-none", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: showTopics,
              onChange: (e) => setShowTopics(e.target.checked),
              className: "h-4 w-4 rounded border-gh-border bg-gh-bg text-gh-accent focus:ring-gh-accent"
            }
          ),
          "Topics"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleCopy,
          className: "px-3 py-1.5 rounded text-sm font-medium bg-gh-green text-gh-bg hover:opacity-90 transition-opacity cursor-pointer",
          children: copied ? "✓ Copied!" : "Copy MD"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border border-t-0 border-gh-border rounded-b-lg bg-gh-bg overflow-auto", children: tab === "raw" ? /* @__PURE__ */ jsx("pre", { className: "p-4 text-sm text-gh-text font-mono whitespace-pre-wrap wrap-break-word", children: markdown }) : /* @__PURE__ */ jsx("div", { className: "p-6 gh-markdown", children: /* @__PURE__ */ jsx(RenderedMarkdown, { markdown }) }) })
  ] });
}
function RenderedMarkdown({ markdown }) {
  const html = useMemo(() => renderGfm(markdown), [markdown]);
  return /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: html } });
}
function toAnchor(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function renderGfm(md) {
  let html = escapeHtml(md);
  html = html.replace(/^### (.+)$/gm, (_match, p1) => {
    const id = toAnchor(p1);
    return `<h3 id="${id}" class="text-base font-semibold text-gh-text mt-6 mb-2 scroll-mt-4">${p1}</h3>`;
  });
  html = html.replace(
    /^## (.+)$/gm,
    (_match, p1) => `<h2 class="text-lg font-bold text-gh-text mt-8 mb-3 pb-1 border-b border-gh-border">${p1}</h2>`
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="text-2xl font-bold text-gh-text mb-4">$1</h1>'
  );
  html = html.replace(
    /^&gt; (.+)$/gm,
    '<blockquote class="pl-4 border-l-4 border-gh-border text-gh-text-secondary italic my-2">$1</blockquote>'
  );
  html = html.replace(/^---$/gm, '<hr class="border-gh-border my-6" />');
  html = html.replace(
    /\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g,
    '<a href="$3" class="inline-block mr-1 mb-1"><img src="$2" alt="$1" class="inline h-5" /></a>'
  );
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-gh-accent underline underline-offset-2 decoration-1 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent/70 rounded-sm">$1</a>'
  );
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(
    /^- (.+)$/gm,
    '<li class="ml-4 list-disc text-gh-text text-sm leading-relaxed">$1</li>'
  );
  html = html.replace(
    /((?:<li[^>]*>.*<\/li>\n?)+)/g,
    '<ul class="my-2 space-y-1">$1</ul>'
  );
  html = html.replace(
    /^(?!<[a-z/])(.+)$/gm,
    '<p class="text-sm text-gh-text-secondary my-1">$1</p>'
  );
  html = html.replace(/\n{2,}/g, "\n");
  return html;
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const PHASE_LABELS = {
  user: "Fetching user profile…",
  repos: "Loading repositories…",
  languages: "Scanning languages",
  analyzing: "Analyzing skills…",
  done: "Done!"
};
function ProgressBar({ progress }) {
  const phaseOrder = [
    "user",
    "repos",
    "languages",
    "analyzing",
    "done"
  ];
  const phaseIndex = phaseOrder.indexOf(progress.phase);
  const percentage = Math.round((phaseIndex + 1) / phaseOrder.length * 100);
  let label = PHASE_LABELS[progress.phase];
  if (progress.phase === "languages" && progress.current && progress.total) {
    label += ` (${progress.current}/${progress.total})`;
  }
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-xl mx-auto mt-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-gh-text-secondary mb-1", children: [
      /* @__PURE__ */ jsx("span", { children: label }),
      /* @__PURE__ */ jsxs("span", { children: [
        percentage,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-full bg-gh-bg-secondary rounded-full h-2 overflow-hidden border border-gh-border", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-full bg-gh-accent rounded-full transition-all duration-300",
        style: { width: `${percentage}%` }
      }
    ) })
  ] });
}

const LOG_TAG = "[gh-skills-scanner]";
function logScanClick(username, hasToken) {
  console.info(LOG_TAG, "scan", { username, hasToken });
}

function TokenInput({ onTokenChange }) {
  const [token, setToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const saved = getToken();
    setToken(saved);
  }, []);
  const handleAdd = async () => {
    if (!inputValue.trim()) {
      setError("Token cannot be empty");
      return;
    }
    setIsValidating(true);
    setError(null);
    const isValid = await validateToken(inputValue);
    if (!isValid) {
      setError("Invalid token. Make sure it has read:public_repo access.");
      setIsValidating(false);
      return;
    }
    saveToken(inputValue);
    setToken(inputValue);
    setInputValue("");
    setIsOpen(false);
    setIsValidating(false);
    trackAnalyticsEvent("token_saved", {
      source: "token_modal"
    });
    onTokenChange?.(inputValue);
  };
  const handleRemove = () => {
    clearToken();
    setToken(null);
    setInputValue("");
    trackAnalyticsEvent("token_removed", {
      source: "token_modal"
    });
    onTokenChange?.(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "token-input", children: [
    !token ? /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "btn-secondary",
        onClick: () => {
          const nextIsOpen = !isOpen;
          if (nextIsOpen) {
            trackAnalyticsEvent("token_modal_opened", {
              has_token: false
            });
          }
          setIsOpen(nextIsOpen);
        },
        title: "Add GitHub token to unlock fast scanning (5000 req/hr instead of 60)",
        children: "🔓 Add Token"
      }
    ) : /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "btn-secondary btn-active",
        onClick: () => {
          const nextIsOpen = !isOpen;
          if (nextIsOpen) {
            trackAnalyticsEvent("token_modal_opened", {
              has_token: true
            });
          }
          setIsOpen(nextIsOpen);
        },
        title: "Authenticated with GitHub token (5000 req/hr)",
        children: "✅ Token Active"
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: "token-modal", children: /* @__PURE__ */ jsxs("div", { className: "token-modal-content", children: [
      /* @__PURE__ */ jsx("h3", { children: "GitHub Personal Access Token" }),
      !token ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("p", { className: "token-info", children: [
          /* @__PURE__ */ jsx("strong", { children: "Without token:" }),
          " 60 requests/hour, fast basic analysis",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("strong", { children: "With token:" }),
          " 5,000 requests/hour, detailed analysis"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "token-input-field", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              value: inputValue,
              onChange: (e) => {
                setInputValue(e.target.value);
                setError(null);
              },
              placeholder: "ghp_xxxxxxxx...",
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAdd();
                }
              }
            }
          ),
          error && /* @__PURE__ */ jsx("span", { className: "token-error", children: error })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "token-actions", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleAdd,
              disabled: isValidating,
              children: isValidating ? "⏳ Validating..." : "✓ Add"
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsOpen(false), children: "✕ Cancel" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "token-hint", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://github.com/settings/tokens/new?scopes=public_repo&description=GitHub%20Skills%20Scanner",
              target: "_blank",
              rel: "noreferrer",
              children: "Create a Personal Access Token →"
            }
          ),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("small", { children: "Only read:public_repo scope needed. We never store or share it." })
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("p", { className: "token-info token-active", children: [
          "✅ Token is active and valid",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("strong", { children: "5,000 requests/hour" }),
          " available"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "token-actions", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleRemove,
              className: "btn-danger",
              children: "🔒 Remove Token"
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsOpen(false), children: "✕ Close" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
        .token-input {
          position: relative;
        }

        .btn-secondary {
          padding: 0.75rem 1.5rem;
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s;
          color: #e6edf3;
          white-space: nowrap;
        }

        .btn-secondary:hover {
          background: #1c2128;
          border-color: #58a6ff;
        }

        .btn-secondary.btn-active {
          border-color: #3fb950;
          color: white;
        }

        .btn-danger {
          background: #da3633;
          color: white;
          border: none;
        }

        .btn-danger:hover {
          background: #f85149;
        }

        .token-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .token-modal-content {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 1.5rem;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          color: #e6edf3;
        }

        .token-modal-content h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          color: #e6edf3;
        }

        .token-info {
          background: #0d1117;
          padding: 1rem;
          border-radius: 6px;
          margin: 1rem 0;
          font-size: 0.85rem;
          line-height: 1.4;
          border-left: 3px solid #58a6ff;
          color: #8b949e;
        }

        .token-info.token-active {
          background: #0d2d1a;
          border-left-color: #3fb950;
          color: #a4d65e;
        }

        .token-input-field {
          margin: 1rem 0;
        }

        .token-input-field input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #30363d;
          border-radius: 6px;
          font-size: 0.9rem;
          font-family: 'Courier New', monospace;
          box-sizing: border-box;
          background: #0d1117;
          color: #e6edf3;
        }

        .token-input-field input:focus {
          outline: none;
          border-color: #58a6ff;
          box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
        }

        .token-input-field input::placeholder {
          color: #8b949e;
        }

        .token-error {
          display: block;
          color: #f85149;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .token-actions {
          display: flex;
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .token-actions button {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #30363d;
          border-radius: 6px;
          background: #0d1117;
          color: #e6edf3;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .token-actions button:hover {
          background: #161b22;
          border-color: #58a6ff;
          color: #79c0ff;
        }

        .token-actions button:first-child {
          background: #238636;
          color: white;
          border-color: #238636;
        }

        .token-actions button:first-child:hover {
          background: #2ea043;
        }

        .token-actions button:first-child:disabled {
          background: #363b42;
          color: #8b949e;
          cursor: not-allowed;
        }

        .token-hint {
          font-size: 0.8rem;
          color: #8b949e;
          margin: 1rem 0 0 0;
          line-height: 1.4;
        }

        .token-hint a {
          color: #58a6ff;
          text-decoration: none;
        }

        .token-hint a:hover {
          text-decoration: underline;
          color: #79c0ff;
        }
      ` })
  ] });
}

function SearchBar({
  onSearch,
  isLoading,
  hasToken,
  includeArchived,
  onIncludeArchivedChange,
  onTokenChange,
  initialValue = ""
}) {
  const [input, setInput] = useState(initialValue);
  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "w-full max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "github-profile-input",
          name: "githubProfile",
          type: "text",
          value: input,
          onChange: (e) => setInput(e.target.value),
          placeholder: "Username or GitHub URL",
          disabled: isLoading,
          className: "flex-1 px-4 py-3 rounded-lg bg-gh-bg-secondary border border-gh-border text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:border-gh-accent focus:ring-1 focus:ring-gh-accent transition-colors disabled:opacity-50",
          "aria-label": "GitHub username or URL"
        }
      ),
      onTokenChange && /* @__PURE__ */ jsx(TokenInput, { onTokenChange }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isLoading || !input.trim(),
          onClick: () => logScanClick(input.trim(), hasToken),
          className: "px-6 py-3 rounded-lg bg-gh-green text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
          children: isLoading ? "Scanning…" : "Scan"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "mt-3 inline-flex items-center gap-2 text-sm text-gh-text-secondary select-none", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: includeArchived,
          onChange: (e) => onIncludeArchivedChange(e.target.checked),
          disabled: isLoading,
          className: "h-4 w-4 rounded border-gh-border bg-gh-bg-secondary text-gh-accent focus:ring-gh-accent disabled:opacity-50"
        }
      ),
      "Include archived repositories"
    ] })
  ] });
}

function SkillsList({ categories }) {
  const scrollToSkill = (skillName) => {
    const anchor = skillName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-3xl mx-auto space-y-4", children: categories.map((category) => /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xs font-semibold text-gh-text-secondary uppercase tracking-wide mb-2", children: category.name }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: category.skills.map((skill) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => scrollToSkill(skill.name),
        className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-gh-border bg-gh-bg-secondary text-gh-text hover:border-gh-accent hover:text-gh-accent transition-colors cursor-pointer",
        children: [
          skill.name,
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gh-text-secondary", children: skill.repos.length })
        ]
      },
      skill.name
    )) })
  ] }, category.name)) });
}

function UserCard({ user, totalRepos, scannedRepos }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 rounded-lg border border-gh-border bg-gh-bg-secondary max-w-xl mx-auto", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: user.avatar_url,
        alt: `${user.login}'s avatar`,
        className: "w-16 h-16 rounded-full border-2 border-gh-border",
        loading: "lazy"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: user.html_url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-gh-accent font-semibold text-lg hover:underline",
          children: user.name ?? user.login
        }
      ),
      user.name && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gh-text-secondary", children: [
        "@",
        user.login
      ] }),
      user.bio && /* @__PURE__ */ jsx("p", { className: "text-sm text-gh-text-secondary mt-1 truncate", children: user.bio }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-gh-text-secondary mt-1", children: [
        "Scanned ",
        scannedRepos,
        " of ",
        totalRepos,
        " repositories"
      ] })
    ] })
  ] });
}

function getInitialUsernameFromLocation() {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("u")?.trim();
  if (fromQuery) return fromQuery;
  const base = window.__BASE_URL__ || "/";
  const path = window.location.pathname;
  const relative = path.startsWith(base) ? path.slice(base.length) : path;
  return relative.split("/").filter(Boolean)[0] ?? "";
}
function sendGaPageView(path) {
  if (typeof window === "undefined") return;
  trackAnalyticsEvent("page_view", {
    page_location: window.location.href,
    page_path: path,
    page_title: document.title
  });
}
function sendVercelPageView(path) {
  if (typeof window === "undefined") return;
  if (typeof window.va !== "function") return;
  window.va("pageview", {
    page_path: path,
    path,
    route: path
  });
}
function setCanonicalProfilePath(username) {
  if (typeof window === "undefined") return;
  const clean = encodeURIComponent(username.trim());
  if (!clean) return;
  const base = window.__BASE_URL__ || "/";
  const targetPath = `${base}${clean}`.replace(/\/+/g, "/");
  const currentPath = window.location.pathname;
  if (currentPath === targetPath && !window.location.search) return;
  window.history.replaceState({}, "", targetPath);
  sendGaPageView(targetPath);
  sendVercelPageView(targetPath);
}
function getInitialConsent() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem("ga_consent");
  return value === "granted" || value === "denied" ? value : null;
}
function updateAnalyticsConsent(granted) {
  if (typeof window !== "undefined" && typeof window.setAnalyticsConsent === "function") {
    window.setAnalyticsConsent(granted);
  } else if (typeof window !== "undefined") {
    window.localStorage.setItem("ga_consent", granted ? "granted" : "denied");
  }
  return granted ? "granted" : "denied";
}
function App() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [includeArchived, setIncludeArchived] = useState(true);
  const [token, setToken] = useState(null);
  const [initialUsername, setInitialUsername] = useState("");
  const [hasAutoScanned, setHasAutoScanned] = useState(false);
  const [consent, setConsent] = useState(null);
  useEffect(() => {
    setIsHydrated(true);
    setToken(getToken());
    setInitialUsername(getInitialUsernameFromLocation());
    setConsent(getInitialConsent());
  }, []);
  const handleSearch = useCallback(
    async (input) => {
      const username = parseUsername(input);
      if (!username) return;
      trackAnalyticsEvent("scan_started", {
        has_token: Boolean(token),
        include_archived: includeArchived,
        trigger: "search"
      });
      setIsLoading(true);
      setError(null);
      setResult(null);
      setProgress({ phase: "user" });
      try {
        const scanResult = await scanUser(
          username,
          token ?? void 0,
          setProgress,
          {
            includeArchived
          }
        );
        const skillsDetected = scanResult.categories.reduce(
          (acc, category) => acc + category.skills.length,
          0
        );
        trackAnalyticsEvent("scan_completed", {
          has_token: Boolean(token),
          include_archived: includeArchived,
          scanned_repos: scanResult.scannedRepos,
          total_repos: scanResult.totalRepos,
          skills_detected: skillsDetected
        });
        setResult(scanResult);
        setCanonicalProfilePath(username);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [includeArchived, token]
  );
  useEffect(() => {
    if (!isHydrated || !initialUsername || hasAutoScanned) return;
    setHasAutoScanned(true);
    void handleSearch(initialUsername);
  }, [handleSearch, hasAutoScanned, initialUsername, isHydrated]);
  return /* @__PURE__ */ jsxs("main", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxs("header", { className: "py-12 px-4 text-center", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl sm:text-4xl font-bold text-gh-text mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-gh-accent", children: "GitHub" }),
        " Skills Scanner"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gh-text-secondary max-w-md mx-auto", children: "Enter a GitHub username or profile URL to extract developer skills and technologies." })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "px-4", children: /* @__PURE__ */ jsx(
      SearchBar,
      {
        onSearch: handleSearch,
        isLoading,
        hasToken: Boolean(token),
        includeArchived,
        onIncludeArchivedChange: setIncludeArchived,
        onTokenChange: setToken,
        initialValue: initialUsername
      }
    ) }),
    isLoading && progress && /* @__PURE__ */ jsx("section", { className: "px-4", children: /* @__PURE__ */ jsx(ProgressBar, { progress }) }),
    error && /* @__PURE__ */ jsx("div", { className: "max-w-xl mx-auto mt-6 px-4 py-3 rounded-lg border border-gh-red/50 bg-gh-red/10 text-gh-red text-sm", children: error }),
    result && /* @__PURE__ */ jsxs("section", { className: "px-4 py-8 space-y-8", children: [
      /* @__PURE__ */ jsx(
        UserCard,
        {
          user: result.user,
          totalRepos: result.totalRepos,
          scannedRepos: result.scannedRepos
        }
      ),
      /* @__PURE__ */ jsx(SkillsList, { categories: result.categories }),
      /* @__PURE__ */ jsx(MarkdownPreview, { result })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "mt-auto py-6 text-center text-sm text-gh-text/85 space-y-1", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "Made by",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://www.linkedin.com/in/mskvitalii/",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-gh-accent underline underline-offset-2 decoration-1 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent/70 rounded-sm",
            children: "Vitalii Popov"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Data from",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://docs.github.com/en/rest",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-gh-accent underline underline-offset-2 decoration-1 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent/70 rounded-sm",
            children: "GitHub API"
          }
        ),
        ". Rate limit: 60 requests/hour without token."
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/privacy",
            className: "text-gh-accent underline underline-offset-2 decoration-1 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent/70 rounded-sm",
            children: "Privacy Policy"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setConsent(null),
            className: "text-gh-accent underline underline-offset-2 decoration-1 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent/70 rounded-sm",
            children: "Manage Cookies"
          }
        )
      ] })
    ] }),
    isHydrated && consent === null && /* @__PURE__ */ jsx("aside", { className: "fixed inset-x-0 bottom-0 z-50 border-t border-gh-border/70 bg-gh-card/95 backdrop-blur px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gh-text-secondary", children: [
        "I use Google Analytics to understand product usage and improve the scanner. Read the",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/privacy",
            className: "text-gh-accent underline underline-offset-2 decoration-1 hover:decoration-2",
            children: "Privacy Policy"
          }
        ),
        "."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setConsent(updateAnalyticsConsent(false)),
            className: "px-3 py-2 rounded-md border border-gh-border text-gh-text-secondary hover:text-gh-text",
            children: "Decline"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setConsent(updateAnalyticsConsent(true)),
            className: "px-3 py-2 rounded-md bg-gh-accent text-gh-bg font-semibold hover:opacity-90",
            children: "Accept"
          }
        )
      ] })
    ] }) })
  ] });
}

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1, _b, _c;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Hiring GitHub Readme — Developer Skills Scanner",
    description = "Scan any GitHub profile to extract developer skills and technologies. Perfect for HR and recruiters."
  } = Astro2.props;
  const base = "/";
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  const ogImage = new URL(`${base}og-image.png`, Astro2.site);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Hiring GitHub Readme",
    description,
    url: canonicalURL.toString(),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    author: {
      "@type": "Person",
      name: "Vitalii Popov",
      url: "https://www.linkedin.com/in/mskvitalii/"
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
  return renderTemplate(_c || (_c = __template$1(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', '><meta name="generator"', '><meta name="theme-color" content="#0d1117"><meta name="author" content="Vitalii Popov"><meta name="keywords" content="github, developer skills, hiring, recruiter, HR, tech stack, portfolio, resume"><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:image"', '><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:site_name" content="Hiring GitHub Readme"><meta property="og:locale" content="en_US"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><link rel="canonical"', '><link rel="icon" type="image/svg+xml"', '><link rel="icon" type="image/png" sizes="192x192"', '><link rel="icon" type="image/png" sizes="512x512"', '><link rel="apple-touch-icon"', "><title>", '</title><!-- Structured Data --><script type="application/ld+json">', "</script><!-- Google Analytics -->", "", "", '</head> <body class="min-h-screen bg-gh-bg text-gh-text"', "> ", " </body></html>"])), addAttribute(description, "content"), addAttribute(Astro2.generator, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(canonicalURL, "content"), addAttribute(ogImage, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), addAttribute(canonicalURL, "href"), addAttribute(`${base}favicon.svg`, "href"), addAttribute(`${base}favicon-192.png`, "href"), addAttribute(`${base}favicon-512.png`, "href"), addAttribute(`${base}favicon-192.png`, "href"), title, unescapeHTML(JSON.stringify(jsonLd)), renderTemplate(_a$1 || (_a$1 = __template$1(["<script>(function(){", "\n        window.dataLayer = window.dataLayer || [];\n        window.gtag = window.gtag || function () {\n          window.dataLayer.push(arguments);\n        };\n\n        const consentKey = 'ga_consent';\n        const analyticsSrc = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;\n        let isConfigured = false;\n        let hasRequestedScript = false;\n\n        function gtag() {\n          window.gtag(...arguments);\n        }\n\n        function ensureAnalyticsScript() {\n          if (hasRequestedScript) return;\n          hasRequestedScript = true;\n\n          const script = document.createElement('script');\n          script.async = true;\n          script.src = analyticsSrc;\n          document.head.appendChild(script);\n\n          gtag('js', new Date());\n        }\n\n        function configureAnalytics() {\n          if (isConfigured) return;\n          gtag('config', gaId, { send_page_view: false });\n          isConfigured = true;\n        }\n\n        function updateConsent(value) {\n          gtag('consent', 'update', {\n            ad_storage: 'denied',\n            ad_user_data: 'denied',\n            ad_personalization: 'denied',\n            analytics_storage: value,\n          });\n        }\n\n        function sendInitialPageView() {\n          gtag('event', 'page_view', {\n            page_location: window.location.href,\n            page_path: window.location.pathname,\n            page_title: document.title,\n          });\n        }\n\n        function setAnalyticsConsent(granted) {\n          const value = granted ? 'granted' : 'denied';\n          localStorage.setItem(consentKey, value);\n\n          if (granted) {\n            ensureAnalyticsScript();\n            configureAnalytics();\n          }\n\n          updateConsent(value);\n\n          if (granted) {\n            sendInitialPageView();\n          }\n        }\n\n        window.setAnalyticsConsent = setAnalyticsConsent;\n\n        gtag('consent', 'default', {\n          ad_storage: 'denied',\n          ad_user_data: 'denied',\n          ad_personalization: 'denied',\n          analytics_storage: 'denied',\n        });\n\n        if (localStorage.getItem(consentKey) === 'granted') {\n          ensureAnalyticsScript();\n          configureAnalytics();\n          updateConsent('granted');\n          sendInitialPageView();\n        }\n      })();</script>"], ["<script>(function(){", "\n        window.dataLayer = window.dataLayer || [];\n        window.gtag = window.gtag || function () {\n          window.dataLayer.push(arguments);\n        };\n\n        const consentKey = 'ga_consent';\n        const analyticsSrc = \\`https://www.googletagmanager.com/gtag/js?id=\\${gaId}\\`;\n        let isConfigured = false;\n        let hasRequestedScript = false;\n\n        function gtag() {\n          window.gtag(...arguments);\n        }\n\n        function ensureAnalyticsScript() {\n          if (hasRequestedScript) return;\n          hasRequestedScript = true;\n\n          const script = document.createElement('script');\n          script.async = true;\n          script.src = analyticsSrc;\n          document.head.appendChild(script);\n\n          gtag('js', new Date());\n        }\n\n        function configureAnalytics() {\n          if (isConfigured) return;\n          gtag('config', gaId, { send_page_view: false });\n          isConfigured = true;\n        }\n\n        function updateConsent(value) {\n          gtag('consent', 'update', {\n            ad_storage: 'denied',\n            ad_user_data: 'denied',\n            ad_personalization: 'denied',\n            analytics_storage: value,\n          });\n        }\n\n        function sendInitialPageView() {\n          gtag('event', 'page_view', {\n            page_location: window.location.href,\n            page_path: window.location.pathname,\n            page_title: document.title,\n          });\n        }\n\n        function setAnalyticsConsent(granted) {\n          const value = granted ? 'granted' : 'denied';\n          localStorage.setItem(consentKey, value);\n\n          if (granted) {\n            ensureAnalyticsScript();\n            configureAnalytics();\n          }\n\n          updateConsent(value);\n\n          if (granted) {\n            sendInitialPageView();\n          }\n        }\n\n        window.setAnalyticsConsent = setAnalyticsConsent;\n\n        gtag('consent', 'default', {\n          ad_storage: 'denied',\n          ad_user_data: 'denied',\n          ad_personalization: 'denied',\n          analytics_storage: 'denied',\n        });\n\n        if (localStorage.getItem(consentKey) === 'granted') {\n          ensureAnalyticsScript();\n          configureAnalytics();\n          updateConsent('granted');\n          sendInitialPageView();\n        }\n      })();</script>"])), defineScriptVars({ gaId: "G-LVTVDKXWGJ" })), renderTemplate(_b || (_b = __template$1(["<script>(function(){", "\n        window.va = window.va || function () {\n          window.vaq = window.vaq || [];\n          window.vaq.push(arguments);\n        };\n\n        window.si = window.si || function () {\n          window.siq = window.siq || [];\n          window.siq.push(arguments);\n        };\n\n        function normalizePath(path) {\n          return path.replace(/\\/+/g, '/');\n        }\n\n        function injectScript(src, dataset) {\n          if (document.head.querySelector(`script[src=\"${src}\"]`)) return;\n\n          const script = document.createElement('script');\n          script.src = src;\n          script.defer = true;\n\n          Object.entries(dataset).forEach(([key, value]) => {\n            script.dataset[key] = value;\n          });\n\n          document.head.appendChild(script);\n        }\n\n        function loadVercelInsights() {\n          const basePath = normalizePath(base || '/');\n          const analyticsScript = normalizePath(`${basePath}_vercel/insights/script.js`);\n          const speedInsightsScript = normalizePath(`${basePath}_vercel/speed-insights/script.js`);\n          const currentPath = window.location.pathname;\n\n          injectScript(analyticsScript, {\n            sdkn: '@vercel/analytics/custom',\n            sdkv: '2.0.1',\n          });\n\n          injectScript(speedInsightsScript, {\n            sdkn: '@vercel/speed-insights/custom',\n            sdkv: '2.0.0',\n          });\n\n          window.va('pageview', {\n            route: currentPath,\n            path: currentPath,\n          });\n        }\n\n        if ('requestIdleCallback' in window) {\n          window.requestIdleCallback(loadVercelInsights, { timeout: 2500 });\n        } else {\n          window.setTimeout(loadVercelInsights, 1500);\n        }\n      })();</script>"], ["<script>(function(){", "\n        window.va = window.va || function () {\n          window.vaq = window.vaq || [];\n          window.vaq.push(arguments);\n        };\n\n        window.si = window.si || function () {\n          window.siq = window.siq || [];\n          window.siq.push(arguments);\n        };\n\n        function normalizePath(path) {\n          return path.replace(/\\\\/+/g, '/');\n        }\n\n        function injectScript(src, dataset) {\n          if (document.head.querySelector(\\`script[src=\"\\${src}\"]\\`)) return;\n\n          const script = document.createElement('script');\n          script.src = src;\n          script.defer = true;\n\n          Object.entries(dataset).forEach(([key, value]) => {\n            script.dataset[key] = value;\n          });\n\n          document.head.appendChild(script);\n        }\n\n        function loadVercelInsights() {\n          const basePath = normalizePath(base || '/');\n          const analyticsScript = normalizePath(\\`\\${basePath}_vercel/insights/script.js\\`);\n          const speedInsightsScript = normalizePath(\\`\\${basePath}_vercel/speed-insights/script.js\\`);\n          const currentPath = window.location.pathname;\n\n          injectScript(analyticsScript, {\n            sdkn: '@vercel/analytics/custom',\n            sdkv: '2.0.1',\n          });\n\n          injectScript(speedInsightsScript, {\n            sdkn: '@vercel/speed-insights/custom',\n            sdkv: '2.0.0',\n          });\n\n          window.va('pageview', {\n            route: currentPath,\n            path: currentPath,\n          });\n        }\n\n        if ('requestIdleCallback' in window) {\n          window.requestIdleCallback(loadVercelInsights, { timeout: 2500 });\n        } else {\n          window.setTimeout(loadVercelInsights, 1500);\n        }\n      })();</script>"])), defineScriptVars({ base })), renderHead(), addAttribute(base, "data-base-url"), renderSlot($$result, $$slots["default"]));
}, "/Users/mskkote/Projects/hiring-github-readme/src/layouts/Layout.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$username = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$username;
  const rawUsername = decodeURIComponent(Astro2.params.username ?? "").trim();
  const isValidUsername = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(rawUsername);
  let user = null;
  if (isValidUsername) {
    try {
      const response = await fetch(`https://api.github.com/users/${rawUsername}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "hiring-github-readme"
        }
      });
      if (response.ok) {
        user = await response.json();
      } else if (response.status === 404) {
        Astro2.response.status = 404;
      }
    } catch {
    }
  } else {
    Astro2.response.status = 404;
  }
  const displayName = user?.name?.trim() || user?.login || rawUsername;
  const title = `${displayName} - GitHub Skills Scanner`;
  const description = user?.bio?.trim() ? `${displayName}: ${user.bio}` : `Open ${displayName} in Hiring GitHub Readme to scan public repositories and generate a recruiter-ready skills summary.`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" <script>\n    const bodyElement = document.querySelector('body');\n    window.__BASE_URL__ = bodyElement?.getAttribute('data-base-url') || '/';\n  <\/script> ", " "])), renderComponent($$result2, "App", App, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "/Users/mskkote/Projects/hiring-github-readme/src/components/App", "client:component-export": "default" })) })}`;
}, "/Users/mskkote/Projects/hiring-github-readme/src/pages/[username].astro", void 0);

const $$file = "/Users/mskkote/Projects/hiring-github-readme/src/pages/[username].astro";
const $$url = "/[username]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$username,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
