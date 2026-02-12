import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, ShoppingCart } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-lg text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate({ to: '/' })}
            className="gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ to: '/shop' })}
            className="gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Browse Shop
          </Button>
        </div>
      </div>
    </div>
  );
}
