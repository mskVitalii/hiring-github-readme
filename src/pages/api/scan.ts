import type { APIRoute } from 'astro';
import { OAUTH_TOKEN_COOKIE } from '../../lib/auth';
import { scanUser } from '../../lib/github';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies }) => {
  const token = cookies.get(OAUTH_TOKEN_COOKIE)?.value;
  const username = url.searchParams.get('username')?.trim();
  const includeArchived = url.searchParams.get('includeArchived') !== 'false';

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'GitHub login expired. Please sign in again.' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await scanUser(username, token, undefined, {
      includeArchived,
    });

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'GitHub scan failed unexpectedly';

    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
