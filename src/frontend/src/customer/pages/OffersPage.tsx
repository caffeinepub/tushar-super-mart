import { useGetActiveOffers } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Tag } from 'lucide-react';

export default function OffersPage() {
  const { data: offers = [], isLoading } = useGetActiveOffers();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Special Offers</h1>
        <p className="text-lg text-muted-foreground">
          Check out our latest deals and festival offers
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20">
          <Tag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No active offers at the moment</p>
          <p className="text-sm text-muted-foreground mt-2">Check back soon for exciting deals!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {offer.banner && (
                <div className="aspect-video bg-accent/20 overflow-hidden">
                  <img
                    src={offer.banner.getDirectURL()}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-2xl">{offer.title}</CardTitle>
                  <Badge className="bg-primary text-primary-foreground">Active</Badge>
                </div>
                <CardDescription className="text-base">{offer.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Valid from {formatDate(offer.startDate)}</span>
                  <span>•</span>
                  <span>Until {formatDate(offer.endDate)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

