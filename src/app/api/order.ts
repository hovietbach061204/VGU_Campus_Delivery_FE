// app/api/order.ts
export interface FoodItemPayload {
  name: string;
  quantity: number;
}

export async function createOrder(
  token: string,
  payload: {
    purchaserId: string;
    eateryName: string;
    foodItems: FoodItemPayload[];
  }
): Promise<Response> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/orders`,
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
    throw new Error(err.message || 'Failed to create order');
  }

  return res;
}

export async function acceptOrder(
  orderId: string,
  driverId: string,
  token: string
): Promise<{ status: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/orders/${orderId}/accept?driverId=${driverId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to accept order');
  }

  return res.json();
}
