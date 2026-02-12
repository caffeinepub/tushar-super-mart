import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/shop/order-confirmation/$orderId' });
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-center py-12">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Order Placed Successfully!</h1>
        <p className="text-lg text-muted-foreground">
          Thank you for shopping with Tushar Super Mart
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Order ID</p>
            <p className="text-2xl font-bold text-primary">#{orderId}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            We've received your order and will start processing it shortly. You'll receive updates
            on your order status.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" onClick={() => navigate({ to: '/shop' })}>
          <ShoppingBag className="w-5 h-5 mr-2" />
          Continue Shopping
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate({ to: '/' })}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}

