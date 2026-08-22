// Base URL for the FastAPI backend. Requires VITE_API_BASE_URL to be set in
// the frontend's Vercel project. No hardcoded production fallback: an unclaimed
// *.vercel.app subdomain here would be a subdomain-takeover risk for lead PII.
export function getApiUrl(endpoint: string): string {
  const envBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  const isLocalHost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const baseUrl = envBase || (isLocalHost ? 'http://localhost:8000' : '');

  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured in this deployment.');
  }

  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
}

export function cn(...inputs: any[]) {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
          classes.push(key);
        }
      }
    }
  }
  return classes.join(' ');
}
