import { fetchWithAuth } from '../app/api/fetchWithAuth';

export async function getUserProfile(userId: string, token: string) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/users/${userId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch user profile');
  }

  const data = await res.json();
  return data.result; // assuming structure is ApiResponse<UserResponse>
}
