import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useMemo, useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import ProductBundleCard from '@/Components/Storefront/ProductBundleCard';
import SkeletonLoader from '@/Components/Storefront/SkeletonLoader';
import { getProducts } from '@/services/products';
import FlashSale from '@/Components/Storefront/FlashSale';
import TrendingProducts from '@/Components/Storefront/TrendingProducts';
import BundleDeals from '@/Components/Storefront/BundleDeals';
import RecentlyViewed from '@/Components/Storefront/RecentlyViewed';
import Newsletter from '@/Components/Storefront/Newsletter';
import { apiRequest } from '@/lib/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


export default function HomePage({ banners: propBanners = [] }) {
    const [banners, setBanners] = useState(propBanners);
    const [offercategories, setOfferCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [bundles, setBundles] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('default');

    const loadBanners = async () => {
        try {
            const data = await storefrontApi.banners();
            const activeBanners = data.banners?.filter(b => b.active && (b.device_type === 'both' || b.device_type === 'desktop')) || [];
            setBanners(activeBanners);
        } catch (error) {
            console.error('Failed to load banners:', error);
            // Use fallback banners if API fails
            setBanners(propBanners);
        }
    };

    const trustFeatures = [
        { label: 'Best Price', badge: 'BEST' },
        { label: 'Fast Delivery', badge: 'FAST' },
        { label: 'Premium Fabric', badge: 'FAB' },
        { label: 'Easy Exchange', badge: 'EX' },
        { label: 'Latest Drops', badge: 'NEW' },
    ];

    const fashionCollections = [
        { label: "Men's Edit", href: '/search?category=Men', image: '/banners/kids-mela-men-edit.svg', tone: 'from-slate-950/75 to-slate-950/10' },
        { label: "Women's Collection", href: '/search?category=Women', image: '/banners/kids-mela-women-collection.svg', tone: 'from-rose-950/70 to-rose-900/10' },
        { label: 'Shoes & Bags', href: '/search?category=Accessories', image: '/banners/kids-mela-shoes-bags.svg', tone: 'from-fuchsia-950/70 to-fuchsia-900/10' },
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

    const loadBundles = async () => {
        try {
            const data = await apiRequest('/storefront/bundles');
            setBundles(data.data || []);
        } catch (exception) {
            console.error('Failed to load bundles:', exception);
        }
    };

    useEffect(() => {
        loadProducts();
        loadBundles();
        loadBanners();
    }, []);

    const offerCategories = useMemo(() => {
        const names = offercategories.map((offer) => offer.category).filter(Boolean);
        return [...new Set(names)];
    }, [offercategories]);


    const categories = useMemo(() => {
        const names = products.map((product) => product.category).filter(Boolean);
        return ['All', ...Array.from(new Set(names))];
    }, [products]);

    const dealProducts = useMemo(() => products.slice(0, 6), [products]);

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
        <MobileShell banners={banners} contentOverBanner>
            <Head title="Home" />

            <div className="space-y-4 bg-gradient-to-b from-slate-50 to-white px-2 py-2 lg:space-y-6 lg:bg-transparent lg:px-0 lg:py-0">
                {/* Desktop Slide Banners */}
                <section className="hidden lg:block overflow-hidden rounded-md bg-slate-950 text-white">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        loop={banners.length > 1}
                        className="min-h-[400px]"
                    >
                        {banners.map((banner) => (
                            <SwiperSlide key={banner.id}>
                                <Link href={banner.link || '/search'} className="block h-full">
                                    <div className="relative h-[400px]">
                                        {banner.image_url ? (
                                            <img
                                                src={banner.image_url}
                                                alt={banner.image_alt || banner.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className={`h-full w-full bg-gradient-to-r ${banner.gradient || 'from-orange-500 via-rose-500 to-fuchsia-600'}`}>
                                                <div className="flex h-full items-center justify-center px-20">
                                                    <div className="text-center">
                                                        <p className="text-sm font-black uppercase tracking-[0.28em] text-rose-300">
                                                            {banner.discount || 'Special Offer'}
                                                        </p>
                                                        <h2 className="mt-4 text-4xl font-black leading-tight">
                                                            {banner.title}
                                                        </h2>
                                                        {banner.description && (
                                                            <p className="mt-4 max-w-lg text-sm font-semibold leading-6 text-slate-300">
                                                                {banner.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>

                <section className="hidden grid-cols-3 gap-4 lg:grid">
                    {fashionCollections.map((collection) => (
                        <Link key={collection.label} href={collection.href} className="group relative h-[180px] overflow-hidden rounded-md bg-slate-900">
                            <img src={collection.image} alt={collection.label} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className={`absolute inset-0 bg-gradient-to-t ${collection.tone}`} />
                            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Collection</p>
                                <h2 className="mt-1 text-xl font-black">{collection.label}</h2>
                            </div>
                        </Link>
                    ))}
                </section>

                <div className="lg:hidden">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {(dealProducts.length > 0 ? dealProducts : [null, null, null]).map((product, index) => (
                            <Link
                                key={product?.id || index}
                                href={product ? `/products/${product.id}` : '/search'}
                                className="flex w-[140px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md hover:ring-slate-300"
                            >
                                <div className="relative h-[140px] overflow-hidden rounded-t-2xl bg-gradient-to-br from-orange-50 to-rose-50">
                                    {product?.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
                                    ) : (
                                        <div className="grid h-full place-items-center px-2 text-center text-xs font-black text-orange-700">
                                            FREE DELIVERY
                                        </div>
                                    )}
                                    {!product && (
                                        <div className="absolute top-2 right-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white">
                                            HOT
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col p-3">
                                    <p className="line-clamp-2 text-xs font-semibold leading-tight text-slate-800">
                                        {product?.name || ['Selected Store Only', 'Fresh Deals', 'Unbeatable Price'][index] || 'Hot Deal'}
                                    </p>
                                    {product && (
                                        <div className="mt-2 flex items-center justify-between">
                                            <p className="text-sm font-black text-rose-600">${Number(product.price).toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="lg:hidden">
                    <div className="grid grid-cols-5 gap-2">
                        {offerCategories.map((category) => (
                            <div key={category} className="flex flex-col items-center rounded-2xl bg-gradient-to-br from-orange-50 to-rose-50 p-2 shadow-sm ring-1 ring-orange-100">
                                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white text-[9px] font-black text-orange-600 shadow-sm ring-1 ring-orange-200">
                                    {category.charAt(0)}
                                </div>
                                <p className="mt-1 text-[9px] font-semibold leading-3 text-slate-700">{category}</p>
                            </div>
                        ))}

                        {trustFeatures.map((feature) => (
                            <div key={feature.label} className="flex flex-col items-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-2 shadow-sm ring-1 ring-emerald-100">
                                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white text-[9px] font-black text-emerald-600 shadow-sm ring-1 ring-emerald-200" role="img" aria-label={feature.label}>
                                    {feature.badge}
                                </div>
                                <p className="mt-1 text-[9px] font-semibold leading-3 text-slate-700">{feature.label}</p>
                            </div>
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
                                aria-pressed={activeCategory === category}
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



                <section className="grid grid-cols-2 gap-2 lg:hidden">
                    {fashionCollections.slice(0, 2).map((collection) => (
                        <Link key={collection.label} href={collection.href} className="relative h-24 overflow-hidden rounded-md bg-slate-900">
                            <img src={collection.image} alt={collection.label} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <span className="absolute bottom-2 left-2 right-2 text-xs font-black text-white">{collection.label}</span>
                        </Link>
                    ))}
                </section>

                {/* Flash Sale Section */}
                <FlashSale products={products} />

                {/* Product Bundles Section */}
                {bundles.length > 0 && (
                    <div className="pt-6 pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-slate-900">Bundle Deals</h2>
                            <Link href="/bundles" className="text-xs font-bold text-rose-600 hover:text-rose-700">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            {bundles.slice(0, 4).map((bundle) => (
                                <ProductBundleCard key={bundle.id} bundle={bundle} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Trending Products */}
                <TrendingProducts products={products} />

                {/* Recommended Products */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-base font-black text-slate-900">Recommended Products</h2>
                        <Link href="/search" className="text-xs font-black text-orange-600 hover:text-orange-700">View All</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {products.slice(0, 5).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>



                {/* Products */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base px-2 font-bold text-slate-900">
                                {activeCategory === 'All' ? 'Fashion deals you cannot miss' : activeCategory}
                            </h2>

                        </div>
                    </div>






                    {/* Loading */}
                    {isLoading && <SkeletonLoader type="card" count={4} aria-hidden="true" />}

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
                <div className="hidden lg:block">
                    <BundleDeals products={products} />
                </div>

                {/* Recently Viewed */}
                <div className="hidden lg:block">
                    <RecentlyViewed />
                </div>
            </div>
        </MobileShell>
    );
}
