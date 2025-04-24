'use client';

import { useOrderRealtime } from '../../hooks/useOrderRealTime';

export default function OrderStatus() {
  const order = useOrderRealtime('jrttNvupbhUAtyGxfi34');

  if (!order) return <p>Loading order...</p>;

  if (!order.delivery_man_id) {
    return <p>Your order is waiting for a driver to accept...</p>;
  }

  return (
    <div>
      <h2>Order #{order.order_id}</h2>
      <p>
        Status: <strong>{order.status_name}</strong>
      </p>
      {order.delivery_man_id && <p>Driver ID: {order.delivery_man_id}</p>}
    </div>
  );
}
