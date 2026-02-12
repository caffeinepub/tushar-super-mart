import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useState } from 'react';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/shop/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${quantity} × ${product.name} added to cart!`);
      navigate({ to: '/shop' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground mb-4">Product not found</p>
        <Button onClick={() => navigate({ to: '/shop' })}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Toaster />
      
      <Button variant="ghost" onClick={() => navigate({ to: '/shop' })}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square bg-accent/20 rounded-lg flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image.getDirectURL()}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShoppingCart className="w-32 h-32 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-primary">₹{Number(product.price) / 100}</span>
            {product.available ? (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                In Stock ({Number(product.quantity)} available)
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {product.available && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(Number(product.quantity), quantity + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button className="w-full text-lg py-6" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart - ₹{(Number(product.price) * quantity) / 100}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

