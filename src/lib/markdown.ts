import type { ScanResult } from './types';

/** Generate GitHub-flavored markdown for a user's skills */
export function generateMarkdown(result: ScanResult): string {
  const { user, categories } = result;
  const lines: string[] = [];

  // Header
  lines.push(`# ${user.name ?? user.login}'s Tech Stack`);
  lines.push('');
  if (user.bio) {
    lines.push(`> ${user.bio}`);
    lines.push('');
  }

  // Badge summary (all skills as shields.io badges linking to sections)
  for (const category of categories) {
    const badges = category.skills.map((skill) => {
      const label = skill.name
        .replace(/-/g, '--')
        .replace(/#/g, '%23')
        .replace(/\+/g, '%2B')
        .replace(/\./g, '.')
        .replace(/ /g, '%20');
      const anchor = `#${skill.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}`;
      return `[![${skill.name}](https://img.shields.io/badge/${label}-informational?style=flat&color=58a6ff)](${anchor})`;
    });
    lines.push(badges.join(' '));
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Detailed sections per category
  for (const category of categories) {
    lines.push(`## ${category.name}`);
    lines.push('');

    for (const skill of category.skills) {
      lines.push(`### ${skill.name}`);
      lines.push('');

      for (let i = 0; i < skill.repos.length; i++) {
        const repoName = skill.repos[i];
        const repoUrl = skill.repoUrls[i];
        const homepage = skill.repoHomepages[i];

        let line = `- [${repoName}](${repoUrl})`;
        if (homepage) {
          line += ` | [demo](${homepage})`;
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
