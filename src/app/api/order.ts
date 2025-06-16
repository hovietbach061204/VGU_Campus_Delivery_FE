import { fetchWithAuth } from './fetchWithAuth';

// app/api/order.ts
// Update the payload type to match the new backend API
export interface FoodItemPayload {
  name: string;
  quantity: number;
  description?: string;
}

export interface PurchaserPayload {
  purchaserId: string;
  purchaserLat: number;
  purchaserLon: number;
}

export interface CreateOrderPayload {
  voucherCode: string[];
  eateryName: string;
  foodItems: FoodItemPayload[];
  purchaser: PurchaserPayload;
}

export async function createOrder(
  token: string,
  payload: CreateOrderPayload
): Promise<Response> {
  const res = await fetchWithAuth(
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
  deliveryManLon: number,
  deliveryManLat: number,
  token: string
): Promise<{ status: string }> {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/orders/${orderId}/accept?driverId=${driverId}&deliveryManLon=${deliveryManLon}&deliveryManLat=${deliveryManLat}`,
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

// app/api/order.ts

export async function fetchPendingOrders(userId: string, token: string) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/orders/pending/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch pending orders');
  }

  const data = await res.json();
  return data.result;
}

export async function deleteOrder(orderId: string, token: string) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/orders/${orderId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to cancel order');
  }

  return res.json();
}

export async function cancelOrder(orderId: string, token: string) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/orders/${orderId}/cancel`,
    {
      method: 'POST', // ✅ must be POST, not DELETE
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to cancel order');
  }

  return res.json(); // { status: "CANCELLED", message: "Order xyz cancelled" }
}

export async function advanceOrderStatus(orderId: string, token: string) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/orders/${orderId}/status`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update order status');
  }

  return res.json();
}

export async function revertOrderToPending(orderId: string, token: string) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/orders/${orderId}/status/pending`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to revert status');
  }

  return res.json();
}
