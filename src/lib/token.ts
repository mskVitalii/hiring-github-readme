/**
 * GitHub Token Management
 * Stores and retrieves GitHub Personal Access Token (read-only)
 */

const TOKEN_KEY = 'github_token';

/**
 * Save GitHub token to localStorage
 * Token should have read-only access to public repos only
 */
export function saveToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    console.error('Failed to save token to localStorage');
  }
}

/**
 * Get stored GitHub token
 */
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Remove stored token (logout)
 */
export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    console.error('Failed to clear token from localStorage');
  }
}

/**
 * Check if token is valid by making a simple API call
 */
export async function validateToken(token: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}
