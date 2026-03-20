import type { APIRoute } from 'astro';
import {
  OAUTH_LOGIN_COOKIE,
  OAUTH_TOKEN_COOKIE,
  getCookieOptions,
} from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ url, cookies }) => {
  const cookieOptions = getCookieOptions(url);

  cookies.set(OAUTH_TOKEN_COOKIE, '', {
    ...cookieOptions,
    maxAge: 0,
  });
  cookies.set(OAUTH_LOGIN_COOKIE, '', {
    ...cookieOptions,
    maxAge: 0,
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};
