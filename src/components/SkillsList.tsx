import { useState } from 'react';
import type { SkillCategory } from '../lib/types';

interface Props {
  categories: SkillCategory[];
}

export default function SkillsList({ categories }: Props) {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const toggleSkill = (skillKey: string) => {
    setExpandedSkill(expandedSkill === skillKey ? null : skillKey);
  };

  return (
    <div className='w-full max-w-3xl mx-auto space-y-6'>
      {categories.map((category) => (
        <div
          key={category.name}
          className='border border-gh-border rounded-lg overflow-hidden'
        >
          <h3 className='px-4 py-3 bg-gh-bg-secondary text-gh-text font-semibold text-sm uppercase tracking-wide border-b border-gh-border'>
            {category.name}
          </h3>
          <div className='p-4 flex flex-wrap gap-2'>
            {category.skills.map((skill) => {
              const key = `${category.name}-${skill.name}`;
              const isExpanded = expandedSkill === key;

              return (
                <div key={key} className='relative'>
                  <button
                    onClick={() => toggleSkill(key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                      isExpanded
                        ? 'bg-gh-accent text-gh-bg border-gh-accent'
                        : 'bg-gh-bg-secondary text-gh-text border-gh-border hover:border-gh-accent hover:text-gh-accent'
                    }`}
                  >
                    {skill.name}
                    <span
                      className={`text-xs ${
                        isExpanded ? 'text-gh-bg/70' : 'text-gh-text-secondary'
                      }`}
                    >
                      {skill.repos.length}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className='absolute z-10 top-full mt-2 left-0 min-w-[200px] bg-gh-bg-secondary border border-gh-border rounded-lg shadow-xl p-2 space-y-1'>
                      <p className='text-xs text-gh-text-secondary px-2 py-1'>
                        Found in {skill.repos.length}{' '}
                        {skill.repos.length === 1 ? 'repo' : 'repos'}:
                      </p>
                      {skill.repos.map((repo, idx) => (
                        <a
                          key={repo}
                          href={skill.repoUrls[idx]}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='block px-2 py-1.5 rounded text-sm text-gh-accent hover:bg-gh-border/50 transition-colors'
                        >
                          {repo}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
