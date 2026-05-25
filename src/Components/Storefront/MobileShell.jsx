import { Link, router, usePage } from '@/lib/inertiaCompat';
import { useMemo, useState, useEffect } from 'react';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useTheme } from '@/Contexts/ThemeContext';
import { useCurrency } from '@/Contexts/CurrencyContext';
import { useSearchHistory } from '@/Contexts/SearchHistoryContext';
import Toast from './Toast';
import LiveChat from './LiveChat';
import { getProducts } from '@/services/products';

const navItems = [
    { label: 'Home', href: '/', match: /^\/$/ },
    { label: 'Categories', href: '/categories', match: /^\/categories/ },
    { label: 'Wishlist', href: '/wishlist', match: /^\/wishlist/ },
    { label: 'Cart', href: '/cart', match: /^\/cart|^\/checkout/ },
    { label: 'Profile', href: '/account', match: /^\/account/ },
];

function NavIcon({ label }) {
    const icons = {
        Home: 'M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z',
        Categories: 'M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z',
        Wishlist: 'M12 21s-7-4.4-9.2-8.5C.7 8.6 3.1 4 7.4 4c2 0 3.5 1 4.6 2.4C13.1 5 14.6 4 16.6 4c4.3 0 6.7 4.6 4.6 8.5C19 16.6 12 21 12 21Z',
        Cart: 'M4 5h2l1.4 9.2a2 2 0 0 0 2 1.8h6.8a2 2 0 0 0 1.9-1.4L20 8H7',
        Profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
    };

    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path
                d={icons[label]}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={['Home', 'Categories', 'Wishlist'].includes(label) ? 'currentColor' : 'none'}
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
    const [location, setLocation] = useState(null);

    useEffect(() => {
        setLocation({
            location: 'Bangladesh',
            city: 'Dhaka',
            region: 'Dhaka',
            country: 'Bangladesh',
        });
    }, []);

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
        getProducts().then(setAllProducts);
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

    const submitSearch = (event) => {
        event.preventDefault();
        const trimmedQuery = query.trim();

        if (trimmedQuery) {
            addToHistory(trimmedQuery);
        }

        router.get('/search', trimmedQuery ? { q: trimmedQuery } : {}, {
            preserveState: false,
            
        });
        const location = navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
        });
        
    };

    return (
        <div className="min-h-screen bg-slate-200 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
            <div className="mx-auto min-h-screen max-w-md bg-slate-50 shadow-2xl shadow-slate-300/60 dark:bg-slate-800 dark:shadow-slate-900/60">
                <header className="relative top-0 z-30 h-fit bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-3 px-4 text-white shadow-2xl shadow-slate-900/20">
                    <div className="flex items-center justify-between gap-3">
                        <Link href="/" className="min-w-0 flex items-center gap-2">
                            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl">
                               <img
                                    className="h-8 w-8"
                                    alt="Logo"
                                    src={import.meta.env.VITE_APP_LOGO ? import.meta.env.VITE_APP_LOGO : "/favicon.svg"}
                               />
                            </div>
                            <div className="min-w-0">
                                <h1 className="truncate text-lg font-black leading-tight">Progotix</h1>
                            </div>
                        </Link>
                         

                       <div className=" flex items-center justify-end gap-2">
                        <div className="flex items-center">
                            <Link
                                href="/cart"
                                className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:shadow-orange-500/50 active:scale-95"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {itemCount > 0 && (
                                    <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-black text-orange-600 shadow-lg">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <Link
                                href="/support"
                                className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50 active:scale-95"
                                >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                </Link>
                                </div>
                                </div>
                            
                    </div>

                    <div className="mt-1 px-2 py-1">
                        <span className="text-xs text-white/80">
                            {location
                                ? `${location.city}, ${location.country}`
                                : 'Detecting location...'}
                        </span>
                    </div>
                   
                </header>



                {showSearch && (
                    <div className="sticky top-0 z-20 w-full">
                            <form onSubmit={submitSearch} className="flex items-center h-[50px] gap-2 rounded-2xl bg-gray-100 px-3 py-2 text-slate-500 shadow-inner">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                                    <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-0"
                                    placeholder="Search products, brands, categories"
                                />
                                <button type="submit" className="rounded-full bg-orange-600 px-3 py-1 text-[10px] font-black text-white">
                                    {typeof query === 'string' && query.trim().length > 0 ? 'Search' : 'Go'}
                                </button>
                               
                            </form>
                          
                            {showSuggestions && (suggestions.length > 0 || history.length > 0) && (
                                <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl bg-white shadow-xl shadow-slate-300 ring-1 ring-slate-200">
                                    {history.length > 0 && (
                                        <div className="border-b border-slate-100 px-4 py-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-black text-slate-500 uppercase">Recent searches</p>
                                                <button
                                                    type="button"
                                                    onClick={clearHistory}
                                                    className="text-xs font-black text-red-600 hover:text-red-700"
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
                                                            submitSearch({ preventDefault: () => {} });
                                                        }}
                                                        className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95"
                                                    >
                                                        <span>🕐</span>
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {suggestions.length > 0 && (
                                        <div className="px-4 py-2">
                                            <p className="text-xs font-black text-slate-500 uppercase mb-2">Products</p>
                                            {suggestions.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    onClick={() => {
                                                        setQuery('');
                                                        setShowSuggestions(false);
                                                    }}
                                                    className="flex items-center gap-3 px-2 py-2 transition-colors hover:bg-slate-50 rounded-xl"
                                                >
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="grid h-full place-items-center text-xs font-bold text-slate-400">No img</div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-black text-slate-950">{product.name}</p>
                                                        <p className="text-xs font-bold text-slate-500">{product.category || 'Featured'}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                    )}
                      

                   
                

                <main className="pb-24">{children}</main>

                <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-slate-200 bg-white/95 px-2 pb-3 pt-2 shadow-[0_-12px_30px_rgba(15,23,42,0.12)] backdrop-blur">
                    <div className="grid grid-cols-5 gap-1">
                        {navItems.map((item) => {
                            const active = item.match.test(url);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative flex h-10 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-bold ${
                                        active ? 'bg-orange-50 text-orange-600' : 'text-slate-500'
                                    }`}
                                >
                                    <NavIcon label={item.label} />
                                    <span>{item.label}</span>
                                    {item.label === 'Cart' && itemCount > 0 && (
                                        <span className="absolute right-3 top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-orange-600 px-1 text-[9px] text-white">
                                            {itemCount}
                                        </span>
                                    )}
                                    {item.label === 'Wishlist' && wishlistCount > 0 && (
                                        <span className="absolute right-2 top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[9px] text-white">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
                <Toast />
                <LiveChat />
            </div>
        </div>
    );
}
