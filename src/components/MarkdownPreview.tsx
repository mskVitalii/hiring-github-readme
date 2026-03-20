import { useMemo, useState } from 'react';
import { trackAnalyticsEvent } from '../lib/analytics';
import { generateMarkdown } from '../lib/markdown';
import type { ScanResult } from '../lib/types';

interface Props {
  result: ScanResult;
}

export default function MarkdownPreview({ result }: Props) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'preview' | 'raw'>('preview');
  const [showStars, setShowStars] = useState(true);
  const [showDemo, setShowDemo] = useState(true);
  const [showArchived, setShowArchived] = useState(true);
  const [showTopics, setShowTopics] = useState(true);

  const markdown = useMemo(
    () =>
      generateMarkdown(result, {
        showStars,
        showDemo,
        showArchived,
        showTopics,
      }),
    [result, showArchived, showDemo, showStars, showTopics],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    trackAnalyticsEvent('markdown_copied', {
      active_tab: tab,
      show_stars: showStars,
      show_demo: showDemo,
      show_archived: showArchived,
      show_topics: showTopics,
      markdown_length: markdown.length,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='w-full max-w-3xl mx-auto'>
      {/* Toolbar */}
      <div className='flex items-center justify-between border border-gh-border rounded-t-lg bg-gh-bg-secondary px-4 py-2'>
        <div className='flex items-center gap-3 flex-wrap'>
          <div className='flex gap-1'>
            <button
              onClick={() => setTab('preview')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                tab === 'preview'
                  ? 'bg-gh-bg text-gh-text border border-gh-border'
                  : 'text-gh-text-secondary hover:text-gh-text'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setTab('raw')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                tab === 'raw'
                  ? 'bg-gh-bg text-gh-text border border-gh-border'
                  : 'text-gh-text-secondary hover:text-gh-text'
              }`}
            >
              Markdown
            </button>
          </div>

          <label className='inline-flex items-center gap-2 text-xs text-gh-text-secondary select-none'>
            <input
              type='checkbox'
              checked={showStars}
              onChange={(e) => setShowStars(e.target.checked)}
              className='h-4 w-4 rounded border-gh-border bg-gh-bg text-gh-accent focus:ring-gh-accent'
            />
            Stars
          </label>

          <label className='inline-flex items-center gap-2 text-xs text-gh-text-secondary select-none'>
            <input
              type='checkbox'
              checked={showDemo}
              onChange={(e) => setShowDemo(e.target.checked)}
              className='h-4 w-4 rounded border-gh-border bg-gh-bg text-gh-accent focus:ring-gh-accent'
            />
            Demo
          </label>

          <label className='inline-flex items-center gap-2 text-xs text-gh-text-secondary select-none'>
            <input
              type='checkbox'
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className='h-4 w-4 rounded border-gh-border bg-gh-bg text-gh-accent focus:ring-gh-accent'
            />
            Archived
          </label>

          <label className='inline-flex items-center gap-2 text-xs text-gh-text-secondary select-none'>
            <input
              type='checkbox'
              checked={showTopics}
              onChange={(e) => setShowTopics(e.target.checked)}
              className='h-4 w-4 rounded border-gh-border bg-gh-bg text-gh-accent focus:ring-gh-accent'
            />
            Topics
          </label>
        </div>
        <button
          onClick={handleCopy}
          className='px-3 py-1.5 rounded text-sm font-medium bg-gh-green text-white hover:opacity-90 transition-opacity cursor-pointer'
        >
          {copied ? '✓ Copied!' : 'Copy MD'}
        </button>
      </div>

      {/* Content */}
      <div className='border border-t-0 border-gh-border rounded-b-lg bg-gh-bg overflow-auto'>
        {tab === 'raw' ? (
          <pre className='p-4 text-sm text-gh-text font-mono whitespace-pre-wrap wrap-break-word'>
            {markdown}
          </pre>
        ) : (
          <div className='p-6 gh-markdown'>
            <RenderedMarkdown markdown={markdown} />
          </div>
        )}
      </div>
    </div>
  );
}

/** Simple GitHub-flavored markdown renderer (no external deps) */
function RenderedMarkdown({ markdown }: { markdown: string }) {
  const html = useMemo(() => renderGfm(markdown), [markdown]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function toAnchor(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function renderGfm(md: string): string {
  let html = escapeHtml(md);

  // Headings (order matters: h3 before h2 before h1)
  html = html.replace(/^### (.+)$/gm, (_match, p1) => {
    const id = toAnchor(p1);
    return `<h3 id="${id}" class="text-base font-semibold text-gh-text mt-6 mb-2 scroll-mt-4">${p1}</h3>`;
  });
  html = html.replace(
    /^## (.+)$/gm,
    (_match, p1) =>
      `<h2 class="text-lg font-bold text-gh-text mt-8 mb-3 pb-1 border-b border-gh-border">${p1}</h2>`,
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="text-2xl font-bold text-gh-text mb-4">$1</h1>',
  );

  // Blockquotes
  html = html.replace(
    /^&gt; (.+)$/gm,
    '<blockquote class="pl-4 border-l-4 border-gh-border text-gh-text-secondary italic my-2">$1</blockquote>',
  );

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-gh-border my-6" />');

  // Images (badges)
  html = html.replace(
    /\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g,
    '<a href="$3" class="inline-block mr-1 mb-1"><img src="$2" alt="$1" class="inline h-5" /></a>',
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-gh-accent underline underline-offset-2 decoration-1 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent/70 rounded-sm">$1</a>',
  );

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // List items
  html = html.replace(
    /^- (.+)$/gm,
    '<li class="ml-4 list-disc text-gh-text text-sm leading-relaxed">$1</li>',
  );

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /((?:<li[^>]*>.*<\/li>\n?)+)/g,
    '<ul class="my-2 space-y-1">$1</ul>',
  );

  // Paragraphs: wrap remaining non-empty, non-tag lines
  html = html.replace(
    /^(?!<[a-z/])(.+)$/gm,
    '<p class="text-sm text-gh-text-secondary my-1">$1</p>',
  );

  // Clean empty lines
  html = html.replace(/\n{2,}/g, '\n');

  return html;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
