import { fetchWithAuth } from './fetchWithAuth';

export async function updateUserProfile(
  userId: string,
  token: string,
  payload: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    dob: string; // ISO date string: "YYYY-MM-DD"
    oldPassword?: string; // Add oldPassword for validation
    roles?: string[]; // Optional unless you're managing roles too
  }
) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/users/${userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update user profile');
  }

  return await res.json(); // You can extract .result here if needed
}

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
