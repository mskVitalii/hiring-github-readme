import { describe, expect, it } from 'vitest';
import { __testables } from './github';
import type { GitHubRepo } from './types';

function makeRepo(
  name: string,
  language: string | null,
  topics: string[] = [],
  description: string | null = null,
): GitHubRepo {
  return {
    name,
    html_url: `https://github.com/test/${name}`,
    homepage: null,
    description,
    language,
    topics,
    stargazers_count: 0,
    updated_at: '2026-01-01T00:00:00Z',
    fork: false,
    archived: false,
    size: 1,
  };
}

describe('framework language guards', () => {
  it('does not detect Gin when Go language is missing', () => {
    const repo = makeRepo('api-service', 'TypeScript', ['gin-gonic']);

    const skillMap = __testables.detectSkillsFromRepos(
      [repo],
      new Map(),
      new Map(),
    );

    expect(skillMap.has('Gin')).toBe(false);
  });

  it('detects Gin when Go language exists', () => {
    const repo = makeRepo('go-api', 'Go', ['gin-gonic']);

    const skillMap = __testables.detectSkillsFromRepos(
      [repo],
      new Map(),
      new Map(),
    );

    expect(skillMap.has('Gin')).toBe(true);
  });

  it('does not detect C# / .NET without .NET platform language', () => {
    const repo = makeRepo('ts-tooling', 'TypeScript', ['dotnet']);

    const skillMap = __testables.detectSkillsFromRepos(
      [repo],
      new Map(),
      new Map(),
    );

    expect(skillMap.has('C# / .NET')).toBe(false);
  });
});

describe('fullstack package.json hint', () => {
  it('unlocks TS/JS framework detection when package.json is present', () => {
    const repo = makeRepo('go-fullstack', 'Go', ['nextjs']);

    const withoutPackageJson = __testables.detectSkillsFromRepos(
      [repo],
      new Map(),
      new Map(),
    );
    expect(withoutPackageJson.has('Next.js')).toBe(false);

    const withPackageJson = __testables.detectSkillsFromRepos(
      [repo],
      new Map(),
      new Map([[repo.name, ['package.json']]]),
    );
    expect(withPackageJson.has('Next.js')).toBe(true);
  });

  it('keeps TypeScript and removes JavaScript for mixed TS/JS repos with language breakdown', () => {
    const repo = makeRepo('ts-app', 'JavaScript', [], null);

    const skillMap = __testables.detectSkillsFromRepos(
      [repo],
      new Map([
        [
          repo.name,
          {
            TypeScript: 857,
            Astro: 128,
            JavaScript: 15,
          },
        ],
      ]),
      new Map([[repo.name, ['package.json']]]),
    );

    expect(skillMap.has('TypeScript')).toBe(true);
    expect(skillMap.has('JavaScript')).toBe(false);
  });
});

describe('compose.yaml detection', () => {
  it('detects infrastructure/database skills from compose content', () => {
    const skills = __testables.detectSkillsFromComposeContent(`
services:
  db:
    image: postgres:16
  cache:
    image: redis:7
  search:
    image: opensearchproject/opensearch:latest
  mq:
    image: rabbitmq:3-management
`);

    expect(skills).toContain('Docker');
    expect(skills).toContain('PostgreSQL');
    expect(skills).toContain('Redis');
    expect(skills).toContain('Elasticsearch');
    expect(skills).toContain('RabbitMQ');
  });

  it('adds compose-derived skills into repo skill map', () => {
    const repo = makeRepo('infra-app', 'TypeScript');

    const skillMap = __testables.detectSkillsFromRepos(
      [repo],
      new Map(),
      new Map(),
      new Map([[repo.name, ['PostgreSQL', 'MongoDB', 'Redis']]]),
    );

    expect(skillMap.has('PostgreSQL')).toBe(true);
    expect(skillMap.has('MongoDB')).toBe(true);
    expect(skillMap.has('Redis')).toBe(true);
  });
});
