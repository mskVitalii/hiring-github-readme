import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: 'https://45c542b8fa10ae661b490d0bddb19edf@o4511051177066496.ingest.de.sentry.io/4511051187748944',
  sendDefaultPii: true,
  enableLogs: true,
});
