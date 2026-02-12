import { useEffect, useState } from 'react';
import { useGetAllOrders } from '../../hooks/useQueries';

interface OrderNotification {
  orderId: string;
  customerName: string;
  total: number;
  timestamp: bigint;
}

const LAST_SEEN_KEY = 'admin_last_seen_order_time';
const POLL_INTERVAL = 30000; // 30 seconds

export function useOrderNotifications() {
  const { data: orders = [] } = useGetAllOrders();
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (orders.length === 0) return;

    const lastSeenStr = localStorage.getItem(LAST_SEEN_KEY);
    const lastSeen = lastSeenStr ? BigInt(lastSeenStr) : BigInt(0);

    const newOrders = orders
      .filter((order) => order.orderTime > lastSeen)
      .map((order) => ({
        orderId: order.id,
        customerName: order.deliveryDetails.name,
        total: Number(order.total),
        timestamp: order.orderTime,
      }))
      .sort((a, b) => Number(b.timestamp - a.timestamp));

    setNotifications(newOrders);
    setUnreadCount(newOrders.length);
  }, [orders]);

  const markAllAsRead = () => {
    if (orders.length > 0) {
      const latestOrderTime = orders.reduce(
        (max, order) => (order.orderTime > max ? order.orderTime : max),
        BigInt(0)
      );
      localStorage.setItem(LAST_SEEN_KEY, latestOrderTime.toString());
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  return {
    notifications,
    unreadCount,
    markAllAsRead,
  };
}

