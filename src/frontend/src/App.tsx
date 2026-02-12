import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import EntryLandingPage from './pages/EntryLandingPage';
import NotFoundPage from './pages/NotFoundPage';
import CustomerLayout from './customer/CustomerLayout';
import AdminLayout from './admin/AdminLayout';
import ProductListPage from './customer/pages/ProductListPage';
import ProductDetailPage from './customer/pages/ProductDetailPage';
import CartPage from './customer/pages/CartPage';
import CheckoutPage from './customer/pages/CheckoutPage';
import OrderConfirmationPage from './customer/pages/OrderConfirmationPage';
import OffersPage from './customer/pages/OffersPage';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import OrdersDashboardPage from './admin/pages/OrdersDashboardPage';
import NotificationsFeedPage from './admin/pages/NotificationsFeedPage';
import CustomersListPage from './admin/pages/CustomersListPage';
import CustomerDetailPage from './admin/pages/CustomerDetailPage';
import OffersManagementPage from './admin/pages/OffersManagementPage';
import ProductsManagementPage from './admin/pages/ProductsManagementPage';
import AdminGuard from './admin/components/AdminGuard';
import { CartProvider } from './customer/cart/CartContext';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});

// Landing page route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: EntryLandingPage,
});

// Customer routes
const customerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: () => (
    <CartProvider>
      <CustomerLayout />
    </CartProvider>
  ),
});

const customerProductsRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/',
  component: ProductListPage,
});

const customerProductDetailRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/product/$productId',
  component: ProductDetailPage,
});

const customerCartRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/cart',
  component: CartPage,
});

const customerCheckoutRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const customerOrderConfirmationRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

const customerOffersRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/offers',
  component: OffersPage,
});

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGuard>
      <AdminLayout />
    </AdminGuard>
  ),
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: OrdersDashboardPage,
});

const adminNotificationsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/notifications',
  component: NotificationsFeedPage,
});

const adminCustomersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/customers',
  component: CustomersListPage,
});

const adminCustomerDetailRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/customers/$customerId',
  component: CustomerDetailPage,
});

const adminOffersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/offers',
  component: OffersManagementPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/products',
  component: ProductsManagementPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  customerRoute.addChildren([
    customerProductsRoute,
    customerProductDetailRoute,
    customerCartRoute,
    customerCheckoutRoute,
    customerOrderConfirmationRoute,
    customerOffersRoute,
  ]),
  adminLoginRoute,
  adminRoute.addChildren([
    adminDashboardRoute,
    adminNotificationsRoute,
    adminCustomersRoute,
    adminCustomerDetailRoute,
    adminOffersRoute,
    adminProductsRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
