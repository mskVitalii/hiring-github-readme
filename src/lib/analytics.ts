type AnalyticsPrimitive = string | number | boolean;
type AnalyticsParams = Record<string, AnalyticsPrimitive | null | undefined>;

const CONSENT_KEY = 'ga_consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function hasGaConsent(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    return window.localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch {
    return false;
  }
}

function normalizeParams(
  params: AnalyticsParams,
): Record<string, AnalyticsPrimitive> {
  return Object.entries(params).reduce<Record<string, AnalyticsPrimitive>>(
    (acc, [key, value]) => {
      if (value === null || value === undefined) return acc;
      acc[key] = value;
      return acc;
    },
    {},
  );
}

export function trackAnalyticsEvent(
  name: string,
  params: AnalyticsParams = {},
): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  if (!hasGaConsent()) return;

  window.gtag('event', name, normalizeParams(params));
}
