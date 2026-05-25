import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useState, useMemo } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useRecentlyViewed } from '@/Contexts/RecentlyViewedContext';
import { getProduct, getProducts } from '@/services/products';
import StarRating from '@/Components/Storefront/StarRating';
import CategoryBadge from '@/Components/Storefront/CategoryBadge';
import SkeletonLoader from '@/Components/Storefront/SkeletonLoader';
import ProductReviews from '@/Components/Storefront/ProductReviews';
import ProductCard from '@/Components/Storefront/ProductCard';
import ImageGallery from '@/Components/Storefront/ImageGallery';
import ProductVariants from '@/Components/Storefront/ProductVariants';
import SocialShare from '@/Components/Storefront/SocialShare';

function money(value) {
    return '৳' + Number(value ?? 0).toLocaleString();
}

export default function ProductDetailsPage({ productId }) {
    const { addItem } = useCart();
    const { isSaved, toggleItem } = useWishlist();
    const { addItem: addToRecentlyViewed } = useRecentlyViewed();
    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState({ size: 'M', color: 'Black' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [added, setAdded] = useState(false);
    const [reviews, setReviews] = useState([]);

    const recommendations = useMemo(() => {
        if (!product || allProducts.length === 0) return [];
        return allProducts
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 4);
    }, [product, allProducts]);

    const discount = useMemo(() => {
        if (!product) return 0;
        const compare = Number(product.compare_price ?? 0);
        const price = Number(product.price ?? 0);
        if (compare > price && compare > 0) {
            return Math.round(((compare - price) / compare) * 100);
        }
        return 0;
    }, [product]);

    useEffect(() => {
        let active = true;

        async function loadProduct() {
            setIsLoading(true);
            setError('');

            try {
                const [productData, allProductsData] = await Promise.all([
                    getProduct(productId),
                    getProducts()
                ]);
                if (active) {
                    setProduct(productData);
                    setAllProducts(allProductsData);
                    addToRecentlyViewed(productData);
                }
            } catch (exception) {
                if (active) {
                    setError(exception.message || 'Product could not be loaded.');
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        }

        loadProduct();

        return () => {
            active = false;
        };
    }, [productId]);

    const handleAdd = () => {
        addItem(product, quantity);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
    };

    const handleAddReview = (review) => {
        setReviews([...reviews, { ...review, author: 'You', date: 'Just now' }]);
    };

    const stock = product ? Number(product.stock ?? 0) : 0;

    return (
        <MobileShell title="Product Details" showSearch={false}>
            <Head title={product?.name ?? 'Product Details'} />

            {isLoading && <div className="m-4"><SkeletonLoader type="hero" /></div>}

            {error && (
                <div className="m-4 rounded-3xl bg-gradient-to-br from-red-50 to-rose-100 p-8 text-center shadow-sm ring-1 ring-red-200">
                    <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-red-100">
                        <svg viewBox="0 0 24 24" className="h-12 w-12 text-red-600" fill="none" aria-hidden="true">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <p className="mt-4 text-sm font-bold text-red-600">{error}</p>
                    <Link href="/" className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-2 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95">
                        Back Home
                    </Link>
                </div>
            )}

            {!isLoading && !error && product && (
                <section className="pb-24">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-400">
                        <Link href="/" className="text-orange-600">Home</Link>
                        <span>›</span>
                        {product.category && (
                            <>
                                <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="text-orange-600">{product.category}</Link>
                                <span>›</span>
                            </>
                        )}
                        <span className="truncate text-slate-600">{product.name}</span>
                    </div>

                    {/* Image + Discount Badge */}
                    <div className="relative bg-white">
                        {discount > 0 && (
                            <span className="absolute left-0 top-4 z-10 rounded-r-full bg-red-500 px-3 py-1 text-xs font-black text-white shadow-md">
                                -{discount}%
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => toggleItem(product)}
                            className={`absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full text-xl shadow-lg transition-all duration-200 active:scale-95 ${
                                isSaved(product.id) ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-white text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            ♥
                        </button>
                        <ImageGallery 
                            mainImage={product.image_url} 
                            images={product.additional_images || []} 
                        />
                    </div>

                    <div className="space-y-4 px-4 py-4">
                        {added && (
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-black text-white shadow-md">
                                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
                                <div className="relative flex items-center gap-2">
                                    <span className="text-lg">&#10004;</span>
                                    কার্টে যোগ করা হয়েছে
                                </div>
                            </div>
                        )}

                        {/* Price & Info Card */}
                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <div className="flex items-start justify-between gap-3">
                                {product.category ? (
                                    <CategoryBadge category={product.category} />
                                ) : (
                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                                        Featured
                                    </span>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <StarRating rating={Number(product.rating ?? 0)} size="sm" />
                                    <span className="text-xs font-bold text-slate-500">
                                        ({product.reviews_count ?? 0})
                                    </span>
                                </div>
                            </div>
                            <h1 className="mt-3 text-xl font-black leading-7 text-slate-950">{product.name}</h1>

                            {/* Price section with discount */}
                            <div className="mt-3 flex items-end gap-3">
                                <p className="text-3xl font-black text-orange-600">{money(product.price)}</p>
                                {discount > 0 && (
                                    <p className="mb-0.5 text-base text-slate-400 line-through">{money(product.compare_price)}</p>
                                )}
                                {discount > 0 && (
                                    <span className="mb-0.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-black text-red-600">
                                        {discount}% ছাড়
                                    </span>
                                )}
                            </div>

                            {/* Stock status */}
                            <div className={`mt-3 rounded-2xl px-3 py-2 text-sm font-bold ${
                                stock > 5
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : stock > 0
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'bg-red-50 text-red-700'
                            }`}>
                                {stock > 5
                                    ? `✓ স্টকে আছে (${stock}টি)`
                                    : stock > 0
                                        ? `⚠ মাত্র ${stock}টি বাকি!`
                                        : '✗ স্টক শেষ'}
                            </div>

                            {/* Sold count */}
                            {Number(product.sold_count ?? 0) > 0 && (
                                <p className="mt-2 text-xs font-semibold text-slate-400">
                                    {product.sold_count}+ বিক্রি হয়েছে
                                </p>
                            )}
                        </div>

                        {/* Delivery Info */}
                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-base font-black text-slate-950">ডেলিভারি তথ্য</h2>
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-600">
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                    </span>
                                    <div>
                                        <p className="font-bold text-slate-800">ঢাকায় ১-২ দিনে ডেলিভারি</p>
                                        <p className="text-xs text-slate-400">ঢাকার বাইরে ৩-৫ দিন</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </span>
                                    <p className="font-bold text-slate-800">ক্যাশ অন ডেলিভারি</p>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2z"/><path d="M1 10h22"/></svg>
                                    </span>
                                    <p className="font-bold text-slate-800">৭ দিনে রিটার্ন পলিসি</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-base font-black text-slate-950">বিবরণ</h2>
                            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{product.description}</p>
                        </div>

                        {/* Variant Selector */}
                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-base font-black text-slate-950">ভ্যারিয়েন্ট নির্বাচন</h2>
                            <ProductVariants onVariantChange={setSelectedVariant} />
                        </div>

                        {/* Product Details Table */}
                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-base font-black text-slate-950">পণ্যের বিবরণ</h2>
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-slate-500">ক্যাটাগরি</span>
                                    <span className="font-black text-slate-950">{product.category || 'Featured'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-slate-500">রেটিং</span>
                                    <div className="flex items-center gap-1">
                                        <StarRating rating={Number(product.rating ?? 0)} size="xs" />
                                        <span className="font-black text-slate-950">({product.reviews_count ?? 0})</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-slate-500">স্টক</span>
                                    <span className={`font-black ${stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {stock > 0 ? `${stock}টি আছে` : 'স্টক শেষ'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <ProductReviews productId={productId} reviews={reviews} onAddReview={handleAddReview} />

                        <SocialShare product={product} />

                        {recommendations.length > 0 && (
                            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                <h2 className="text-base font-black text-slate-950">আপনি পছন্দ করতে পারেন</h2>
                                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                    {recommendations.map((recProduct) => (
                                        <ProductCard key={recProduct.id} product={recProduct} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sticky Bottom Bar */}
                    <div className="fixed bottom-16 left-0 right-0 z-20 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:bottom-0 lg:static lg:border-0 lg:shadow-none">
                        <div className="mx-auto flex max-w-md items-center gap-3 lg:max-w-none">
                            <div className="shrink-0">
                                <p className="text-lg font-black text-orange-600">{money(product.price)}</p>
                                {discount > 0 && (
                                    <p className="text-xs text-slate-400 line-through">{money(product.compare_price)}</p>
                                )}
                            </div>
                            <div className="flex h-11 items-center rounded-xl bg-slate-100 px-1">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                                    className="grid h-9 w-9 place-items-center rounded-lg bg-white text-lg font-black transition-all duration-200 hover:bg-slate-50 active:scale-95"
                                >
                                    -
                                </button>
                                <span className="w-9 text-center text-sm font-black">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((v) => v + 1)}
                                    className="grid h-9 w-9 place-items-center rounded-lg bg-white text-lg font-black transition-all duration-200 hover:bg-slate-50 active:scale-95"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                type="button"
                                disabled={stock <= 0}
                                onClick={handleAdd}
                                className="h-11 flex-1 rounded-xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
                            >
                                {stock <= 0 ? 'স্টক শেষ' : 'কার্টে যোগ করুন'}
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </MobileShell>
    );
}
