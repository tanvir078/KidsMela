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
    return `$${Number(value ?? 0).toFixed(2)}`;
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
                <section className="pb-4">
                    <div className="relative bg-white">
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
                                    <span className="text-lg">✅</span>
                                    Added to your guest cart
                                </div>
                            </div>
                        )}

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
                            <h1 className="mt-3 text-2xl font-black leading-7 text-slate-950">{product.name}</h1>
                            <div className="mt-3 flex items-end justify-between">
                                <p className="text-3xl font-black text-orange-600">{money(product.price)}</p>
                                <p className="text-xs font-bold text-slate-500">
                                    {product.reviews_count ?? 0} reviews
                                </p>
                            </div>
                            <div className={`mt-3 rounded-2xl px-3 py-2 text-sm font-bold ${
                                Number(product.stock ?? 0) > 0 
                                    ? 'bg-emerald-50 text-emerald-700' 
                                    : 'bg-red-50 text-red-700'
                            }`}>
                                {Number(product.stock ?? 0) > 0 ? `✓ ${product.stock} items available` : '✗ Out of stock'}
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-base font-black text-slate-950">Description</h2>
                            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{product.description}</p>
                        </div>

                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-base font-black text-slate-950">Select Variant</h2>
                            <ProductVariants onVariantChange={setSelectedVariant} />
                        </div>

                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-base font-black text-slate-950">Product Details</h2>
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-slate-500">Category</span>
                                    <span className="font-black text-slate-950">{product.category || 'Featured'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-slate-500">Rating</span>
                                    <div className="flex items-center gap-1">
                                        <StarRating rating={Number(product.rating ?? 0)} size="xs" />
                                        <span className="font-black text-slate-950">({product.reviews_count ?? 0})</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-slate-500">Stock</span>
                                    <span className={`font-black ${Number(product.stock ?? 0) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {Number(product.stock ?? 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <ProductReviews productId={productId} reviews={reviews} onAddReview={handleAddReview} />

                        <SocialShare product={product} />

                        {recommendations.length > 0 && (
                            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                <h2 className="text-base font-black text-slate-950">You may also like</h2>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    {recommendations.map((recProduct) => (
                                        <ProductCard key={recProduct.id} product={recProduct} />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="sticky bottom-20 z-20 rounded-3xl bg-white p-3 shadow-2xl shadow-slate-300 ring-1 ring-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 items-center rounded-2xl bg-slate-100 px-1">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                                        className="grid h-10 w-10 place-items-center rounded-xl bg-white text-xl font-black transition-all duration-200 hover:bg-slate-100 active:scale-95"
                                    >
                                        -
                                    </button>
                                    <span className="w-10 text-center text-base font-black">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((value) => value + 1)}
                                        className="grid h-10 w-10 place-items-center rounded-xl bg-white text-xl font-black transition-all duration-200 hover:bg-slate-100 active:scale-95"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    disabled={Number(product.stock ?? 0) <= 0}
                                    onClick={handleAdd}
                                    className="h-12 flex-1 rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95 disabled:bg-slate-300 disabled:hover:bg-orange-600 disabled:active:scale-100"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </MobileShell>
    );
}
