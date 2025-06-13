// src/app/api/fetchWithAuth.ts
/**
 * Wrapper for fetch that handles 401 Unauthorized globally.
 * If a 401 is detected, clears localStorage, shows auth prompt, and redirects to /SignIn.
 * Usage: import fetchWithAuth and use instead of fetch in API functions.
 * NOTE: Do NOT use React hooks or useRouter here. Use window.location for redirect.
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('userRole');
    // Show prompt
    window.dispatchEvent(new CustomEvent('show-auth-prompt'));
    // Redirect to sign in (only if not already there)
    if (
      typeof window !== 'undefined' &&
      window.location.pathname !== '/SignIn'
    ) {
      window.location.href = '/'; // Go to homepage, not /SignIn
    }
    throw new Error('Session expired. Please sign in again.');
  }
  return res;
}
