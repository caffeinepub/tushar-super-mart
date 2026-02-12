import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllCustomers } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Users, ChevronRight } from 'lucide-react';

export default function CustomersListPage() {
  const navigate = useNavigate();
  const { data: customers = [], isLoading } = useGetAllCustomers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.phone.includes(searchTerm) ||
      customer.contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Customers</h1>
        <p className="text-lg text-muted-foreground">{customers.length} total customers</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">
            {searchTerm ? 'No customers found' : 'No customers yet'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                navigate({ to: '/admin/customers/$customerId', params: { customerId: customer.id } })
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{customer.contact.name}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{customer.contact.phone}</p>
                <p className="text-sm text-muted-foreground truncate">{customer.contact.email}</p>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="outline">{customer.orders.length} orders</Badge>
                  <Badge variant="secondary">
                    ₹
                    {customer.orders.reduce((sum, order) => sum + Number(order.total), 0) / 100}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

