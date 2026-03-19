const LOG_TAG = '[gh-skills-scanner]';

export function logScanClick(username: string, hasToken: boolean): void {
  console.info(LOG_TAG, 'scan', { username, hasToken });
}
