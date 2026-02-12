import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../cart/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
        <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground" />
        <h2 className="text-3xl font-bold">Your cart is empty</h2>
        <p className="text-lg text-muted-foreground">Add some products to get started!</p>
        <Button size="lg" onClick={() => navigate({ to: '/shop' })}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-lg text-muted-foreground">{totalItems} items in your cart</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image.getDirectURL()}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xl font-bold text-primary">₹{Number(item.price) / 100}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-semibold w-12 text-center">
                        {item.cartQuantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                        disabled={item.cartQuantity >= Number(item.quantity)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
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
            </CardContent>
            <CardFooter>
              <Button
                className="w-full text-lg py-6"
                onClick={() => navigate({ to: '/shop/checkout' })}
              >
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

