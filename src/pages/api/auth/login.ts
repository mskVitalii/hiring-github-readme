import type { APIRoute } from 'astro';
import {
  OAUTH_SCOPE,
  OAUTH_STATE_COOKIE,
  buildAppUrl,
  getCookieOptions,
} from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response('Missing GITHUB_CLIENT_ID', { status: 500 });
  }

  const state = crypto.randomUUID();

  cookies.set(OAUTH_STATE_COOKIE, state, {
    ...getCookieOptions(url),
    maxAge: 60 * 10,
  });

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set(
    'redirect_uri',
    buildAppUrl(url, 'api/auth/callback').toString(),
  );
  authorizeUrl.searchParams.set('scope', OAUTH_SCOPE);
  authorizeUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
    },
  });
};
