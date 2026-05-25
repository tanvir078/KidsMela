import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useMemo, useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import SkeletonLoader from '@/Components/Storefront/SkeletonLoader';
import { getProducts } from '@/services/products';
import Newsletter from '@/Components/Storefront/Newsletter';
import Testimonials from '@/Components/Storefront/Testimonials';
import FAQ from '@/Components/Storefront/FAQ';
import BundleDeals from '@/Components/Storefront/BundleDeals';
import RecentlyViewed from '@/Components/Storefront/RecentlyViewed';


export default function HomePage({ banners = [] }) {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [minRating, setMinRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);

    const bannerList = banners.length > 0 ? banners : [
        {
            title: 'eid offer 20% off',
            description: 'Hot picks from electronics, sports, home and accessories.',
            discount: '45%',
            gradient: 'from-orange-500 via-rose-500 to-fuchsia-600',
            bg_color: 'bg-blue-400',
        },
        {
            title: 'Summer Sale',
            description: 'Get the best deals on summer fashion and accessories.',
            discount: '30%',
            gradient: 'from-cyan-500 via-blue-500 to-purple-600',
            bg_color: 'bg-green-400',
        },
        {
            title: 'Flash Sale',
            description: 'Limited time offers on electronics and gadgets.',
            discount: '50%',
            gradient: 'from-pink-500 via-red-500 to-yellow-500',
            bg_color: 'bg-orange-400',
        },
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
        }, 5000);
        return () => clearInterval(interval);
    }, [bannerList.length]);

  

    const categories = useMemo(() => {
        const names = products.map((product) => product.category).filter(Boolean);
        return ['All', ...Array.from(new Set(names))];
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = activeCategory === 'All' ? products : products.filter((product) => product.category === activeCategory);

        result = result.filter((product) => {
            const price = Number(product.price);
            const rating = Number(product.rating ?? 0);
            const stock = Number(product.stock ?? 0);

            if (price < priceRange.min || price > priceRange.max) return false;
            if (rating < minRating) return false;
            if (inStockOnly && stock <= 0) return false;

            return true;
        });

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
    }, [activeCategory, products, sortBy, priceRange, minRating, inStockOnly]);

    return (
        <MobileShell>
            <Head title="Home" />

            <section className="space-y-4 px-4 py-4 ">
                <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-orange-200 min-h-[150px]">
                    {bannerList.map((banner, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-500 ${
                                index === currentBanner ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <div className={`relative overflow-hidden items-center rounded-3xl bg-gradient-to-br ${banner.gradient} p-5 text-white h-full`}>
                                <div className="absolute -right-8 -top-5 h-24 w-24 rounded-full bg-white/10" />
                                <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                                <div className="relative">
                                    <div className="flex gap-4">
                                        <div className="flex-1 items-start justify-between flex-col gap-3">
                                            <h2 className="mt-1 text-[20px] uppercase font-black leading-tight text-[#19ced9] fontweight-bold tracking-tight">
                                                {banner.title}
                                            </h2>
                                            <p className="mt-1 text-[12px] font-semibold text-white/90">
                                                {banner.description}
                                            </p>
                                            <Link
                                                href={banner.link || '/search'}
                                                className="mt-3 flex h-[30px] w-fit items-center justify-center rounded-full bg-white px-5 py-2.5 text-green-600 text-sm font-black shadow-lg transition-all duration-200 hover:bg-orange-50 active:scale-95"
                                            >
                                                Shop Now
                                            </Link>
                                        </div>
                                        <div className={`flex flex-col items-center justify-center rounded-2xl ${banner.bg_color} px-4 py-3 text-center text-white shadow-lg`}>
                                            <p className="text-[12px] text-black font-black uppercase tracking-wider">Up to</p>
                                            <p className="text-[28px] font-bold bg-black rounded-full bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">{banner.discount}</p>
                                            <p className="text-[12px] text-black font-black uppercase tracking-wider">OFF</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {bannerList.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentBanner(index)}
                                className={`h-2 w-2 rounded-full transition-all ${
                                    index === currentBanner ? 'w-6 bg-white' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </div>















                

                <div className="grid grid-cols-4 gap-3 lg:grid-cols-8">
                    {[
                        { label: 'Flash', icon: '⚡', href: '/search', color: 'from-amber-400 to-orange-500' },
                        { label: 'Fashion', icon: '👗', href: '/search?q=Fashion', color: 'from-pink-400 to-rose-500' },
                        { label: 'Gadgets', icon: '📱', href: '/search?q=Gadgets', color: 'from-blue-400 to-indigo-500' },
                        { label: 'Sports', icon: '⚽', href: '/search?q=Sports', color: 'from-green-400 to-emerald-500' },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="group relative overflow-hidden rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md hover:ring-slate-300 active:scale-95"
                        >
                            <div className={`mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${item.color} text-lg shadow-sm`}>
                                {item.icon}
                            </div>
                            <span className="text-xs font-black text-slate-700 group-hover:text-slate-900">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-black text-white shadow-md">
                    <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
                    <div className="headline-container">
                        <h1 className="slide-headline">এটি একটি স্লাইডিং হেডলাইন</h1>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-black text-slate-950">Categories</h2>
                            <p className="text-xs font-semibold text-slate-500">Browse by category</p>
                        </div>
                        <Link href="/categories" className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600 transition-all duration-200 hover:bg-orange-100 active:scale-95">
                            View all
                        </Link>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-black transition-all duration-200 active:scale-95 ${
                                    activeCategory === category
                                        ? 'bg-slate-950 text-white shadow-lg shadow-slate-300 hover:bg-slate-800'
                                        : 'bg-white text-slate-600 ring-1 ring-slate-200 shadow-sm hover:bg-slate-50 hover:ring-slate-300'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-black text-slate-950">Popular products</h2>
                            <p className="text-xs font-semibold text-slate-500">
                                {activeCategory === 'All' ? 'Real products from your Laravel API' : `Showing ${activeCategory} products`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-2.5 py-1 text-xs font-black text-orange-700 ring-1 ring-orange-200">
                                {filteredProducts.length} items
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`h-8 rounded-full px-3 text-xs font-black transition-all duration-200 active:scale-95 ${
                                    showFilters ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
                                }`}
                            >
                                Filters
                            </button>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="h-8 rounded-full border-slate-200 px-3 text-xs font-semibold focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="default">Sort by</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Rating</option>
                                <option value="name">Name</option>
                            </select>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Price Range</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                            className="h-10 w-24 rounded-xl border-slate-200 px-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Min"
                                        />
                                        <span className="text-slate-400">-</span>
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                            className="h-10 w-24 rounded-xl border-slate-200 px-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Minimum Rating</label>
                                    <div className="flex gap-2">
                                        {[0, 1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                type="button"
                                                onClick={() => setMinRating(rating)}
                                                className={`h-10 w-10 rounded-xl text-sm font-black transition-all duration-200 active:scale-95 ${
                                                    minRating === rating
                                                        ? 'bg-orange-600 text-white'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                            >
                                                {rating}+
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="inStock"
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="h-5 w-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <label htmlFor="inStock" className="text-sm font-semibold text-slate-700">
                                        In stock only
                                    </label>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setPriceRange({ min: 0, max: 1000 });
                                        setMinRating(0);
                                        setInStockOnly(false);
                                    }}
                                    className="w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {isLoading && <SkeletonLoader type="card" count={4} />}

                    {error && (
                        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 p-5 text-center shadow-sm ring-1 ring-red-200">
                            <p className="text-sm font-bold text-red-600">{error}</p>
                            <button
                                type="button"
                                onClick={loadProducts}
                                className="mt-4 rounded-full bg-slate-950 px-5 py-2 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && filteredProducts.length === 0 && (
                        <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-200">
                                <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-400" fill="none" aria-hidden="true">
                                    <path d="M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h2 className="mt-5 text-xl font-black text-slate-950">No products found</h2>
                            <p className="mt-2 text-sm font-semibold text-slate-500">
                                No products found in this category.
                            </p>
                            <button
                                type="button"
                                onClick={() => setActiveCategory('All')}
                                className="mt-4 rounded-full bg-slate-950 px-5 py-2 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95"
                            >
                                View All Products
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && filteredProducts.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>

                <BundleDeals products={products} />
                <RecentlyViewed />
                <Testimonials />
                <FAQ />
                <Newsletter />
            </section>
        </MobileShell>
    );
}
