import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { usePlaceOrder } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import type { DeliveryDetails } from '../../backend';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const placeOrderMutation = usePlaceOrder();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryInstructions: '',
    preferredDeliveryTime: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const deliveryDetails: DeliveryDetails = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        deliveryInstructions: formData.deliveryInstructions || undefined,
        preferredDeliveryTime: formData.preferredDeliveryTime || undefined,
      };

      const orderId = await placeOrderMutation.mutateAsync({
        customerInfo: deliveryDetails,
        products: items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          available: item.available,
          quantity: BigInt(item.cartQuantity),
          image: item.image,
        })),
      });

      clearCart();
      navigate({ to: '/shop/order-confirmation/$orderId', params: { orderId } });
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
        <h2 className="text-3xl font-bold">Your cart is empty</h2>
        <Button size="lg" onClick={() => navigate({ to: '/shop' })}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Toaster />
      
      <div>
        <h1 className="text-4xl font-bold mb-2">Checkout</h1>
        <p className="text-lg text-muted-foreground">Complete your order</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Delivery Details Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                  <Textarea
                    id="deliveryInstructions"
                    rows={2}
                    placeholder="e.g., Ring the doorbell, leave at the gate..."
                    value={formData.deliveryInstructions}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryInstructions: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredDeliveryTime">Preferred Delivery Time (Optional)</Label>
                  <Input
                    id="preferredDeliveryTime"
                    placeholder="e.g., Morning, Evening, After 6 PM..."
                    value={formData.preferredDeliveryTime}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredDeliveryTime: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.cartQuantity}× {item.name}
                      </span>
                      <span className="font-semibold">
                        ₹{(Number(item.price) * item.cartQuantity) / 100}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{totalPrice / 100}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold text-primary">FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice / 100}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full text-lg py-6"
                  disabled={placeOrderMutation.isPending}
                >
                  {placeOrderMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

