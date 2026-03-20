import { useEffect, useState, type FormEvent } from 'react';
import { logScanClick } from '../lib/logger';
import GitHubLoginButton from './GitHubLoginButton';
import { TokenInput } from './TokenInput';

interface Props {
  onSearch: (username: string) => void;
  isLoading: boolean;
  hasToken: boolean;
  includeArchived: boolean;
  onIncludeArchivedChange: (value: boolean) => void;
  onTokenChange?: (token: string | null) => void;
  oauthAuthenticated?: boolean;
  oauthLogin?: string | null;
  onOAuthLogout?: () => Promise<void>;
  isAuthLoading?: boolean;
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  isLoading,
  hasToken,
  includeArchived,
  onIncludeArchivedChange,
  onTokenChange,
  oauthAuthenticated = false,
  oauthLogin = null,
  onOAuthLogout,
  isAuthLoading = false,
  initialValue = '',
}: Props) {
  const [input, setInput] = useState(initialValue);

  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-2xl mx-auto'>
      <div className='flex flex-col gap-2 sm:flex-row'>
        <input
          id='github-profile-input'
          name='githubProfile'
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Username or GitHub URL'
          disabled={isLoading}
          className='flex-1 px-4 py-3 rounded-lg bg-gh-bg-secondary border border-gh-border text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:border-gh-accent focus:ring-1 focus:ring-gh-accent transition-colors disabled:opacity-50'
          aria-label='GitHub username or URL'
        />
        <button
          type='submit'
          disabled={isLoading || !input.trim()}
          onClick={() => logScanClick(input.trim(), hasToken)}
          className='px-6 py-3 rounded-lg bg-gh-green text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
        >
          {isLoading ? 'Scanning…' : 'Scan'}
        </button>
      </div>
      <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'>
        <div className='flex flex-wrap items-center gap-2'>
          {onTokenChange && <TokenInput onTokenChange={onTokenChange} />}
          <GitHubLoginButton
            authenticated={oauthAuthenticated}
            login={oauthLogin}
            onLogout={onOAuthLogout}
            isLoading={isAuthLoading}
          />
        </div>
      </div>
      <div className='flex items-center gap-4 mt-4'>
        <label className='inline-flex items-center gap-2 text-sm text-gh-text-secondary select-none'>
          <input
            type='checkbox'
            checked={includeArchived}
            onChange={(e) => onIncludeArchivedChange(e.target.checked)}
            disabled={isLoading}
            className='h-4 w-4 rounded border-gh-border bg-gh-bg-secondary text-gh-accent focus:ring-gh-accent disabled:opacity-50'
          />
          Include archived repositories
        </label>
      </div>
    </form>
  );
}
