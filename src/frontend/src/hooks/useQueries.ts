import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Offer, Order, Customer, DeliveryDetails, OrderStatus, UserProfile } from '../backend';
import { ExternalBlob } from '../backend';

// Admin permission check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Admin check failed:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// User profile queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Product queries
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchProducts(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'search', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchTerm.trim()) return actor.getAllProducts();
      return actor.searchProducts(searchTerm);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(productId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product>({
    queryKey: ['products', productId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

// Offer queries
export function useGetActiveOffers() {
  const { actor, isFetching } = useActor();

  return useQuery<Offer[]>({
    queryKey: ['offers', 'active'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveOffers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOffers() {
  const { actor, isFetching } = useActor();

  return useQuery<Offer[]>({
    queryKey: ['offers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOffers();
    },
    enabled: !!actor && !isFetching,
  });
}

// Order mutations
export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerInfo,
      products,
    }: {
      customerInfo: DeliveryDetails;
      products: Product[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(null, customerInfo, products);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Admin order queries
export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Customer queries
export function useGetAllCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCustomer(customerId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Customer | null>({
    queryKey: ['customers', customerId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCustomer(customerId);
    },
    enabled: !!actor && !isFetching && !!customerId,
  });
}

// Offer mutations
export function useCreateOffer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      banner,
      startDate,
      endDate,
      isActive,
    }: {
      title: string;
      description: string;
      banner: ExternalBlob | null;
      startDate: bigint;
      endDate: bigint;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOffer(title, description, banner, startDate, endDate, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
}

export function useUpdateOffer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      banner,
      startDate,
      endDate,
      isActive,
    }: {
      id: string;
      title: string;
      description: string;
      banner: ExternalBlob | null;
      startDate: bigint;
      endDate: bigint;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOffer(id, title, description, banner, startDate, endDate, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
}

export function useActivateOffer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.activateOffer(offerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
}

export function useDeactivateOffer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deactivateOffer(offerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
}

export function useDeleteOffer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteOffer(offerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
}

// Product mutations (admin)
export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      price,
      quantity,
      available,
      image,
    }: {
      name: string;
      description: string;
      price: bigint;
      quantity: bigint;
      available: boolean;
      image: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(name, description, price, quantity, available, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      price,
      quantity,
      available,
      image,
    }: {
      id: string;
      name: string;
      description: string;
      price: bigint;
      quantity: bigint;
      available: boolean;
      image: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, name, description, price, quantity, available, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
