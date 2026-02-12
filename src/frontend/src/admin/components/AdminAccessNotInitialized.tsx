import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function AdminAccessNotInitialized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Access Not Initialized</CardTitle>
          <CardDescription>
            The admin system has not been set up yet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              To access the admin portal, you need a valid admin token. This token should be provided
              in the URL when first accessing the admin area.
            </p>
            <p className="font-medium">
              Expected URL format:
            </p>
            <code className="block bg-muted p-2 rounded text-xs break-all">
              https://your-app.com/?caffeineAdminToken=YOUR_TOKEN
            </code>
            <p className="mt-4">
              If you are the system owner and don't have this token, please check your deployment
              logs or contact support.
            </p>
          </div>
          <Button className="w-full" onClick={() => navigate({ to: '/shop' })}>
            Go to Shop
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
