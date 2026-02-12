import { useState } from 'react';
import {
  useGetAllOffers,
  useCreateOffer,
  useUpdateOffer,
  useActivateOffer,
  useDeactivateOffer,
  useDeleteOffer,
} from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Tag, Trash2, Edit, Power, PowerOff } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import type { Offer } from '../../backend';
import { ExternalBlob } from '../../backend';

export default function OffersManagementPage() {
  const { data: offers = [], isLoading } = useGetAllOffers();
  const createMutation = useCreateOffer();
  const updateMutation = useUpdateOffer();
  const activateMutation = useActivateOffer();
  const deactivateMutation = useDeactivateOffer();
  const deleteMutation = useDeleteOffer();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setBannerFile(null);
    setBannerPreview(null);
    setEditingOffer(null);
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      startDate: new Date(Number(offer.startDate) / 1000000).toISOString().slice(0, 16),
      endDate: new Date(Number(offer.endDate) / 1000000).toISOString().slice(0, 16),
      isActive: offer.isActive,
    });
    if (offer.banner) {
      setBannerPreview(offer.banner.getDirectURL());
    }
    setIsDialogOpen(true);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let banner: ExternalBlob | null = null;

      if (bannerFile) {
        const arrayBuffer = await bannerFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        banner = ExternalBlob.fromBytes(uint8Array);
      } else if (editingOffer?.banner) {
        banner = editingOffer.banner;
      }

      const startDate = BigInt(new Date(formData.startDate).getTime() * 1000000);
      const endDate = BigInt(new Date(formData.endDate).getTime() * 1000000);

      if (editingOffer) {
        await updateMutation.mutateAsync({
          id: editingOffer.id,
          title: formData.title,
          description: formData.description,
          banner,
          startDate,
          endDate,
          isActive: formData.isActive,
        });
        toast.success('Offer updated successfully');
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          description: formData.description,
          banner,
          startDate,
          endDate,
          isActive: formData.isActive,
        });
        toast.success('Offer created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save offer');
    }
  };

  const handleToggleActive = async (offer: Offer) => {
    try {
      if (offer.isActive) {
        await deactivateMutation.mutateAsync(offer.id);
        toast.success('Offer deactivated');
      } else {
        await activateMutation.mutateAsync(offer.id);
        toast.success('Offer activated');
      }
    } catch (error) {
      toast.error('Failed to update offer status');
    }
  };

  const handleDelete = async (offerId: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      try {
        await deleteMutation.mutateAsync(offerId);
        toast.success('Offer deleted');
      } catch (error) {
        toast.error('Failed to delete offer');
      }
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      <Toaster />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Offers Management</h1>
          <p className="text-lg text-muted-foreground">{offers.length} total offers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
                <DialogDescription>
                  {editingOffer ? 'Update offer details' : 'Add a new festival offer or promotion'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banner">Banner Image (Optional)</Label>
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                  />
                  {bannerPreview && (
                    <div className="mt-2">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20">
          <Tag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No offers yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden">
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
                  <CardTitle className="text-xl">{offer.title}</CardTitle>
                  <Badge variant={offer.isActive ? 'default' : 'secondary'}>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{offer.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>Valid: {formatDate(offer.startDate)} - {formatDate(offer.endDate)}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(offer)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(offer)}
                  >
                    {offer.isActive ? (
                      <>
                        <PowerOff className="w-4 h-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(offer.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

