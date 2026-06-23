import { useEffect, useState } from 'react';
import { BrowserRouter, HashRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import ErrorBoundary from './Components/Storefront/ErrorBoundary';
import { CartProvider } from './Contexts/CartContext';
import { WishlistProvider } from './Contexts/WishlistContext';
import { RecentlyViewedProvider } from './Contexts/RecentlyViewedContext';
import { ThemeProvider } from './Contexts/ThemeContext';
import { ComparisonProvider } from './Contexts/ComparisonContext';
import { ToastProvider } from './Contexts/ToastContext';
import { CouponProvider } from './Contexts/CouponContext';
import { CurrencyProvider } from './Contexts/CurrencyContext';
import { SearchHistoryProvider } from './Contexts/SearchHistoryContext';
import { LanguageProvider } from './Contexts/LanguageContext';
import { NotificationProvider } from './Contexts/NotificationContext';
import { AuthProvider } from './Contexts/AuthContext';
import HomePage from './Pages/home/HomePage';
import CategoriesPage from './Pages/categories/CategoriesPage';
import CampaignsPage from './Pages/campaigns/CampaignsPage';
import SearchPage from './Pages/search/SearchPage';
import ProductDetailsPage from './Pages/products/ProductDetailsPage';
import CartPage from './Pages/cart/CartPage';
import WishlistPage from './Pages/wishlist/WishlistPage';
import CheckoutPage from './Pages/checkout/CheckoutPage';
import OrdersPage from './Pages/orders/OrdersPage';
import OrderDetailsPage from './Pages/orders/OrderDetailsPage';
import OrderTrackingPage from './Pages/orders/OrderTrackingPage';
import ProfilePage from './Pages/Profile/ProfilePage';
import RecentlyViewedPage from './Pages/recently-viewed/RecentlyViewedPage';
import ComparePage from './Pages/compare/ComparePage';
import LoginPage from './Pages/auth/LoginPage';
import RegisterPage from './Pages/auth/RegisterPage';
import OAuthCallback from './Pages/auth/OAuthCallback';
import FlashSalePage from './Pages/flash-sale/FlashSalePage';
import LanguageSelectPage from './Pages/settings/LanguageSelectPage';
import CurrencySelectPage from './Pages/settings/CurrencySelectPage';
import BundlePage from './Pages/bundles/BundlePage';
import AboutPage from './Pages/about/AboutPage';
import ContactPage from './Pages/contact/ContactPage';
import FAQPage from './Pages/faq/FAQPage';
import TermsPage from './Pages/terms/TermsPage';
import PrivacyPage from './Pages/privacy/PrivacyPage';
import SizeGuidePage from './Pages/size-guide/SizeGuidePage';
import ReturnPolicyPage from './Pages/return-policy/ReturnPolicyPage';
import ShippingPage from './Pages/shipping/ShippingPage';
import { storefrontApi } from './lib/api';
import { PageProvider, RouterBridge } from './lib/inertiaCompat';
import AdminLayout from './Components/Admin/AdminLayout';
import AdminLoginPage from './Pages/admin/AdminLoginPage';
import DashboardPage from './Pages/admin/DashboardPage';
import ProductsPage from './Pages/admin/ProductsPage';
import AdminOrdersPage from './Pages/admin/OrdersPage';
import CustomersPage from './Pages/admin/CustomersPage';
import AnalyticsPage from './Pages/admin/AnalyticsPage';
import SettingsPage from './Pages/admin/SettingsPage';
import BannersPage from './Pages/admin/BannersPage';
import FooterSettingsPage from './Pages/admin/FooterSettingsPage';

const routes = [
  { path: '/', loader: () => storefrontApi.home(), component: HomePage },
  { path: '/campaigns', loader: () => storefrontApi.campaigns(), component: CampaignsPage },
  { path: '/categories', loader: () => storefrontApi.categories(), component: CategoriesPage },
  { path: '/search', loader: ({ query }) => storefrontApi.products(Object.fromEntries(query)), component: SearchPage },
  { path: '/products/:id', loader: ({ params }) => storefrontApi.product(params.id).then((data) => ({ ...data, productId: Number(params.id) })), component: ProductDetailsPage },
  { path: '/cart', loader: () => Promise.resolve({}), component: CartPage },
  { path: '/wishlist', loader: () => Promise.resolve({}), component: WishlistPage },
  { path: '/checkout', loader: () => storefrontApi.checkoutSettings(), component: CheckoutPage },
  { path: '/orders', loader: () => storefrontApi.orders(), component: OrdersPage },
  { path: '/orders/:id', loader: ({ params }) => storefrontApi.order(params.id), component: OrderDetailsPage },
  { path: '/orders/:id/tracking', loader: ({ params }) => storefrontApi.tracking(params.id), component: OrderTrackingPage },
  { path: '/account', loader: () => Promise.resolve({}), component: ProfilePage },
  { path: '/recently-viewed', loader: () => Promise.resolve({}), component: RecentlyViewedPage },
  { path: '/compare', loader: () => Promise.resolve({}), component: ComparePage },
  { path: '/login', loader: () => Promise.resolve({}), component: LoginPage },
  { path: '/register', loader: () => Promise.resolve({}), component: RegisterPage },
  { path: '/auth/callback', loader: () => Promise.resolve({}), component: OAuthCallback },
  { path: '/flash-sale', loader: () => Promise.resolve({}), component: FlashSalePage },
  { path: '/bundles', loader: () => Promise.resolve({}), component: BundlePage },
  { path: '/about', loader: () => Promise.resolve({}), component: AboutPage },
  { path: '/contact', loader: () => Promise.resolve({}), component: ContactPage },
  { path: '/faq', loader: () => Promise.resolve({}), component: FAQPage },
  { path: '/terms', loader: () => Promise.resolve({}), component: TermsPage },
  { path: '/privacy', loader: () => Promise.resolve({}), component: PrivacyPage },
  { path: '/size-guide', loader: () => Promise.resolve({}), component: SizeGuidePage },
  { path: '/return-policy', loader: () => Promise.resolve({}), component: ReturnPolicyPage },
  { path: '/shipping', loader: () => Promise.resolve({}), component: ShippingPage },
  { path: '/settings/language', loader: () => Promise.resolve({}), component: LanguageSelectPage },
  { path: '/settings/currency', loader: () => Promise.resolve({}), component: CurrencySelectPage },
];

const AppRouter = import.meta.env.PROD ? HashRouter : BrowserRouter;

function RouteLoader({ route }) {
  const location = useLocation();
  const params = useParams();
  const paramsKey = JSON.stringify(params);
  const [state, setState] = useState({ loading: true, props: {}, error: null });
  const Component = route.component;

  useEffect(() => {
    let alive = true;
    setState((current) => ({ ...current, loading: true, error: null }));
    route.loader({ params, query: new URLSearchParams(location.search) })
      .then((props) => alive && setState({ loading: false, props, error: null }))
      .catch((error) => alive && setState({ loading: false, props: {}, error: error.message }));
    return () => {
      alive = false;
    };
  }, [location.search, paramsKey, route]);

  if (state.loading) {
    return <div className="grid min-h-screen place-items-center text-sm font-black text-slate-500">Loading...</div>;
  }

  if (state.error) {
    return <div className="grid min-h-screen place-items-center px-6 text-center text-sm font-black text-red-600">{state.error}</div>;
  }

  return (
    <PageProvider value={{ props: { ...state.props, auth: { user: null } }, url: `${location.pathname}${location.search}` }}>
      <RouterBridge />
      <Component {...state.props} />
    </PageProvider>
  );
}

function Providers({ children }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <ThemeProvider>
                  <ComparisonProvider>
                    <ToastProvider>
                      <CouponProvider>
                        <CurrencyProvider>
                          <LanguageProvider>
                            <SearchHistoryProvider>{children}</SearchHistoryProvider>
                          </LanguageProvider>
                        </CurrencyProvider>
                      </CouponProvider>
                    </ToastProvider>
                  </ComparisonProvider>
                </ThemeProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AppRouter>
      <Providers>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout><DashboardPage /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><ProductsPage /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
          <Route path="/admin/customers" element={<AdminLayout><CustomersPage /></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout><AnalyticsPage /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />
          <Route path="/admin/banners" element={<AdminLayout><BannersPage /></AdminLayout>} />
          <Route path="/admin/footer-settings" element={<AdminLayout><FooterSettingsPage /></AdminLayout>} />
          
          {/* Storefront Routes */}
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={<RouteLoader route={route} />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Providers>
    </AppRouter>
  );
}
