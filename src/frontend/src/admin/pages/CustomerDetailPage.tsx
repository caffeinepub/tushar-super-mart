import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetCustomer } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Mail, Phone, MapPin, Package } from 'lucide-react';

export default function CustomerDetailPage() {
  const { customerId } = useParams({ from: '/admin/customers/$customerId' });
  const navigate = useNavigate();
  const { data: customer, isLoading } = useGetCustomer(customerId);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground mb-4">Customer not found</p>
        <Button onClick={() => navigate({ to: '/admin/customers' })}>Back to Customers</Button>
      </div>
    );
  }

  const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/admin/customers' })}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Customers
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">{customer.contact.name}</h3>
                <p className="text-sm text-muted-foreground">Customer ID: {customer.id}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{customer.contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{customer.contact.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.contact.address}
                      <br />
                      {customer.contact.city}, {customer.contact.postalCode}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Orders</span>
                  <Badge variant="outline">{customer.orders.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                  <Badge variant="secondary">₹{totalSpent / 100}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {customer.orders
                    .sort((a, b) => Number(b.orderTime - a.orderTime))
                    .map((order) => (
                      <div
                        key={order.id}
                        className="p-4 border rounded-lg hover:bg-accent/20 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.orderTime)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">₹{Number(order.total) / 100}</p>
                            <Badge variant="outline">{order.status}</Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.products.length} items
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

