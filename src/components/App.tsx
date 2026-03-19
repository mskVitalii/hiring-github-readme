import { useCallback, useEffect, useState } from 'react';
import { parseUsername, scanUser, type ScanProgress } from '../lib/github';
import { getToken } from '../lib/token';
import type { ScanResult } from '../lib/types';
import MarkdownPreview from './MarkdownPreview';
import ProgressBar from './ProgressBar';
import SearchBar from './SearchBar';
import SkillsList from './SkillsList';
import UserCard from './UserCard';

function getInitialUsernameFromLocation(): string {
  if (typeof window === 'undefined') return '';

  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('u')?.trim();
  if (fromQuery) return fromQuery;

  const base = (window as any).__BASE_URL__ || '/';
  const path = window.location.pathname;
  const relative = path.startsWith(base) ? path.slice(base.length) : path;
  return relative.split('/').filter(Boolean)[0] ?? '';
}

function setCanonicalProfilePath(username: string): void {
  if (typeof window === 'undefined') return;

  const clean = encodeURIComponent(username.trim());
  if (!clean) return;

  const base = (window as any).__BASE_URL__ || '/';
  const targetPath = `${base}${clean}`.replace(/\/+/g, '/');
  const currentPath = window.location.pathname;

  if (currentPath === targetPath && !window.location.search) return;

  window.history.replaceState({}, '', targetPath);
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ScanProgress | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [includeArchived, setIncludeArchived] = useState(true);
  const [token, setToken] = useState<string | null>(() => getToken());
  const [initialUsername] = useState(() => getInitialUsernameFromLocation());
  const [hasAutoScanned, setHasAutoScanned] = useState(false);

  const handleSearch = useCallback(
    async (input: string) => {
      const username = parseUsername(input);
      if (!username) return;

      setIsLoading(true);
      setError(null);
      setResult(null);
      setProgress({ phase: 'user' });

      try {
        const scanResult = await scanUser(
          username,
          token ?? undefined,
          setProgress,
          {
            includeArchived,
          },
        );
        setResult(scanResult);
        setCanonicalProfilePath(username);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    [includeArchived, token],
  );

  useEffect(() => {
    if (!initialUsername || hasAutoScanned) return;
    setHasAutoScanned(true);
    void handleSearch(initialUsername);
  }, [handleSearch, hasAutoScanned, initialUsername]);

  return (
    <main className='min-h-screen flex flex-col'>
      {/* Header */}
      <header className='py-12 px-4 text-center'>
        <h1 className='text-3xl sm:text-4xl font-bold text-gh-text mb-2'>
          <span className='text-gh-accent'>GitHub</span> Skills Scanner
        </h1>
        <p className='text-gh-text-secondary max-w-md mx-auto'>
          Enter a GitHub username or profile URL to extract developer skills and
          technologies.
        </p>
      </header>

      {/* Search */}
      <section className='px-4'>
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          includeArchived={includeArchived}
          onIncludeArchivedChange={setIncludeArchived}
          onTokenChange={setToken}
          initialValue={initialUsername}
        />
      </section>

      {/* Progress */}
      {isLoading && progress && (
        <section className='px-4'>
          <ProgressBar progress={progress} />
        </section>
      )}

      {/* Error */}
      {error && (
        <div className='max-w-xl mx-auto mt-6 px-4 py-3 rounded-lg border border-gh-red/50 bg-gh-red/10 text-gh-red text-sm'>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <section className='px-4 py-8 space-y-8'>
          <UserCard
            user={result.user}
            totalRepos={result.totalRepos}
            scannedRepos={result.scannedRepos}
          />
          <SkillsList categories={result.categories} />
          <MarkdownPreview result={result} />
        </section>
      )}

      {/* Footer */}
      <footer className='mt-auto py-6 text-center text-sm text-gh-text/85 space-y-1'>
        <p>
          Made by{' '}
          <a
            href='https://www.linkedin.com/in/mskvitalii/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gh-accent underline underline-offset-2 decoration-1 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent/70 rounded-sm'
          >
            Vitalii Popov
          </a>
        </p>
        <p>
          Data from{' '}
          <a
            href='https://docs.github.com/en/rest'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gh-accent underline underline-offset-2 decoration-1 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent/70 rounded-sm'
          >
            GitHub API
          </a>
          . Rate limit: 60 requests/hour without token.
        </p>
      </footer>
    </main>
  );
}
