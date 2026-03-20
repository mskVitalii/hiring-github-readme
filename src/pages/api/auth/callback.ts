import type { APIRoute } from 'astro';
import {
  OAUTH_LOGIN_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_TOKEN_COOKIE,
  buildAppUrl,
  getCookieOptions,
} from '../../../lib/auth';

interface TokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface AuthenticatedUserResponse {
  login: string;
}

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = cookies.get(OAUTH_STATE_COOKIE)?.value;
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('GitHub OAuth is not configured', { status: 500 });
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return new Response('Invalid OAuth state', { status: 400 });
  }

  const tokenResponse = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: buildAppUrl(url, 'api/auth/callback').toString(),
      }),
    },
  );

  const tokenData = (await tokenResponse.json()) as TokenResponse;

  if (!tokenResponse.ok || !tokenData.access_token) {
    return new Response(
      tokenData.error_description ||
        tokenData.error ||
        'Failed to exchange GitHub OAuth code',
      { status: 400 },
    );
  }

  const profileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${tokenData.access_token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!profileResponse.ok) {
    return new Response('Failed to fetch GitHub profile', { status: 502 });
  }

  const profile = (await profileResponse.json()) as AuthenticatedUserResponse;
  const cookieOptions = getCookieOptions(url);

  cookies.set(OAUTH_TOKEN_COOKIE, tokenData.access_token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
  cookies.set(OAUTH_LOGIN_COOKIE, profile.login, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
  cookies.set(OAUTH_STATE_COOKIE, '', {
    ...cookieOptions,
    maxAge: 0,
  });

  const redirectUrl = buildAppUrl(url, '');
  redirectUrl.searchParams.set('auth', 'github');

  return Response.redirect(redirectUrl.toString(), 302);
};
