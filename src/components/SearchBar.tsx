import { useState, type FormEvent } from 'react';

interface Props {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-xl mx-auto'>
      <div className='flex gap-2'>
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
          className='px-6 py-3 rounded-lg bg-gh-green text-gh-bg font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
        >
          {isLoading ? 'Scanning…' : 'Scan'}
        </button>
      </div>
    </form>
  );
}
