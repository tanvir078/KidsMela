import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useMemo, useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import SkeletonLoader from '@/Components/Storefront/SkeletonLoader';
import { getProducts } from '@/services/products';
import FlashSale from '@/Components/Storefront/FlashSale';
import TrendingProducts from '@/Components/Storefront/TrendingProducts';
import BundleDeals from '@/Components/Storefront/BundleDeals';
import RecentlyViewed from '@/Components/Storefront/RecentlyViewed';
import Newsletter from '@/Components/Storefront/Newsletter';


export default function HomePage({ banners = [] }) {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);

    const bannerList = banners.length > 0 ? banners : [
        {
            title: 'Mega Sale 🔥',
            subtitle: 'Up to 50% off on trending products',
            gradient: 'from-orange-500 via-rose-500 to-fuchsia-500',
            cta: 'Shop Now',
            link: '/search',
        },
        {
            title: 'New Arrivals ✨',
            subtitle: 'Discover the latest fashion & gadgets',
            gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
            cta: 'Explore',
            link: '/categories',
        },
        {
            title: 'Free Delivery 🚚',
            subtitle: 'On orders above ৳999',
            gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
            cta: 'Order Now',
            link: '/search',
        },
    ];

    const CATEGORIES = [
        { label: 'All', icon: '🏪', color: 'from-gray-500 to-gray-600' },
        { label: 'Flash', icon: '⚡', color: 'from-amber-400 to-orange-500' },
        { label: 'Fashion', icon: '👗', color: 'from-pink-400 to-rose-500' },
        { label: 'Electronics', icon: '📱', color: 'from-blue-400 to-indigo-500' },
        { label: 'Sports', icon: '⚽', color: 'from-green-400 to-emerald-500' },
        { label: 'Beauty', icon: '💄', color: 'from-fuchsia-400 to-pink-500' },
        { label: 'Home', icon: '🏠', color: 'from-amber-400 to-yellow-500' },
        { label: 'Books', icon: '📚', color: 'from-indigo-400 to-purple-500' },
    ];

    const loadProducts = async () => {
        setIsLoading(true);
        setError('');
        try {
            setProducts(await getProducts());
        } catch (exception) {
            setError(exception.message || 'Products could not be loaded.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerList.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [bannerList.length]);

    const categories = useMemo(() => {
        const names = products.map((product) => product.category).filter(Boolean);
        return ['All', ...Array.from(new Set(names))];
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = activeCategory === 'All' ? products : products.filter((product) => product.category === activeCategory);

        if (sortBy === 'price-low') {
            result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'price-high') {
            result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === 'rating') {
            result = [...result].sort((a, b) => Number(b.rating) - Number(a.rating));
        } else if (sortBy === 'name') {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [activeCategory, products, sortBy]);

    return (
        <MobileShell>
            <Head title="Home" />

            <div className="space-y-5 px-4 py-3">
                {/* Banner Carousel */}
                <div className="relative overflow-hidden rounded-2xl shadow-md" style={{ minHeight: '140px' }}>
                    {bannerList.map((banner, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                                index === currentBanner ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                            }`}
                        >
                            <div className={`flex h-full min-h-[140px] items-center bg-gradient-to-r ${banner.gradient} p-5`}>
                                <div className="relative z-10 flex-1">
                                    <h2 className="text-xl font-extrabold text-white leading-tight">{banner.title}</h2>
                                    <p className="mt-1 text-[13px] font-medium text-white/90">{banner.subtitle}</p>
                                    <Link
                                        href={banner.link || '/search'}
                                        className="mt-3 inline-flex h-8 items-center rounded-full bg-white px-4 text-xs font-bold text-gray-800 shadow-sm transition-all active:scale-95"
                                    >
                                        {banner.cta || 'Shop Now'}
                                    </Link>
                                </div>
                                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
                                <div className="absolute -bottom-4 -right-2 h-20 w-20 rounded-full bg-white/10" />
                            </div>
                        </div>
                    ))}
                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                        {bannerList.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentBanner(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    index === currentBanner ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Category Icons - horizontal scroll */}
                <div className="lg:hidden">
                    <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.label}
                                type="button"
                                onClick={() => setActiveCategory(cat.label === 'Flash' ? 'All' : cat.label)}
                                className="flex shrink-0 flex-col items-center gap-1.5"
                            >
                                <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${cat.color} text-lg shadow-sm transition-transform active:scale-90 ${
                                    (cat.label === activeCategory || (cat.label === 'Flash' && activeCategory === 'All')) ? 'ring-2 ring-orange-400 ring-offset-2' : ''
                                }`}>
                                    {cat.icon}
                                </div>
                                <span className="text-[10px] font-semibold text-gray-600">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop category chips */}
                <div className="hidden lg:block">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition-all active:scale-95 ${
                                    activeCategory === category
                                        ? 'bg-orange-500 text-white shadow-sm'
                                        : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Flash Sale Section */}
                <FlashSale products={products} />

                {/* Trending Products */}
                <TrendingProducts products={products} />

                {/* All Products Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                {activeCategory === 'All' ? 'All Products' : activeCategory}
                            </h2>
                            <p className="text-xs text-gray-400">
                                {filteredProducts.length} items
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all active:scale-95 ${
                                    showFilters ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none"><path d="M3 4h18M3 12h12M3 20h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                                Filter
                            </button>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="h-8 rounded-lg border-gray-200 bg-gray-100 px-2 text-[11px] font-semibold text-gray-600 focus:border-orange-400 focus:ring-orange-400"
                            >
                                <option value="default">Sort</option>
                                <option value="price-low">Price: Low→High</option>
                                <option value="price-high">Price: High→Low</option>
                                <option value="rating">Top Rated</option>
                                <option value="name">Name A-Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter panel */}
                    {showFilters && (
                        <div className="animate-slide-down rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs font-bold text-gray-700">Filter by category</p>
                                <button
                                    type="button"
                                    onClick={() => { setActiveCategory('All'); setShowFilters(false); }}
                                    className="text-[11px] font-semibold text-orange-500"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => { setActiveCategory(category); setShowFilters(false); }}
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                                            activeCategory === category
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Loading */}
                    {isLoading && <SkeletonLoader type="card" count={4} />}

                    {/* Error */}
                    {error && (
                        <div className="rounded-xl bg-red-50 p-5 text-center ring-1 ring-red-100">
                            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-red-100">
                                <svg viewBox="0 0 24 24" className="h-6 w-6 text-red-400" fill="none"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <p className="text-sm font-semibold text-red-600">{error}</p>
                            <button
                                type="button"
                                onClick={loadProducts}
                                className="mt-3 rounded-full bg-red-500 px-5 py-2 text-xs font-bold text-white transition-all active:scale-95"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && !error && filteredProducts.length === 0 && (
                        <div className="rounded-xl bg-gray-50 p-8 text-center">
                            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gray-100">
                                <svg viewBox="0 0 24 24" className="h-8 w-8 text-gray-300" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            </div>
                            <p className="mt-3 text-sm font-bold text-gray-700">No products found</p>
                            <p className="mt-1 text-xs text-gray-400">Try a different category</p>
                            <button
                                type="button"
                                onClick={() => setActiveCategory('All')}
                                className="mt-3 rounded-full bg-orange-500 px-5 py-2 text-xs font-bold text-white transition-all active:scale-95"
                            >
                                View All
                            </button>
                        </div>
                    )}

                    {/* Product Grid */}
                    {!isLoading && !error && filteredProducts.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Bundle Deals */}
                <BundleDeals products={products} />

                {/* Recently Viewed */}
                <RecentlyViewed />

                {/* Newsletter */}
                <Newsletter />
            </div>
        </MobileShell>
    );
}
