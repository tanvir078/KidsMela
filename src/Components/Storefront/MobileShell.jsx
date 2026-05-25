import { Link, router, usePage } from '@/lib/inertiaCompat';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useTheme } from '@/Contexts/ThemeContext';
import { useCurrency } from '@/Contexts/CurrencyContext';
import { useSearchHistory } from '@/Contexts/SearchHistoryContext';
import Toast from './Toast';
import LiveChat from './LiveChat';
import DesktopHeader from './DesktopHeader';
import Footer from './Footer';
import { getProducts } from '@/services/products';

const navItems = [
    { label: 'Home', href: '/', match: /^\/$/, icon: 'home' },
    { label: 'Categories', href: '/categories', match: /^\/categories/, icon: 'grid' },
    { label: 'Deals', href: '/search', match: /^\/deals/, icon: 'tag' },
    { label: 'Cart', href: '/cart', match: /^\/cart|^\/checkout/, icon: 'cart' },
    { label: 'Account', href: '/account', match: /^\/account/, icon: 'user' },
];

function BottomNavIcon({ icon, active }) {
    const paths = {
        home: active
            ? 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4'
            : 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
        grid: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
        tag: 'M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z',
        cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
        user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    };

    return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" aria-hidden="true">
            <path
                d={paths[icon]}
                stroke="currentColor"
                strokeWidth={active ? '2.2' : '1.8'}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function MobileShell({ children, title = 'Progotix', showSearch = true }) {
    const { itemCount } = useCart();
    const { count: wishlistCount } = useWishlist();
    const { theme, toggleTheme } = useTheme();
    const { currency, setCurrency, availableCurrencies, currencySymbols } = useCurrency();
    const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
    const { url } = usePage();
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef(null);

    const currentQuery = useMemo(() => {
        if (typeof window === 'undefined') {
            return '';
        }
        return new URLSearchParams(window.location.search).get('q') ?? '';
    }, [url]);
    const [query, setQuery] = useState(currentQuery);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        getProducts().then(setAllProducts).catch(() => {});
    }, []);

    useEffect(() => {
        if (query.length >= 2) {
            const filtered = allProducts
                .filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.category?.toLowerCase().includes(query.toLowerCase())
                )
                .slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [query, allProducts]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
                setSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const submitSearch = (event) => {
        event.preventDefault();
        const trimmedQuery = query.trim();

        if (trimmedQuery) {
            addToHistory(trimmedQuery);
        }

        setShowSuggestions(false);
        setSearchFocused(false);
        router.get('/search', trimmedQuery ? { q: trimmedQuery } : {}, {
            preserveState: false,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
            {/* Desktop Header — visible on lg+ */}
            <DesktopHeader />

            {/* Mobile shell container */}
            <div className="mx-auto min-h-screen max-w-md bg-white dark:bg-slate-800 lg:max-w-none lg:shadow-none">
                {/* Mobile header — hidden on lg+ */}
                <header className="sticky top-0 z-40 bg-white shadow-sm lg:hidden">
                    {/* Top bar: logo + actions */}
                    <div className="flex items-center justify-between px-4 py-2.5">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-sm">
                                <img
                                    className="h-6 w-6"
                                    alt="Logo"
                                    src={import.meta.env.VITE_APP_LOGO ? import.meta.env.VITE_APP_LOGO : "/favicon.svg"}
                                />
                            </div>
                            <span className="text-lg font-extrabold text-slate-900 tracking-tight">Progotix</span>
                        </Link>

                        <div className="flex items-center gap-1">
                            <Link
                                href="/wishlist"
                                className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 transition-colors active:bg-gray-100"
                            >
                                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" aria-hidden="true">
                                    <path d="M12 21s-7-4.4-9.2-8.5C.7 8.6 3.1 4 7.4 4c2 0 3.5 1 4.6 2.4C13.1 5 14.6 4 16.6 4c4.3 0 6.7 4.6 4.6 8.5C19 16.6 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {wishlistCount > 0 && (
                                    <span className="absolute right-1 top-1 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                            <Link
                                href="/cart"
                                className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 transition-colors active:bg-gray-100"
                            >
                                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" aria-hidden="true">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {itemCount > 0 && (
                                    <span className="absolute right-1 top-1 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition-colors active:bg-gray-100"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="none"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="none"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Search bar */}
                    {showSearch && (
                        <div className="relative px-4 pb-3" ref={searchRef}>
                            <form onSubmit={submitSearch} className="relative">
                                <div className={`flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2.5 transition-all duration-200 ${searchFocused ? 'border-orange-400 ring-2 ring-orange-100' : 'border-gray-200'}`}>
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gray-400" fill="none" aria-hidden="true">
                                        <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <input
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        onFocus={() => {
                                            setSearchFocused(true);
                                            if (query.length >= 2 || history.length > 0) setShowSuggestions(true);
                                        }}
                                        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                                        placeholder="Search products..."
                                    />
                                    {query.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => { setQuery(''); setSuggestions([]); }}
                                            className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gray-300 text-white"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Search suggestions dropdown */}
                            {showSuggestions && (suggestions.length > 0 || history.length > 0) && (
                                <div className="absolute left-4 right-4 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                                    {history.length > 0 && (
                                        <div className="border-b border-gray-100 px-4 py-3">
                                            <div className="mb-2 flex items-center justify-between">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Recent</p>
                                                <button
                                                    type="button"
                                                    onClick={clearHistory}
                                                    className="text-xs font-semibold text-orange-500"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {history.map((item, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => {
                                                            setQuery(item);
                                                            setShowSuggestions(false);
                                                            router.get('/search', { q: item }, { preserveState: false });
                                                        }}
                                                        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors active:bg-gray-100"
                                                    >
                                                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gray-400" fill="none"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {suggestions.length > 0 && (
                                        <div className="py-1">
                                            {suggestions.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    onClick={() => {
                                                        setQuery('');
                                                        setShowSuggestions(false);
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-2.5 transition-colors active:bg-gray-50"
                                                >
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="grid h-full place-items-center text-[10px] text-gray-400">No img</div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-slate-800">{product.name}</p>
                                                        <p className="text-xs text-gray-400">{product.category || 'Product'}</p>
                                                    </div>
                                                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gray-300" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </header>

                {/* Desktop content wrapper */}
                <div className="lg:mx-auto lg:max-w-7xl lg:px-6">
                    <main className="pb-20 lg:pb-8 lg:py-6">{children}</main>
                </div>

                {/* Mobile bottom nav — hidden on lg+ */}
                <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-[env(safe-area-inset-bottom)] lg:hidden">
                    <div className="grid grid-cols-5">
                        {navItems.map((item) => {
                            const active = item.match.test(url);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
                                        active ? 'text-orange-500' : 'text-gray-400'
                                    }`}
                                >
                                    <BottomNavIcon icon={item.icon} active={active} />
                                    <span>{item.label}</span>
                                    {item.label === 'Cart' && itemCount > 0 && (
                                        <span className="absolute left-1/2 top-1 ml-2 grid min-h-[16px] min-w-[16px] place-items-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                                            {itemCount}
                                        </span>
                                    )}
                                    {active && (
                                        <span className="absolute bottom-0 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-orange-500" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
                <Toast />
                <LiveChat />
            </div>

            {/* Desktop Footer — visible on lg+ */}
            <Footer />
        </div>
    );
}
