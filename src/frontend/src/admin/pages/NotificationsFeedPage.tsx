import { useOrderNotifications } from '../notifications/useOrderNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck } from 'lucide-react';

export default function NotificationsFeedPage() {
  const { notifications, unreadCount, markAllAsRead } = useOrderNotifications();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Notifications</h1>
          <p className="text-lg text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} new order${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No new notifications</p>
            <p className="text-sm text-muted-foreground mt-2">
              You'll be notified when new orders are placed
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.orderId} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Bell className="w-5 h-5 text-primary" />
                      New Order Received
                      <Badge>New</Badge>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Order #{notification.orderId}</p>
                      <p>Customer: {notification.customerName}</p>
                      <p>{formatDate(notification.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ₹{notification.total / 100}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

