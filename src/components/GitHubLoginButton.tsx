import { useState } from 'react';
import { trackAnalyticsEvent } from '../lib/analytics';

interface Props {
  authenticated: boolean;
  isLoading?: boolean;
  login: string | null;
  onLogout?: () => Promise<void>;
}

export default function GitHubLoginButton({
  authenticated,
  isLoading = false,
  login,
  onLogout,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginClick = () => {
    trackAnalyticsEvent('oauth_login_started', {
      has_token: false,
      token_source: 'oauth',
    });
  };

  const handleLogout = async () => {
    if (!onLogout || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onLogout();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authenticated) {
    return (
      <div className='flex flex-wrap items-center gap-2'>
        <span className='inline-flex min-h-11 items-center rounded-lg border border-gh-border bg-gh-bg-secondary px-3 text-sm font-medium text-gh-text'>
          GitHub {login ? `@${login}` : 'connected'}
        </span>
        <button
          type='button'
          onClick={handleLogout}
          disabled={isSubmitting || isLoading}
          className='min-h-11 rounded-lg border border-gh-border bg-gh-bg-secondary px-4 text-sm font-medium text-gh-text transition-colors hover:border-gh-red hover:text-gh-red disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isSubmitting ? 'Disconnecting…' : 'Disconnect'}
        </button>
      </div>
    );
  }

  return (
    <a
      href='/api/auth/login'
      onClick={handleLoginClick}
      className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors ${
        isLoading
          ? 'pointer-events-none border-gh-border bg-gh-bg-secondary text-gh-text-secondary opacity-50'
          : 'border-gh-border bg-gh-bg-secondary text-gh-text hover:border-gh-accent hover:text-gh-accent'
      }`}
      aria-disabled={isLoading}
    >
      {isLoading ? 'Checking GitHub…' : '🐙 Get user & token from GitHub'}
    </a>
  );
}
