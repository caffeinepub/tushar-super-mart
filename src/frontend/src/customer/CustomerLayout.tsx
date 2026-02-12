import { Outlet, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Home, Tag } from 'lucide-react';
import { useCart } from './cart/CartContext';

export default function CustomerLayout() {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="/assets/generated/tushar-super-mart-logo.dim_512x512.png"
                alt="Tushar Super Mart"
                className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer"
                onClick={() => navigate({ to: '/shop' })}
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Tushar Super Mart</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Fresh & Quality Groceries</p>
              </div>
            </div>

            <nav className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/shop' })}
                className="hidden md:flex"
              >
                <Home className="w-4 h-4 mr-2" />
                Products
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/shop/offers' })}
                className="hidden md:flex"
              >
                <Tag className="w-4 h-4 mr-2" />
                Offers
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate({ to: '/shop/cart' })}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card">
        <div className="container mx-auto px-4 py-6 sm:py-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Tushar Super Mart. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
