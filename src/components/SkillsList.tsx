import { CATEGORY_EMOJIS } from '../lib/keywords';
import type { SkillCategory } from '../lib/types';

interface Props {
  categories: SkillCategory[];
}

export default function SkillsList({ categories }: Props) {
  const scrollToSkill = (skillName: string) => {
    const anchor = skillName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='w-full max-w-3xl mx-auto space-y-4'>
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className='text-xs font-semibold text-gh-text-secondary uppercase tracking-wide mb-2'>
            {`${CATEGORY_EMOJIS[category.name] ?? '📦'} ${category.name}`}
          </h3>
          <div className='flex flex-wrap gap-1.5'>
            {category.skills.map((skill) => (
              <button
                key={skill.name}
                onClick={() => scrollToSkill(skill.name)}
                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-gh-border bg-gh-bg-secondary text-gh-text hover:border-gh-accent hover:text-gh-accent transition-colors cursor-pointer'
              >
                {skill.name}
                <span className='text-xs text-gh-text-secondary'>
                  {skill.repos.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
