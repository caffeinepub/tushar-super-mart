import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export default function EntryLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <img
            src="/assets/generated/tushar-super-mart-logo.dim_512x512.png"
            alt="Tushar Super Mart"
            className="w-32 h-32 mx-auto mb-6 drop-shadow-lg"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3">Tushar Super Mart</h1>
          <p className="text-xl md:text-2xl text-muted-foreground">Fresh groceries delivered to your doorstep</p>
        </header>

        {/* Hero Banner */}
        <div className="max-w-5xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="/assets/generated/tushar-super-mart-hero.dim_1600x600.png"
            alt="Fresh groceries"
            className="w-full h-auto"
          />
        </div>

        {/* Customer Entry - Single CTA */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl p-10 shadow-xl border-2 border-primary/20 hover:border-primary transition-all hover:shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-3">Start Shopping</h2>
                <p className="text-lg text-muted-foreground max-w-md">
                  Browse our fresh selection of fruits, vegetables, and groceries. Order now for quick delivery!
                </p>
              </div>
              <Button
                size="lg"
                className="text-lg px-8 py-6 w-full sm:w-auto"
                onClick={() => navigate({ to: '/shop' })}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Browse Products
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🥬</div>
            <h3 className="text-xl font-semibold mb-2">Fresh & Quality</h3>
            <p className="text-muted-foreground">Handpicked fresh produce delivered daily</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground">Quick and reliable delivery to your door</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-muted-foreground">Competitive prices and special offers</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
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
