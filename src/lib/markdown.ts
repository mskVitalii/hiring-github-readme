import { CATEGORY_EMOJIS } from './keywords';
import type { ScanResult } from './types';

export interface MarkdownOptions {
  showStars?: boolean;
  showDemo?: boolean;
  showArchived?: boolean;
  showTopics?: boolean;
}

const FRAMEWORK_LANGUAGE_MAP: Record<string, string> = {
  React: 'TS/JS',
  Vue: 'TS/JS',
  Angular: 'TypeScript',
  Svelte: 'TS/JS',
  'Next.js': 'TS/JS',
  Nuxt: 'TS/JS',
  Astro: 'TS/JS',
  Gatsby: 'TS/JS',
  'Tailwind CSS': 'CSS',
  Bootstrap: 'CSS',
  'Material UI': 'TS/JS',
  'Styled Components': 'TS/JS',
  Sass: 'CSS',
  Redux: 'TS/JS',
  Zustand: 'TS/JS',
  Vite: 'TS/JS',
  Webpack: 'JavaScript',
  'Node.js': 'TS/JS',
  Express: 'TS/JS',
  Fastify: 'TS/JS',
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
  'React Native': 'TS/JS',
  Flutter: 'Dart',
  SwiftUI: 'Swift',
};

function skillDisplayName(skillName: string): string {
  const lang = FRAMEWORK_LANGUAGE_MAP[skillName];
  return lang ? `${skillName} (${lang})` : skillName;
}

function categoryDisplayName(categoryName: string): string {
  return `${CATEGORY_EMOJIS[categoryName] ?? '📦'} ${categoryName}`;
}

function toAnchor(text: string): string {
  return `#${text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`;
}

function skillBadgeUrl(label: string): string {
  const q = new URLSearchParams({
    label: '',
    message: label,
    color: '58a6ff',
    style: 'flat',
  });
  return `https://img.shields.io/static/v1?${q.toString()}`;
}

function topicBadgeUrl(topic: string): string {
  const q = new URLSearchParams({
    label: 'topic',
    message: topic,
    color: '6e7681',
    style: 'flat-square',
  });
  return `https://img.shields.io/static/v1?${q.toString()}`;
}

/** Generate GitHub-flavored markdown for profile skills */
export function generateMarkdown(
  result: ScanResult,
  options: MarkdownOptions = {},
): string {
  const { user, categories } = result;
  const showStars = options.showStars ?? true;
  const showDemo = options.showDemo ?? true;
  const showArchived = options.showArchived ?? true;
  const showTopics = options.showTopics ?? true;
  const lines: string[] = [];

  // Header
  lines.push(`# Tech Stack`);
  lines.push('');

  // Category summary with grouped skill badges
  lines.push('## Skills by Category');
  lines.push('');
  for (const category of categories) {
    lines.push(`### ${categoryDisplayName(category.name)}`);
    const badges = category.skills.map((skill) => {
      const displayName = skillDisplayName(skill.name);
      const anchor = toAnchor(displayName);
      return `[![${displayName}](${skillBadgeUrl(displayName)})](${anchor})`;
    });
    lines.push(badges.join(' '));
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Detailed sections per category
  for (const category of categories) {
    lines.push(`## ${categoryDisplayName(category.name)}`);
    lines.push('');

    for (const skill of category.skills) {
      const displayName = skillDisplayName(skill.name);
      lines.push(`### ${displayName}`);
      lines.push('');

      const repos = skill.repos.map((repoName, i) => ({
        repoName,
        repoUrl: skill.repoUrls[i],
        homepage: skill.repoHomepages[i],
        topics: skill.repoTopics[i] ?? [],
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
          const topics = repo.topics
            .filter(Boolean)
            .slice(0, 6)
            .map(
              (topic) =>
                `[![${topic}](${topicBadgeUrl(topic)})](${repo.repoUrl})`,
            );

          if (topics.length > 0) {
            lines.push(`  ${topics.join(' ')}`);
          }
        }
      }
      lines.push('');
    }
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push(
    '*Generated with [Hiring GitHub Readme](https://hiring-github-readme.vercel.app/)*',
  );
  lines.push('');

  return lines.join('\n');
}
