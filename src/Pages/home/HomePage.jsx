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
    const [offercategories, setOfferCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('default');

    const trustFeatures = [
        { label: 'Lowest Price', badge: 'Short' },
        { label: 'Fast Delivery', badge: 'FAST' },
        { label: '100% Authentic', badge: 'OK' },
        { label: 'Cashback', badge: 'CASH' },
        { label: 'Latest Drops', badge: 'NEW' },
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

            <div className="top-0 z-50 space-y-4 px-2 py-2 bg-[#f1f5cb] lg:px-0 lg:py-0">
                <div className="lg:hidden">
                    <div className="flex gap-2 overflow-y-auto pb-1 scrollbar-hide">
                        {(dealProducts.length > 0 ? dealProducts : [null, null, null]).map((product, index) => (
                            <Link
                                key={product?.id || index}
                                href={product ? `/products/${product.id}` : '/search'}
                                className="flex w-[150px] shrink-0 flex-col overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-100"
                            >
                                <div className="flex h-[130px] overflow-hidden rounded-t-md bg-slate-200 cyan-50">
                                    {product?.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                                    ) : (
                                        <div className="grid h-full place-items-center px-2 text-center text-xs font-black text-cyan-700">
                                            FREE DELIVERY
                                        </div>
                                    )}
                                </div>


                                <div className="flex flex-col p-1 items-center">
                                    <div className="flex flex-col items-center">
                                        <p className="text-[11px] text-semibold h-10  leading-2 text-black-500">
                                        {product?.name || ['Selected Store Only', 'Fresh Deals', 'Unbeatable Price'][index] || 'Hot Deal'}
                                      
                                     </p> 
                                     </div>
                                       {product &&
                                     
                                             <div className="flex items-center">
                                                  <p className="text-xs font-black text-pink-600">${Number(product.price).toFixed(2)}
                                                  </p>
                                            </div>
                                      }    
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="lg:hidden">
                    <div className="grid grid-cols-5 gap-1.5">
                        {offerCategories.map((category) => (
                            <div key={category} className="flex flex-col items-center bg-slate-200 rounded-lg">
                                <div className="mx-auto grid h-10 w-10 place-items-center rounded bg-cyan-50 text-[9px] font-black text-cyan-700 ring-1 ring-cyan-100">
                                    {category}
                                </div>
                                <p className="mt-1 text-[9px] font-semibold leading-3 text-slate-500">{category}</p>
                            </div>
                        ))}

                        
                        {trustFeatures.map((feature) => (
                            <div key={feature.label} className="flex flex-col items-center bg-slate-200 rounded-lg">
                                <div className="mx-auto grid h-10 w-10 place-items-center rounded bg-cyan-50 text-[9px] font-black text-cyan-700 ring-1 ring-cyan-100">
                                    {feature.badge}
                                </div>
                                <p className="mt-1 text-[9px] font-semibold leading-3 text-slate-500">{feature.label}</p>
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
                <div className="hidden lg:block">
                    <TrendingProducts products={products} />
                </div>

                {/* Recommended Products */}
                <div className="relative item center pt-3 pb-4 gap-4">
                    <div className="flex grid-cols-2 items-center justify-between gap-4">
                        <div>
                        <h2 className="text-base font-bold px-2 text-slate-900">
                            Recommended Products
                        </h2>
                        </div>
                        <div>
                        <span className="text-xs px-2 text-gray-500">View All</span>
                        </div>
                    </div>
                

                    <div className="flex items-center justify-between pt-3">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                {activeCategory === 'All' ? '' : activeCategory}
                            </h2>
                          

                        </div>
                    </div>
                </div>
                


                {/* Products */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base px-2 font-bold text-slate-900">
                                {activeCategory === 'All' ? 'Deals you cannot miss' : activeCategory}
                            </h2>

                        </div>
                    </div>






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
                <div className="hidden lg:block">
                    <BundleDeals products={products} />
                </div>

                {/* Recently Viewed */}
                <div className="hidden lg:block">
                    <RecentlyViewed />
                </div>

                {/* Newsletter */}
                <div className="hidden lg:block">
                    <Newsletter />
                </div>
            </div>
        </MobileShell>
    );
}
