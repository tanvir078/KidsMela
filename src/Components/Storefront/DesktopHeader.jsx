import { Link, router, usePage } from '@/lib/inertiaCompat';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useSearchHistory } from '@/Contexts/SearchHistoryContext';
import { useTheme } from '@/Contexts/ThemeContext';
import { getProducts } from '@/services/products';
import { storefrontApi } from '@/lib/api';
import { Phone, HeadphonesIcon, ChevronDown, User, LogOut, X, ChevronRight, Search, ShoppingCart, Heart, Moon, Sun } from 'lucide-react';

export default function DesktopHeader() {
  const { url, auth } = usePage();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const { theme, toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchCategory, setSearchCategory] = useState('all');
  const [trendingSearches, setTrendingSearches] = useState(['Dresses', 'Shirts', 'Jeans', 'Sneakers', 'Handbags', 'Jackets']);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [navigationItems, setNavigationItems] = useState([]);
  const [navigationLoading, setNavigationLoading] = useState(true);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const megaMenuRef = useRef(null);

  useEffect(() => {
    getProducts().then(setAllProducts);
  }, []);

  useEffect(() => {
    storefrontApi.categories()
      .then(data => {
        setCategories(data.categories || []);
        setCategoriesLoading(false);
      })
      .catch(error => {
        console.error('Failed to load categories:', error);
        setCategoriesLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('/api/navigation')
      .then(res => res.json())
      .then(data => {
        setNavigationItems(data.data || []);
        setNavigationLoading(false);
      })
      .catch(error => {
        console.error('Failed to load navigation:', error);
        setNavigationLoading(false);
      });
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
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setShowMegaMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoverTimeout(setTimeout(() => setShowMegaMenu(true), 200));
  }, [hoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoverTimeout(setTimeout(() => setShowMegaMenu(false), 200));
  }, [hoverTimeout]);

  const handleClick = useCallback(() => {
    setShowMegaMenu(!showMegaMenu);
  }, [showMegaMenu]);

  const submitSearch = useCallback((e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) addToHistory(trimmed);
    setShowSuggestions(false);
    router.get('/search', trimmed ? { q: trimmed } : {});
  }, [query, addToHistory]);

  const isActive = useCallback((href) => {
    if (href === '/') return url === '/' || url === '';
    return url.startsWith(href);
  }, [url]);

  return (
    <header className="sticky top-0 z-50 hidden lg:block border-b border-slate-200 bg-white shadow-sm">
      {/* Announcement Banner */}
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-rose-600 to-fuchsia-700 text-white">
          <div className="flex items-center justify-between px-6 py-2 text-sm">
            <p className="flex-1 text-center font-semibold">
              🔥 MEGA SALE: Up to 50% OFF on selected items! Free shipping on orders over ৳2000
            </p>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="ml-4 rounded-full p-1 hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <p className="font-medium">New season styles, easy exchange, and fast delivery</p>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="h-3 w-3" />
              <span>+880 1XXX-XXXXXX</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/orders" className="flex items-center gap-1 transition-colors hover:text-orange-400">
              Track Order
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="/contact" className="flex items-center gap-1 transition-colors hover:text-rose-300">
              <HeadphonesIcon className="h-3 w-3" />
              Help Center
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-rose-600 to-fuchsia-700 shadow-lg shadow-rose-200">
              <img
                className="h-7 w-7"
                alt="Logo"
                src={import.meta.env.VITE_APP_LOGO || '/favicon.svg'}
              />
            </div>
            <span className="text-xl font-black text-slate-900">Kids Mela</span>
          </Link>

          {/* Search */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl">
            <form onSubmit={submitSearch} className="flex">
              <div className="flex-1 flex rounded-xl border-2 border-slate-200 bg-slate-50 focus-within:border-rose-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500/20 transition-all duration-300">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="border-r border-slate-200 bg-transparent px-3 py-3 text-sm font-semibold text-slate-600 outline-none"
                >
                  <option value="all">All</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="accessories">Accessories</option>
                </select>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                  className="flex-1 border-0 bg-transparent px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                  placeholder="Search dresses, shirts, shoes, brands..."
                  aria-label="Search products"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="flex h-11 items-center gap-1.5 rounded-xl bg-rose-600 px-5 text-sm font-bold text-white transition-all duration-300 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-200"
                aria-label="Submit search"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </form>

            {/* Search dropdown */}
            {showSuggestions && (suggestions.length > 0 || history.length > 0 || trendingSearches.length > 0) && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-slate-200 bg-white shadow-xl">
                {trendingSearches.length > 0 && history.length === 0 && query.length < 2 && (
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="mb-2 text-xs font-bold uppercase text-slate-400">Trending Searches</p>
                    <div className="flex flex-wrap gap-1.5">
                      {trendingSearches.map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setQuery(item);
                            setShowSuggestions(false);
                            addToHistory(item);
                            router.get('/search', { q: item, category: searchCategory !== 'all' ? searchCategory : undefined });
                          }}
                          className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
                            router.get('/search', { q: item, category: searchCategory !== 'all' ? searchCategory : undefined });
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
                          ৳{Number(product.price ?? 0).toFixed(2)}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
                {query.length >= 2 && (
                  <div className="border-t border-slate-100 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        addToHistory(query);
                        setShowSuggestions(false);
                        router.get('/search', { q: query, category: searchCategory !== 'all' ? searchCategory : undefined });
                      }}
                      className="w-full rounded-lg bg-rose-50 px-4 py-2 text-center text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100"
                    >
                      View all results for "{query}"
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-xl p-2.5 text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex items-center justify-center rounded-xl p-2.5 text-slate-600 transition-all duration-300 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-lg animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center rounded-xl p-2.5 text-slate-600 transition-all duration-300 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-lg animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <div ref={userMenuRef} className="relative">
              {auth?.user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-600 text-sm font-bold text-white shadow-md">
                    {auth.user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden xl:inline">{auth.user.name?.split(' ')[0]}</span>
                  <ChevronDown className="h-3 w-3 transition-transform duration-300" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden xl:inline">Login</span>
                </Link>
              )}

              {showUserMenu && auth?.user && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl animate-slide-down">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="font-bold text-slate-900">{auth.user.name}</p>
                    <p className="text-xs text-slate-500">{auth.user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/account"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <User className="h-4 w-4" />
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                        <path
                          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                        <path
                          d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 pt-2">
                    <button
                      onClick={() => {
                        router.post('/logout');
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/wishlist"
              className="relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              aria-label="Wishlist"
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
              className="relative flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
              aria-label="Cart"
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
            {navigationLoading ? (
              <div className="px-4 py-2.5 text-sm font-semibold text-slate-500">
                Loading navigation...
              </div>
            ) : navigationItems.length === 0 ? (
              <div className="px-4 py-2.5 text-sm font-semibold text-slate-500">
                No navigation items
              </div>
            ) : (
              navigationItems.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => item.type === 'mega_menu' && handleMouseEnter()}
                  onMouseLeave={() => item.type === 'mega_menu' && handleMouseLeave()}
                >
                  {item.type === 'mega_menu' ? (
                    <button
                      onClick={() => handleClick()}
                      className={`relative flex items-center gap-1 px-4 py-2.5 text-sm font-semibold transition-colors ${
                        isActive(item.link)
                          ? 'text-rose-600'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="h-3 w-3" />
                      {isActive(item.link) && (
                        <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-rose-600" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.link}
                      target={item.target}
                      className={`relative flex items-center gap-1 px-4 py-2.5 text-sm font-semibold transition-colors ${
                        isActive(item.link)
                          ? 'text-rose-600'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                      {isActive(item.link) && (
                        <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-rose-600" />
                      )}
                    </Link>
                  )}

                  {/* Vertical List Mega Menu */}
                  {item.type === 'mega_menu' && showMegaMenu && (
                    <div
                      ref={megaMenuRef}
                      className="absolute left-0 top-full z-50 mt-0 w-64 rounded-b-2xl border-t border-slate-200 bg-white shadow-2xl"
                    >
                      {categoriesLoading ? (
                        <div className="p-4 text-center text-sm font-semibold text-slate-500">
                          Loading categories...
                        </div>
                      ) : categories.length === 0 ? (
                        <div className="p-4 text-center text-sm font-semibold text-slate-500">
                          No categories available
                        </div>
                      ) : (
                        <div className="py-2">
                          {categories.map((category) => (
                            <div key={category.id} className="group">
                              <Link
                                href={`/categories?category=${category.id}`}
                                className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-rose-600"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600">
                                    {category.icon_url ? (
                                      <img src={category.icon_url} alt={category.name} className="h-5 w-5" />
                                    ) : (
                                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                                        <path d="M4 7l8-4 8 4-8 4-8-4zm0 5l8 4 8-4M4 17l8 4 8-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    )}
                                  </span>
                                  <span>{category.name}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-rose-500" />
                              </Link>
                              {category.children && category.children.length > 0 && (
                                <div className="ml-11 border-l border-slate-100 pl-4">
                                  {category.children.slice(0, 5).map((sub) => (
                                    <Link
                                      key={sub.id}
                                      href={`/search?category_id=${category.id}&subcategory=${sub.id}`}
                                      className="block px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:text-rose-600"
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                  {category.children.length > 5 && (
                                    <Link
                                      href={`/categories?category=${category.id}`}
                                      className="block px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700"
                                    >
                                      View all {category.children.length} →
                                    </Link>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                        <Link
                          href="/categories"
                          className="block text-center text-sm font-bold text-rose-600 hover:text-rose-700"
                        >
                          View All Categories →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
