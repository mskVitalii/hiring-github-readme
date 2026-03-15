import * as Sentry from '@sentry/react';

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
}

export { Sentry };
