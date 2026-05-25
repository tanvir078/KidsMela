import { Link, router, usePage } from '@/lib/inertiaCompat';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useSearchHistory } from '@/Contexts/SearchHistoryContext';
import { getProducts } from '@/services/products';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'Deals', href: '/search' },
  { label: 'Orders', href: '/orders' },
];

export default function DesktopHeader() {
  const { url } = usePage();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { history, addToHistory, clearHistory } = useSearchHistory();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    getProducts().then(setAllProducts);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category?.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, allProducts]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) addToHistory(trimmed);
    setShowSuggestions(false);
    router.get('/search', trimmed ? { q: trimmed } : {});
  };

  const isActive = (href) => {
    if (href === '/') return url === '/' || url === '';
    return url.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 hidden lg:block border-b border-slate-200 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
          <p className="font-medium">Free shipping on orders over $50</p>
          <div className="flex items-center gap-4">
            <Link href="/orders" className="transition-colors hover:text-orange-400">
              Track Order
            </Link>
            <Link href="/account" className="transition-colors hover:text-orange-400">
              Help Center
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-6 py-3">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-200">
              <img
                className="h-7 w-7"
                alt="Logo"
                src={import.meta.env.VITE_APP_LOGO || '/favicon.svg'}
              />
            </div>
            <span className="text-xl font-black text-slate-900">Progotix</span>
          </Link>

          {/* Search */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl">
            <form onSubmit={submitSearch} className="flex">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                className="h-11 w-full rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Search products, brands, categories..."
              />
              <button
                type="submit"
                className="flex h-11 items-center gap-1.5 rounded-r-xl bg-orange-500 px-5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                Search
              </button>
            </form>

            {/* Search dropdown */}
            {showSuggestions && (suggestions.length > 0 || history.length > 0) && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-slate-200 bg-white shadow-xl">
                {history.length > 0 && (
                  <div className="border-b border-slate-100 px-4 py-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase text-slate-400">Recent Searches</p>
                      <button
                        type="button"
                        onClick={clearHistory}
                        className="text-xs font-bold text-red-500 hover:text-red-600"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {history.map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setQuery(item);
                            setShowSuggestions(false);
                            addToHistory(item);
                            router.get('/search', { q: item });
                          }}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div className="px-2 py-2">
                    <p className="mb-1 px-2 text-xs font-bold uppercase text-slate-400">Products</p>
                    {suggestions.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => {
                          setQuery('');
                          setShowSuggestions(false);
                        }}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50"
                      >
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-xs text-slate-400">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.category || 'Featured'}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-orange-600">
                          ${Number(product.price ?? 0).toFixed(2)}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden xl:inline">Account</span>
            </Link>

            <Link
              href="/wishlist"
              className="relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M12 21s-7-4.4-9.2-8.5C.7 8.6 3.1 4 7.4 4c2 0 3.5 1 4.6 2.4C13.1 5 14.6 4 16.6 4c4.3 0 6.7 4.6 4.6 8.5C19 16.6 12 21 12 21Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden xl:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 top-0 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden xl:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 grid min-h-[20px] min-w-[20px] place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white shadow">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="border-t border-slate-100 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'text-orange-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-orange-500" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
