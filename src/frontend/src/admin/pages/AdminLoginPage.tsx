import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2, ShieldAlert, ShieldOff } from 'lucide-react';
import { isAdminNoAuthEnabled } from '../adminNoAuth';

export default function AdminLoginPage() {
  const noAuthMode = isAdminNoAuthEnabled();
  const { login, identity, isLoggingIn, isLoginError } = useInternetIdentity();
  const navigate = useNavigate();
  
  // Disable admin check query when in no-auth mode
  const { data: isAdmin, isLoading: isCheckingAdmin, isFetched } = useIsCallerAdmin({
    enabled: !noAuthMode,
  });
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    if (noAuthMode) return;
    // If authenticated and admin, redirect to admin dashboard
    if (identity && isFetched && isAdmin === true) {
      navigate({ to: '/admin', replace: true });
    }
    // If authenticated but not admin, show access denied
    else if (identity && isFetched && isAdmin === false) {
      setShowAccessDenied(true);
      // Auto-redirect after showing message
      const timer = setTimeout(() => {
        navigate({ to: '/shop', replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [identity, isAdmin, isFetched, navigate, noAuthMode]);

  const handleLogin = async () => {
    setShowAccessDenied(false);
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  // In no-auth mode, show a different UI
  if (noAuthMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
                <ShieldOff className="w-8 h-8 text-warning" />
              </div>
            </div>
            <CardTitle className="text-3xl">Admin Portal</CardTitle>
            <CardDescription>Authentication temporarily disabled</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-center">
                Admin authentication is currently disabled for testing purposes. You can access the
                admin portal directly without logging in.
              </p>
            </div>

            <Button
              className="w-full text-lg py-6"
              onClick={() => navigate({ to: '/admin' })}
            >
              <Shield className="w-5 h-5 mr-2" />
              Enter Admin Portal
            </Button>

            <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/' })}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied state
  if (showAccessDenied && identity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>You do not have administrator privileges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Your account is not authorized to access the admin portal. Redirecting you to the shop...
            </p>
            <Button className="w-full" onClick={() => navigate({ to: '/shop' })}>
              Go to Shop Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show checking admin status
  if (identity && isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-secondary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Admin Portal</CardTitle>
          <CardDescription>Secure access for Tushar Super Mart administrators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            This area is restricted to authorized administrators only. Please authenticate using
            Internet Identity to continue.
          </p>

          {isLoginError && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
              Login failed. Please try again.
            </div>
          )}

          <Button
            className="w-full text-lg py-6"
            onClick={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Login with Internet Identity
              </>
            )}
          </Button>

          <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/' })}>
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
