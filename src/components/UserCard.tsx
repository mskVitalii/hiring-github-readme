import type { GitHubUser } from '../lib/types';

interface Props {
  user: GitHubUser;
  totalRepos: number;
  scannedRepos: number;
}

export default function UserCard({ user, totalRepos, scannedRepos }: Props) {
  return (
    <div className='flex items-center gap-4 p-4 rounded-lg border border-gh-border bg-gh-bg-secondary max-w-xl mx-auto'>
      <img
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        className='w-16 h-16 rounded-full border-2 border-gh-border'
        loading='lazy'
      />
      <div className='flex-1 min-w-0'>
        <a
          href={user.html_url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-gh-accent font-semibold text-lg hover:underline'
        >
          {user.name ?? user.login}
        </a>
        {user.name && (
          <p className='text-sm text-gh-text-secondary'>@{user.login}</p>
        )}
        {user.bio && (
          <p className='text-sm text-gh-text-secondary mt-1 truncate'>
            {user.bio}
          </p>
        )}
        <p className='text-xs text-gh-text-secondary mt-1'>
          Scanned {scannedRepos} of {totalRepos} repositories
        </p>
      </div>
    </div>
  );
}
