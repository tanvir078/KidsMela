import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
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
import { NotificationProvider } from './Contexts/NotificationContext';
import HomePage from './Pages/home/HomePage';
import CategoriesPage from './Pages/categories/CategoriesPage';
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
import { storefrontApi } from './lib/api';
import { PageProvider, RouterBridge } from './lib/inertiaCompat';

const routes = [
  { path: '/', loader: () => storefrontApi.home(), component: HomePage },
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
];

function RouteLoader({ route }) {
  const location = useLocation();
  const params = useParams();
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
  }, [location.search, params, route]);

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
      <NotificationProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <ThemeProvider>
                <ComparisonProvider>
                  <ToastProvider>
                    <CouponProvider>
                      <CurrencyProvider>
                        <SearchHistoryProvider>{children}</SearchHistoryProvider>
                      </CurrencyProvider>
                    </CouponProvider>
                  </ToastProvider>
                </ComparisonProvider>
              </ThemeProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={<RouteLoader route={route} />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}
