import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllProducts } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function ProductListPage() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useGetAllProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-8">
      <Toaster />
      
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Fresh Groceries</h1>
        <p className="text-lg text-muted-foreground">Quality products delivered to your doorstep</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader
                onClick={() => navigate({ to: '/shop/product/$productId', params: { productId: product.id } })}
              >
                <div className="aspect-square bg-accent/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image.getDirectURL()}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">₹{Number(product.price) / 100}</span>
                  {product.available ? (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={!product.available}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

