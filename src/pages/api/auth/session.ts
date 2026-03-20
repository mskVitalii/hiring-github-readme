import type { APIRoute } from 'astro';
import {
  OAUTH_LOGIN_COOKIE,
  OAUTH_TOKEN_COOKIE,
  type OAuthSession,
} from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get(OAUTH_TOKEN_COOKIE)?.value;
  const login = cookies.get(OAUTH_LOGIN_COOKIE)?.value ?? null;

  const payload: OAuthSession = {
    authenticated: Boolean(token),
    login: token ? login : null,
    tokenSource: token ? 'oauth' : null,
  };

  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};
