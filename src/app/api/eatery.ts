import { fetchWithAuth } from './fetchWithAuth';

export interface FoodItem {
  name: string;
  price: number;
  description: string;
}

export interface EateryPayload {
  name: string;
  address: string;
  contactNumber: string;
  foodItems: FoodItem[];
}

export async function createEatery(token: string, payload: EateryPayload) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/eateries`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create eatery');
  }

  return res.json();
}

export async function addFoodItemToEatery(
  token: string,
  eateryName: string,
  dish: { name: string; price: number; description: string }
) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/eateries/food-items/${encodeURIComponent(eateryName)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dish),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to add dish');
  }

  return res.json(); // optional: returns updated EateryMenuResponse
}

export async function deleteEatery(token: string, eateryName: string) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/eateries/${encodeURIComponent(eateryName)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete eatery');
  }
}

export async function deleteDishFromEatery(
  token: string,
  eateryName: string,
  foodName: string
) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/eateries/${encodeURIComponent(
      eateryName
    )}/${encodeURIComponent(foodName)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete dish');
  }
}

export async function fetchAllEateries(token: string) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/eateries`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch restaurants');
  }

  const data = await res.json();
  return data.result;
}
