import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://9816f8fcb02bf52b52178f080684ff3b@o4511532401950720.ingest.de.sentry.io/4511532417351760",
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true,
});
