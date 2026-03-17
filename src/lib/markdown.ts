import type { ScanResult } from './types';

const FRAMEWORK_LANGUAGE_MAP: Record<string, string> = {
  React: 'JavaScript/TypeScript',
  Vue: 'JavaScript/TypeScript',
  Angular: 'TypeScript',
  Svelte: 'TypeScript/JavaScript',
  'Next.js': 'TypeScript/JavaScript',
  Nuxt: 'TypeScript/JavaScript',
  Astro: 'TypeScript/JavaScript',
  Gatsby: 'TypeScript/JavaScript',
  'Tailwind CSS': 'CSS',
  Bootstrap: 'CSS',
  'Material UI': 'TypeScript/JavaScript',
  'Styled Components': 'TypeScript/JavaScript',
  Sass: 'CSS',
  Redux: 'TypeScript/JavaScript',
  Zustand: 'TypeScript/JavaScript',
  Vite: 'TypeScript/JavaScript',
  Webpack: 'JavaScript',
  'Node.js': 'JavaScript/TypeScript',
  Express: 'JavaScript/TypeScript',
  Fastify: 'JavaScript/TypeScript',
  NestJS: 'TypeScript',
  Django: 'Python',
  Flask: 'Python',
  FastAPI: 'Python',
  'Spring Boot': 'Java/Kotlin',
  'Ruby on Rails': 'Ruby',
  Laravel: 'PHP',
  Gin: 'Go',
  Fiber: 'Go',
  Actix: 'Rust',
  'React Native': 'TypeScript/JavaScript',
  Flutter: 'Dart',
  SwiftUI: 'Swift',
};

function skillDisplayName(skillName: string): string {
  const lang = FRAMEWORK_LANGUAGE_MAP[skillName];
  return lang ? `${skillName} (${lang})` : skillName;
}

function toAnchor(text: string): string {
  return `#${text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`;
}

/** Generate GitHub-flavored markdown for a user's skills */
export function generateMarkdown(result: ScanResult): string {
  const { user, categories } = result;
  const lines: string[] = [];

  // Header
  lines.push(`# ${user.name ?? user.login}'s Tech Stack`);
  lines.push('');

  // Category summary with grouped skill badges
  lines.push('## Skills by Category');
  lines.push('');
  for (const category of categories) {
    lines.push(`### ${category.name}`);
    const badges = category.skills.map((skill) => {
      const displayName = skillDisplayName(skill.name);
      const label = displayName
        .replace(/-/g, '--')
        .replace(/#/g, '%23')
        .replace(/\+/g, '%2B')
        .replace(/\./g, '.')
        .replace(/ /g, '%20');
      const anchor = toAnchor(displayName);
      return `[![${displayName}](https://img.shields.io/badge/${label}-informational?style=flat&color=58a6ff)](${anchor})`;
    });
    lines.push(badges.join(' '));
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Detailed sections per category
  for (const category of categories) {
    lines.push(`## ${category.name}`);
    lines.push('');

    for (const skill of category.skills) {
      const displayName = skillDisplayName(skill.name);
      lines.push(`### ${displayName}`);
      lines.push('');

      const repos = skill.repos.map((repoName, i) => ({
        repoName,
        repoUrl: skill.repoUrls[i],
        homepage: skill.repoHomepages[i],
        stars: skill.repoStars[i] ?? 0,
        updatedAt: skill.repoUpdatedAt[i] ?? '',
        archived: skill.repoArchived[i] ?? false,
      }));

      repos.sort((a, b) => {
        const updatedDiff =
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        if (updatedDiff !== 0) return updatedDiff;
        return b.stars - a.stars;
      });

      for (const repo of repos) {
        let line = `- [${repo.repoName}](${repo.repoUrl})`;
        if (repo.archived) {
          line += ` [![archived](https://img.shields.io/badge/archived-yes-6e7781?style=flat-square)](${repo.repoUrl})`;
        }
        if (repo.stars > 0) {
          line += ` [![stars](https://img.shields.io/badge/stars-${repo.stars}-1f6feb?style=flat-square)](${repo.repoUrl})`;
        }
        if (repo.homepage) {
          line += ` [![demo](https://img.shields.io/badge/demo-live-2ea043?style=flat-square)](${repo.homepage})`;
        }
        lines.push(line);
      }
      lines.push('');
    }
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push(
    '*Generated with [Hiring GitHub Readme](https://mskvitalii.github.io/hiring-github-readme/)*',
  );
  lines.push('');

  return lines.join('\n');
}
