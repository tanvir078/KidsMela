import { Link, router, usePage } from '@/lib/inertiaCompat';
import { useMemo, useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useCart } from '@/Contexts/CartContext';
import { useSearchHistory } from '@/Contexts/SearchHistoryContext';
import Toast from './Toast';
import LiveChat from './LiveChat';
import DesktopHeader from './DesktopHeader';
import Footer from './Footer';
import { getProducts } from '@/services/products';
import 'swiper/css';
import 'swiper/css/pagination';

const navItems = [
    { label: 'Home', href: '/', match: /^\/$/, icon: 'home' },
    { label: 'Campaigns', href: '/campaigns', match: /^\/campaigns/, icon: 'campaigns' },
    { label: 'Categories', href: '/categories', match: /^\/categories/, icon: 'grid' },
    { label: 'Cart', href: '/cart', match: /^\/cart|^\/checkout/, icon: 'cart' },
    { label: 'Account', href: '/account', match: /^\/account/, icon: 'user' },
];

const fallbackBanners = [
    '/banners/kids-mela-hero.svg',
    '/banners/kids-mela-women-collection.svg',
    '/banners/kids-mela-shoes-bags.svg',
];

const topCategoryTabs = ['All', 'Men', 'Women', 'Kids', 'Shoes', 'Bags', 'Accessories', 'New Arrivals'];

function normalizeBanner(banner, index) {
    if (typeof banner === 'string') {
        return { id: banner, image: banner, href: '/search', alt: `Banner ${index + 1}` };
    }

    const image = banner?.image_url || banner?.image || banner?.url || banner?.src || banner?.banner_url;
    if (!image) return null;

    return {
        id: banner.id || image,
        image,
        href: banner.link || banner.href || banner.target_url || '/search',
        alt: banner.title || banner.alt || `Banner ${index + 1}`,
    };
}

function BottomNavIcon({ icon, active }) {
    const paths = {
        home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
        grid: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
        tag: 'M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z',
        cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
        user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        campaigns: 'M13 3 4 14h7l-1 7 10-12h-7l0-6z'
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

export default function MobileShell({
    children,
    title = 'Kids Mela',
    showSearch = true,
    banners = [],
    contentOverBanner = false,
    showPromoBanner = true,
    hideTopBar = false,
}) {
    const { itemCount } = useCart();
    const { history, addToHistory, clearHistory } = useSearchHistory();
    const { url } = usePage();

    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef(null);
    const headerBannerRef = useRef(null);

    const currentQuery = useMemo(() => {
        if (typeof window === 'undefined') return '';
        return new URLSearchParams(window.location.search).get('q') ?? '';
    }, [url]);

    const [query, setQuery] = useState(currentQuery);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    const promoBanners = useMemo(() => {
        const source = Array.isArray(banners) && banners.length > 0 ? banners : fallbackBanners;
        const normalized = source.map(normalizeBanner).filter(Boolean);
        return normalized.length > 0 ? normalized : fallbackBanners.map(normalizeBanner);
    }, [banners]);


     {!hideTopBar && (
    <header className={`...`}>
        ...
     </header>
 )}

    useEffect(() => {
        getProducts()
            .then(setAllProducts)
            .catch((error) => {
                console.error('Failed to load products in mobile shell:', error);
                // Optional: Set empty state or show user-friendly error message
            });
    }, []);

    useEffect(() => {
        if (query.length >= 2) {
            const filtered = allProducts
                .filter((p) =>
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

    const syncHeaderBanner = (swiper) => {
        const realIndex = swiper.realIndex || 0;

        if (headerBannerRef.current) {
            if (promoBanners.length > 1) {
                headerBannerRef.current.slideToLoop(realIndex, 500);
            } else {
                headerBannerRef.current.slideTo(realIndex, 500);
            }
        }
    };

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
            <DesktopHeader />

            <div className="relative mx-auto min-h-screen max-w-md bg-white lg:max-w-none lg:bg-transparent lg:shadow-none">
                {showPromoBanner && contentOverBanner && (
                    <div className="fixed inset-x-0 top-0 z-10 mx-auto h-[260px] max-w-md overflow-hidden lg:hidden">
                        <Swiper
                            modules={[Autoplay]}
                            autoplay={{ delay: 3200, disableOnInteraction: false }}
                            loop={promoBanners.length > 1}
                            speed={500}
                            onSlideChange={syncHeaderBanner}
                            onAfterInit={syncHeaderBanner}
                            className="h-full w-full"
                        >
                            {promoBanners.map((banner, index) => (
                                <SwiperSlide key={`${banner.id}-${index}`}>
                                    <Link href={banner.href} className="block h-full">
                                        <img
                                            src={banner.image}
                                            alt={banner.alt}
                                            className="h-full w-full object-cover"
                                        />
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-transparent" />
                    </div>
                )}

                <header
                    className={`${
                        contentOverBanner
                            ? 'fixed inset-x-0 top-0 mx-auto max-w-md overflow-hidden bg-transparent'
                            : 'sticky top-0 bg-[#e8fbff] shadow-sm'
                    } z-50 lg:hidden`}
                >
                    {showPromoBanner && contentOverBanner && (
                        <div className="pointer-events-none absolute left-0 top-0 z-0 h-[260px] w-full overflow-hidden">
                            <Swiper
                                modules={[]}
                                onSwiper={(swiper) => {
                                    headerBannerRef.current = swiper;
                                }}
                                allowTouchMove={false}
                                loop={promoBanners.length > 1}
                                speed={500}
                                className="h-full w-full"
                            >
                                {promoBanners.map((banner, index) => (
                                    <SwiperSlide key={`header-crop-${banner.id}-${index}`}>
                                        <img
                                            src={banner.image}
                                            alt={banner.alt}
                                            className="h-full w-full object-cover"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-transparent" />
                        </div>
                    )}

                    <div className="relative z-50 flex min-h-[58px] items-center gap-2 px-3 pb-2 pt-[max(env(safe-area-inset-top),2px)]">
                        {showSearch && (
                            <div className="relative z-50 min-w-0 flex-1" ref={searchRef}>
                                <form onSubmit={submitSearch} className="relative">
                                    <div className={`flex h-10 items-center gap-2 rounded bg-white pl-3 shadow-sm ring-1 transition-all duration-200 ${searchFocused ? 'ring-cyan-400' : 'ring-white/50'}`}>
                                        <input
                                            value={query}
                                            onChange={(event) => setQuery(event.target.value)}
                                            onFocus={() => {
                                                setSearchFocused(true);
                                                if (query.length >= 2 || history.length > 0) setShowSuggestions(true);
                                            }}
                                            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                                            placeholder="Search fashion..."
                                        />

                                        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 text-slate-500" fill="none">
                                            <path d="M12 3v9m0 0a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v3a3 3 0 0 0 3 3Zm0 0v4m-5-4a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        </svg>

                                        {query.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setQuery('');
                                                    setSuggestions([]);
                                                }}
                                                className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-500"
                                            >
                                                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
                                                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        )}

                                        <button
                                            type="submit"
                                            className="grid h-10 w-10 shrink-0 place-items-center rounded-r bg-[#0c4964] text-white"
                                            aria-label="Search"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                                                <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </form>

                                {showSuggestions && (suggestions.length > 0 || history.length > 0) && (
                                    <div className="absolute left-0 right-0 top-full z-[70] mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                                        {history.length > 0 && (
                                            <div className="border-b border-gray-100 px-4 py-3">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Recent</p>
                                                    <button type="button" onClick={clearHistory} className="text-xs font-semibold text-orange-500">
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
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {!showSearch && (
                            <div className="min-w-0 flex-1">
                                <h1 className="truncate text-base font-black text-slate-800">{title}</h1>
                            </div>
                        )}

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => {
                                  window.open('https://lens.google.com/', '_blank', 'noopener,noreferrer');
                                }}
                                className="grid h-9 w-9 shrink-0 place-items-center rounded bg-white/90 text-slate-500 shadow-sm ring-1 ring-white/60 active:bg-white"
                                aria-label="Search with Google Lens"
                            >
                                <img
                                    src="/google-lens.svg"
                                    alt="Google Lens"
                                    className="h-6 w-6 object-contain"
                                />
                            </button>
                        </div>
                    </div>

                    {showPromoBanner && !contentOverBanner && (
                        <div className="px-3 pb-4">
                            <Swiper
                                modules={[Autoplay, Pagination]}
                                autoplay={{ delay: 3200, disableOnInteraction: false }}
                                pagination={{ clickable: true }}
                                loop={promoBanners.length > 1}
                                className="overflow-hidden  rounded-md shadow-sm"
                            >
                                {promoBanners.map((banner, index) => (
                                    <SwiperSlide key={`${banner.id}-${index}`}>
                                        <Link href={banner.href} className="block">
                                            <img
                                                src={banner.image}
                                                alt={banner.alt}
                                                className="h-[165px] w-full object-cover"
                                            />
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}

                    {showPromoBanner && contentOverBanner && (
                        <div className="relative z-50 overflow-hidden px-4">
                            <div className="flex gap-5 overflow-x-auto whitespace-nowrap pb-1 text-[12px] font-black text-white drop-shadow scrollbar-hide">
                                {topCategoryTabs.map((tab) => (
                                    <Link
                                        key={tab}
                                        href={tab === 'All' ? '/' : `/search?category=${encodeURIComponent(tab)}`}
                                        className={`shrink-0 border-b-2 pb-1 ${tab === 'All' ? 'border-white' : 'border-transparent'}`}
                                    >
                                        {tab}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </header>

              <div className={`relative z-30 lg:mx-auto lg:max-w-7xl lg:px-6 ${contentOverBanner && !hideTopBar ? 'pt-[260px] lg:pt-0' : ''}`}>

                    <main className={`pb-20 lg:pb-8 lg:py-6 ${contentOverBanner ? 'relative z-30 bg-white lg:bg-transparent' : ''}`}>
                        {children}
                    </main>
                </div>

                <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-rose-100 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-lg lg:hidden">
                    <div className="grid h-[68px] grid-cols-5">
                        {navItems.map((item) => {
                            const active = item.match.test(url);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 transition-colors ${
                                        active ? 'text-rose-600' : 'text-slate-400'
                                    }`}
                                >
                                    <BottomNavIcon icon={item.icon} active={active} />
                                    <span className="max-w-full truncate text-[11px] font-bold leading-none">{item.label}</span>

                                    {item.label === 'Cart' && itemCount > 0 && (
                                        <span className="absolute left-1/2 top-2 ml-2 grid min-h-[16px] min-w-[16px] place-items-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white">
                                            {itemCount}
                                        </span>
                                    )}

                                    {active && (
                                        <span className="absolute bottom-1 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-rose-600" />
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
