import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useState, useMemo } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useRecentlyViewed } from '@/Contexts/RecentlyViewedContext';
import { useCurrency } from '@/Contexts/CurrencyContext';
import { getProduct, getProducts } from '@/services/products';
import StarRating from '@/Components/Storefront/StarRating';
import CategoryBadge from '@/Components/Storefront/CategoryBadge';
import SkeletonLoader from '@/Components/Storefront/SkeletonLoader';
import ProductReviews from '@/Components/Storefront/ProductReviews';
import ProductCard from '@/Components/Storefront/ProductCard';
import ImageGallery from '@/Components/Storefront/ImageGallery';
import ProductVariants from '@/Components/Storefront/ProductVariants';
import SocialShare from '@/Components/Storefront/SocialShare';
import StockAlertButton from '@/Components/Storefront/StockAlertButton';
import { ChevronLeft, ChevronRight, Ruler } from 'lucide-react';

function asArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function getFashionDetails(product) {
    return {
        fabric: product.fabric || product.material || 'Premium blended cotton',
        fit: product.fit || product.style_fit || 'Regular fit',
        occasion: product.occasion || 'Casual, office, and daily wear',
        care: product.care_instruction || product.care || 'Machine wash cold, wash dark colors separately, do not bleach',
        sizes: asArray(product.sizes || product.available_sizes || product.size),
        colors: asArray(product.colors || product.available_colors || product.color || product.colour),
    };
}

export default function ProductDetailsPage({ productId, product: productFromLoader }) {
    const { addItem } = useCart();
    const { isSaved, toggleItem } = useWishlist();
    const { addItem: addToRecentlyViewed } = useRecentlyViewed();
    const { formatMoney } = useCurrency();
    const [product, setProduct] = useState(productFromLoader || null);
    const [allProducts, setAllProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState({ size: null, color: null, variant: null });
    const [isLoading, setIsLoading] = useState(!productFromLoader);
    const [error, setError] = useState('');
    const [added, setAdded] = useState(false);
    const [variantError, setVariantError] = useState('');
    const [reviews, setReviews] = useState([]);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [productVariants, setProductVariants] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);

    const recommendations = useMemo(() => {
        if (!product || allProducts.length === 0) return [];
        return allProducts
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 4);
    }, [product, allProducts]);

    const discount = useMemo(() => {
        if (!product) return 0;
        const compare = Number(product.compare_price ?? product.sale_price ?? 0);
        const price = Number(product.price ?? 0);
        if (compare > price && compare > 0) {
            return Math.round(((compare - price) / compare) * 100);
        }
        return 0;
    }, [product]);

    useEffect(() => {
        if (productFromLoader) {
            setProduct(productFromLoader);
            addToRecentlyViewed(productFromLoader);
        }
    }, [productFromLoader, addToRecentlyViewed]);

    useEffect(() => {
        let active = true;

        async function loadProduct() {
            if (productFromLoader) return;
            
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
                    
                    // Load product variants
                    if (productData.id) {
                        loadProductVariants(productData.id);
                    }
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

    const loadProductVariants = async (productId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/products/${productId}/variants`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
            });
            const data = await response.json();
            setProductVariants(data.variants || []);
            
            // Extract unique colors and sizes
            const colors = [...new Map(data.variants?.filter(v => v.color).map(v => [v.color.id, v.color]).values())];
            const sizes = [...new Map(data.variants?.filter(v => v.size).map(v => [v.size.id, v.size]).values())];
            
            setAvailableColors(colors);
            setAvailableSizes(sizes);
        } catch (err) {
            console.error('Failed to load variants:', err);
        }
    };

    const handleAdd = () => {
        if (!selectedVariant.variant) {
            setVariantError('Please select size and color before adding this style.');
            return;
        }

        setVariantError('');
        addItem(product, quantity, {
            size: selectedVariant.size?.name,
            color: selectedVariant.color,
            variant: selectedVariant.variant
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
    };

    const handleAddReview = (review) => {
        setReviews([...reviews, { ...review, author: 'You', date: 'Just now' }]);
    };

    const handleColorSelect = (color) => {
        setSelectedVariant(prev => ({ 
            ...prev, 
            color,
            size: null,
            variant: null 
        }));
        setVariantError('');
    };

    const handleSizeSelect = (size) => {
        // Find matching variant with selected color and size
        const matchingVariant = productVariants.find(
            v => v.color_id === selectedVariant.color?.id && v.size_id === size.id
        );
        
        setSelectedVariant(prev => ({ 
            ...prev, 
            size,
            variant: matchingVariant 
        }));
        
        if (matchingVariant) {
            setVariantError('');
        }
    };

    const stock = selectedVariant.variant ? Number(selectedVariant.variant.stock ?? 0) : (product ? Number(product.stock ?? 0) : 0);
    const fashionDetails = product ? getFashionDetails(product) : null;
    const displayImage = product?.display_image_url || product?.image_url;
    const comparePrice = product ? Number(product.compare_price ?? product.sale_price ?? 0) : 0;
    const variantReady = Boolean(selectedVariant.size && selectedVariant.color);
    const currentPrice = selectedVariant.variant?.price || product?.price;
    const currentSalePrice = selectedVariant.variant?.sale_price || product?.sale_price;
    const allImages = displayImage ? [displayImage, ...(product.additional_images || [])] : (product.additional_images || []);

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const handleBuyNow = () => {
        if (!selectedVariant.variant) {
            setVariantError('Please select size and color before checkout.');
            return;
        }
        addItem(product, quantity, {
            size: selectedVariant.size?.name,
            color: selectedVariant.color,
            variant: selectedVariant.variant
        });
        // Navigate to checkout
        window.location.href = '/checkout';
    };

    return (
        <MobileShell title="Product Details" showSearch={false} simpleHeader={true}>
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

                    {/* Image + Discount Badge - Left/Right Split Layout */}
                    <div className="relative bg-white lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12 lg:bg-transparent lg:px-6 lg:py-6">
                        {discount > 0 && (
                            <span className="absolute left-4 top-4 z-10 rounded-r-full bg-red-500 px-3 py-1 text-xs font-black text-white shadow-md lg:left-6 lg:top-6">
                                -{discount}%
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => toggleItem(product)}
                            className={`absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full text-xl shadow-lg transition-all duration-200 active:scale-95 lg:right-auto lg:left-6 lg:top-6 ${
                                isSaved(product.id) ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-white text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            ♥
                        </button>

                        {/* Left Column - Image Gallery with Hover Navigation */}
                        <div className="relative lg:sticky lg:top-24 lg:self-start">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 to-slate-100 shadow-xl">
                                {allImages.length > 0 && (
                                    <>
                                        <img
                                            src={allImages[currentImageIndex]}
                                            alt={`Product image ${currentImageIndex + 1}`}
                                            className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
                                        />
                                        {/* Hover Navigation Arrows */}
                                        <div className="absolute inset-0 flex items-center justify-between opacity-0 transition-opacity duration-300 hover:opacity-100">
                                            <button
                                                type="button"
                                                onClick={handlePrevImage}
                                                className="m-4 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-slate-800 shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-xl active:scale-95"
                                            >
                                                <ChevronLeft className="h-6 w-6" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNextImage}
                                                className="m-4 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-slate-800 shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-xl active:scale-95"
                                            >
                                                <ChevronRight className="h-6 w-6" />
                                            </button>
                                        </div>
                                        {/* Image Counter */}
                                        {allImages.length > 1 && (
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white shadow-lg">
                                                {currentImageIndex + 1} / {allImages.length}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {allImages.length > 1 && (
                                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {allImages.map((image, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 active:scale-95 ${
                                                currentImageIndex === index
                                                    ? 'border-rose-600 ring-2 ring-rose-100 shadow-md'
                                                    : 'border-transparent hover:border-slate-300 hover:shadow-md'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column - Sequential Sections */}
                        <div className="space-y-6 px-4 py-4 lg:px-0 lg:py-0">
                            {added && (
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-black text-white shadow-md">
                                    <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
                                    <div className="relative flex items-center gap-2">
                                        <span className="text-lg">&#10004;</span>
                                        Added to cart: {selectedVariant.size} / {selectedVariant.color?.name}
                                    </div>
                                </div>
                            )}

                            {/* Product Title */}
                            <div>
                                {product.category ? (
                                    <CategoryBadge category={product.category} />
                                ) : (
                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                                        Featured
                                    </span>
                                )}
                                <h1 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-slate-950">{product.name}</h1>
                                <div className="mt-2 flex items-center gap-2">
                                    <StarRating rating={Number(product.rating ?? 0)} size="sm" />
                                    <span className="text-sm md:text-base font-bold text-slate-500">
                                        ({product.reviews_count ?? 0} reviews)
                                    </span>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="flex items-end gap-3">
                                <p className="text-4xl md:text-5xl font-black text-rose-600">{formatMoney(currentPrice)}</p>
                                {(currentSalePrice || comparePrice) > Number(currentPrice ?? 0) && (
                                    <p className="mb-1 text-xl md:text-2xl text-slate-400 line-through">{formatMoney(currentSalePrice || comparePrice)}</p>
                                )}
                                {discount > 0 && (
                                    <span className="mb-1 rounded-full bg-red-50 px-3 py-1 text-sm md:text-base font-black text-red-600">
                                        {discount}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                                stock > 5
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : stock > 0
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'bg-red-50 text-red-700'
                            }`}>
                                {stock > 5
                                    ? `✓ In Stock (${stock} available)`
                                    : stock > 0
                                        ? `⚠ Only ${stock} left in stock`
                                        : '✗ Out of Stock'}
                            </div>

                            {stock <= 0 && <StockAlertButton product={product} stock={stock} />}

                            {/* Color Selection */}
                            <div>
                                <h3 className="text-sm md:text-base font-bold text-slate-900">Color: <span className="text-rose-600">{selectedVariant.color?.name || 'Select a color'}</span></h3>
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {availableColors.length > 0 ? (
                                        availableColors.map((color) => (
                                            <button
                                                key={color.id}
                                                type="button"
                                                onClick={() => handleColorSelect(color)}
                                                className={`h-12 w-12 md:h-14 md:w-14 rounded-full border-2 transition-all duration-300 ${
                                                    selectedVariant.color?.id === color.id
                                                        ? 'border-rose-600 ring-2 ring-rose-100 ring-offset-2 scale-110 shadow-lg'
                                                        : 'border-slate-300 hover:border-slate-400 hover:scale-105'
                                                }`}
                                                style={{ backgroundColor: color.hex_code || '#e5e7eb' }}
                                                title={color.name}
                                            />
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500">No colors available</span>
                                    )}
                                </div>
                            </div>

                            {/* Size Selection with Size Guide */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Size: <span className="text-rose-600">{selectedVariant.size?.name || 'Select a size'}</span></h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowSizeGuide(true)}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                                    >
                                        <Ruler className="h-4 w-4" />
                                        Size Guide
                                    </button>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {availableSizes.length > 0 ? (
                                        availableSizes.map((size) => {
                                            // Check if this size is available with selected color
                                            const isAvailable = !selectedVariant.color || productVariants.some(
                                                v => v.color_id === selectedVariant.color.id && v.size_id === size.id && v.stock > 0
                                            );
                                            
                                            return (
                                                <button
                                                    key={size.id}
                                                    type="button"
                                                    onClick={() => isAvailable && handleSizeSelect(size)}
                                                    disabled={!isAvailable}
                                                    className={`h-12 w-12 rounded-xl border-2 text-sm font-black transition-all duration-300 ${
                                                        selectedVariant.size?.id === size.id
                                                            ? 'border-rose-600 bg-rose-50 text-rose-600 shadow-md'
                                                            : isAvailable
                                                                ? 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:shadow-md'
                                                                : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                                                    }`}
                                                    title={isAvailable ? size.name : 'Not available with selected color'}
                                                >
                                                    {size.name}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <span className="text-sm text-slate-500">No sizes available</span>
                                    )}
                                </div>
                            </div>

                            {variantError && (
                                <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 animate-slide-down">
                                    {variantError}
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Quantity</h3>
                                <div className="mt-3 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="grid h-12 w-12 place-items-center rounded-xl border-2 border-slate-300 text-xl font-black text-slate-700 transition-all hover:border-rose-500 hover:text-rose-600 active:scale-95"
                                    >
                                        −
                                    </button>
                                    <div className="h-12 w-20 grid place-items-center rounded-xl border-2 border-slate-300 bg-slate-50 text-lg font-black text-slate-900">
                                        {quantity}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                        disabled={quantity >= stock}
                                        className="grid h-12 w-12 place-items-center rounded-xl border-2 border-slate-300 text-xl font-black text-slate-700 transition-all hover:border-rose-500 hover:text-rose-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    disabled={stock <= 0}
                                    onClick={handleAdd}
                                    className="flex-1 rounded-xl bg-rose-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all duration-300 hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-300 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    type="button"
                                    disabled={stock <= 0}
                                    onClick={handleBuyNow}
                                    className="flex-1 rounded-xl bg-slate-900 px-6 py-4 text-sm font-black text-white shadow-lg shadow-slate-300 transition-all duration-300 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-400 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* 3-Column Grid: Details, Fit & Fabric, Shipping */}
                            <div className="grid gap-4 lg:grid-cols-3">
                                {/* Details */}
                                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
                                    <h3 className="text-sm font-black text-slate-950">Details</h3>
                                    <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
                                        {product.description || 'A curated Kids Mela style made for comfort, confident fit, and everyday wear.'}
                                    </p>
                                </div>

                                {/* Fit & Fabric */}
                                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
                                    <h3 className="text-sm font-black text-slate-950">Fit & Fabric</h3>
                                    <div className="mt-2 space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-slate-500">Fabric</span>
                                            <span className="font-black text-slate-900">{fashionDetails.fabric}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-slate-500">Fit</span>
                                            <span className="font-black text-slate-900">{fashionDetails.fit}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-slate-500">Care</span>
                                            <span className="font-black text-slate-900">{fashionDetails.care}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping & Returns */}
                                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
                                    <h3 className="text-sm font-black text-slate-950">Shipping & Returns</h3>
                                    <div className="mt-2 space-y-2 text-xs font-bold text-slate-700">
                                        <div className="rounded-xl bg-rose-50 px-3 py-2 text-rose-700">
                                            Dhaka: 1-2 days
                                        </div>
                                        <div className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700">
                                            Outside: 3-5 days
                                        </div>
                                        <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-700">
                                            7-day exchange
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Tabs */}
                            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                                <div className="flex border-b border-slate-200">
                                    <button className="px-6 py-3 text-sm font-black text-rose-600 border-b-2 border-rose-600">Description</button>
                                    <button className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Reviews</button>
                                    <button className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Specifications</button>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {product.description || 'This product is crafted with premium materials to ensure comfort and durability. Perfect for everyday wear with a stylish design that stands out.'}
                                    </p>
                                </div>
                            </div>

                            {/* Sold Count */}
                            {Number(product.sold_count ?? 0) > 0 && (
                                <p className="text-center text-xs font-semibold text-slate-400">
                                    {product.sold_count}+ people bought this
                                </p>
                            )}

                            <ProductReviews productId={productId} reviews={reviews} onAddReview={handleAddReview} />

                            <SocialShare product={product} />
                        </div>
                    </div>

                    {/* Related Products Section - 4 Columns with Swiper */}
                    {recommendations.length > 0 && (
                        <div className="px-4 py-8 lg:px-6">
                            <h2 className="text-xl font-black text-slate-950">You May Also Like</h2>
                            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {recommendations.map((recProduct) => (
                                    <ProductCard key={recProduct.id} product={recProduct} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top Sale Section - 4 Columns */}
                    <div className="px-4 py-8 lg:px-6">
                        <h2 className="text-xl font-black text-slate-950">Top Selling Products</h2>
                        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {allProducts
                                .filter(p => p.id !== product?.id)
                                .sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0))
                                .slice(0, 4)
                                .map((topProduct) => (
                                    <ProductCard key={topProduct.id} product={topProduct} />
                                ))}
                        </div>
                    </div>

                    {/* Size Guide Modal */}
                    {showSizeGuide && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <div className="max-w-2xl w-full rounded-3xl bg-white p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-black text-slate-950">Size Guide</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowSizeGuide(false)}
                                        className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-slate-200"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b-2 border-slate-200">
                                                <th className="px-4 py-3 text-left font-black text-slate-900">Size</th>
                                                <th className="px-4 py-3 text-left font-black text-slate-900">Chest (cm)</th>
                                                <th className="px-4 py-3 text-left font-black text-slate-900">Length (cm)</th>
                                                <th className="px-4 py-3 text-left font-black text-slate-900">Shoulder (cm)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-slate-100">
                                                <td className="px-4 py-3 font-bold text-slate-700">XS</td>
                                                <td className="px-4 py-3 text-slate-600">84-88</td>
                                                <td className="px-4 py-3 text-slate-600">66</td>
                                                <td className="px-4 py-3 text-slate-600">40</td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <td className="px-4 py-3 font-bold text-slate-700">S</td>
                                                <td className="px-4 py-3 text-slate-600">88-92</td>
                                                <td className="px-4 py-3 text-slate-600">68</td>
                                                <td className="px-4 py-3 text-slate-600">42</td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <td className="px-4 py-3 font-bold text-slate-700">M</td>
                                                <td className="px-4 py-3 text-slate-600">92-96</td>
                                                <td className="px-4 py-3 text-slate-600">70</td>
                                                <td className="px-4 py-3 text-slate-600">44</td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <td className="px-4 py-3 font-bold text-slate-700">L</td>
                                                <td className="px-4 py-3 text-slate-600">96-100</td>
                                                <td className="px-4 py-3 text-slate-600">72</td>
                                                <td className="px-4 py-3 text-slate-600">46</td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <td className="px-4 py-3 font-bold text-slate-700">XL</td>
                                                <td className="px-4 py-3 text-slate-600">100-104</td>
                                                <td className="px-4 py-3 text-slate-600">74</td>
                                                <td className="px-4 py-3 text-slate-600">48</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-bold text-slate-700">XXL</td>
                                                <td className="px-4 py-3 text-slate-600">104-108</td>
                                                <td className="px-4 py-3 text-slate-600">76</td>
                                                <td className="px-4 py-3 text-slate-600">50</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-4 text-xs font-semibold text-slate-500">
                                    * Measurements may vary by 1-2 cm. Please refer to the product description for specific details.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Sticky Bottom Bar */}
                    <div className="fixed bottom-16 left-0 right-0 z-20 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:bottom-0 lg:static lg:border-0 lg:shadow-none">
                        <div className="mx-auto flex max-w-md items-center gap-3 lg:max-w-none">
                            <div className="shrink-0">
                                <p className="text-lg font-black text-rose-600">{formatMoney(product.price)}</p>
                                {comparePrice > Number(product.price ?? 0) && (
                                    <p className="text-xs text-slate-400 line-through">{formatMoney(comparePrice)}</p>
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
                                className="h-11 flex-1 rounded-xl bg-rose-600 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all duration-200 hover:bg-rose-700 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
                            >
                                {stock <= 0 ? 'Out of Stock' : variantReady ? `Add ${selectedVariant.size} to Cart` : 'Select Options'}
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </MobileShell>
    );
}
