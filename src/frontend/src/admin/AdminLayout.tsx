import { Outlet, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Tag, Bell, Package } from 'lucide-react';
import AdminUserMenu from './components/AdminUserMenu';
import { useOrderNotifications } from './notifications/useOrderNotifications';
import { Badge } from '@/components/ui/badge';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { unreadCount } = useOrderNotifications();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/tushar-super-mart-logo.dim_512x512.png"
                alt="Tushar Super Mart"
                className="w-10 h-10"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground">Admin Portal</h1>
                <p className="text-xs text-muted-foreground">Tushar Super Mart</p>
              </div>
            </div>

            <nav className="flex items-center gap-1 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/admin' })}
                className="text-xs sm:text-sm"
              >
                <LayoutDashboard className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Orders</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/admin/products' })}
                className="text-xs sm:text-sm"
              >
                <Package className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Products</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/admin/customers' })}
                className="text-xs sm:text-sm"
              >
                <Users className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Customers</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/admin/offers' })}
                className="text-xs sm:text-sm"
              >
                <Tag className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Offers</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/admin/notifications' })}
                className="relative text-xs sm:text-sm"
              >
                <Bell className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Alerts</span>
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <AdminUserMenu />
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
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Tushar Super Mart Admin. Built with ❤️ using{' '}
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
