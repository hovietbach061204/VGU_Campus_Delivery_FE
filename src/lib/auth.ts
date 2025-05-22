export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

export function getUserId(): string | null {
  return localStorage.getItem('user_id');
}

export function ensureAuthenticated(): { token: string; userId: string } {
  const token = getAccessToken();
  const userId = getUserId();

  console.log('Hello', userId);

  if (!token || !userId) {
    throw new Error('User is not authenticated');
  }

  return { token, userId };
}
