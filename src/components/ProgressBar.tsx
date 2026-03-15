import type { ScanProgress } from '../lib/github';

interface Props {
  progress: ScanProgress;
}

const PHASE_LABELS: Record<ScanProgress['phase'], string> = {
  user: 'Fetching user profile…',
  repos: 'Loading repositories…',
  languages: 'Scanning languages',
  analyzing: 'Analyzing skills…',
  done: 'Done!',
};

export default function ProgressBar({ progress }: Props) {
  const phaseOrder: ScanProgress['phase'][] = [
    'user',
    'repos',
    'languages',
    'analyzing',
    'done',
  ];
  const phaseIndex = phaseOrder.indexOf(progress.phase);
  const percentage = Math.round(((phaseIndex + 1) / phaseOrder.length) * 100);

  let label = PHASE_LABELS[progress.phase];
  if (progress.phase === 'languages' && progress.current && progress.total) {
    label += ` (${progress.current}/${progress.total})`;
  }

  return (
    <div className='w-full max-w-xl mx-auto mt-6'>
      <div className='flex justify-between text-sm text-gh-text-secondary mb-1'>
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className='w-full bg-gh-bg-secondary rounded-full h-2 overflow-hidden border border-gh-border'>
        <div
          className='h-full bg-gh-accent rounded-full transition-all duration-300'
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
