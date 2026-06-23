// src/components/layouts/StorefrontLayout.jsx
import { Outlet } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import DesktopHeader from '@/components/Storefront/DesktopHeader';
import MobileShell from '@/components/Storefront/MobileShell';
import Footer from '@/components/Storefront/Footer';
import { CartContext } from '@/Contexts/CartContext';
import { errorHandler } from '@/lib/errorHandler';
import Alert from '@/components/ui/Alert';

export default function StorefrontLayout() {
  const { isOpen: isCartOpen } = useContext(CartContext);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(true);

  // Subscribe to error handler notifications
  useEffect(() => {
    const unsubscribe = errorHandler.subscribe((errorInfo) => {
      setError(errorInfo);
      setShowError(true);
      // Auto-dismiss after 5 seconds
      setTimeout(() => setShowError(false), 5000);
    });

    return unsubscribe;
  }, []);

  const handleErrorDismiss = () => {
    setShowError(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Desktop Header - Hidden on Mobile */}
      <div className="hidden md:block sticky top-0 z-40 bg-white border-b border-slate-200">
        <DesktopHeader />
      </div>

      {/* Mobile Shell - Hidden on Desktop */}
      <div className="md:hidden">
        <MobileShell />
      </div>

      {/* Global Error Alert */}
      {showError && error && (
        <div className="sticky top-16 md:top-0 z-30">
          <Alert
            type="error"
            onDismiss={handleErrorDismiss}
            dismissible
          >
            {error.message || 'Something went wrong. Please try again.'}
          </Alert>
        </div>
      )}

      {/* Main Content - Flexible height to push footer down */}
      <main className="flex-1 pt-4 pb-8 md:pt-6 md:pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Outlet />
        </div>
      </main>

      {/* Footer - Only show when cart/wishlist not open */}
      {!isCartOpen && (
        <footer className="mt-auto border-t border-slate-200 bg-slate-50">
          <Footer />
        </footer>
      )}
    </div>
  );
}
