import { useCallback, useState } from 'react';
import { parseUsername, scanUser, type ScanProgress } from '../lib/github';
import '../lib/sentry';
import type { ScanResult } from '../lib/types';
import ProgressBar from './ProgressBar';
import SearchBar from './SearchBar';
import SkillsList from './SkillsList';
import UserCard from './UserCard';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ScanProgress | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (input: string) => {
    const username = parseUsername(input);
    if (!username) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setProgress({ phase: 'user' });

    try {
      const scanResult = await scanUser(username, setProgress);
      setResult(scanResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
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
        <section className='px-4 py-8 space-y-6'>
          <UserCard
            user={result.user}
            totalRepos={result.totalRepos}
            scannedRepos={result.scannedRepos}
          />
          <SkillsList categories={result.categories} />
        </section>
      )}

      {/* Footer */}
      <footer className='mt-auto py-6 text-center text-xs text-gh-text-secondary'>
        <p>
          Data from{' '}
          <a
            href='https://docs.github.com/en/rest'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gh-accent hover:underline'
          >
            GitHub API
          </a>
          . Rate limit: 60 requests/hour without token.
        </p>
      </footer>
    </main>
  );
}
