import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: isCheckingAdmin, isFetched } = useIsCallerAdmin();

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: '/admin/login', replace: true });
    }
  }, [identity, isInitializing, navigate]);

  useEffect(() => {
    // If authenticated but not admin, redirect to shop after showing message
    if (identity && isFetched && isAdmin === false) {
      const timer = setTimeout(() => {
        navigate({ to: '/shop', replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [identity, isAdmin, isFetched, navigate]);

  // Loading state while checking identity or admin status
  if (isInitializing || (identity && isCheckingAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show loading while redirecting
  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Authenticated but not admin
  if (isFetched && isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You do not have administrator privileges to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              This portal is restricted to authorized administrators only. Redirecting you to the shop...
            </p>
            <Button className="w-full" onClick={() => navigate({ to: '/shop' })}>
              Go to Shop Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated and admin
  return <>{children}</>;
}
