import { Link } from '@/lib/inertiaCompat';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useComparison } from '@/Contexts/ComparisonContext';
import { useCurrency } from '@/Contexts/CurrencyContext';
import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import QuickViewModal from './QuickViewModal';
import { X } from 'lucide-react';

function ProductCard({ product }) {
    const { addItem } = useCart();
    const { isSaved, toggleItem } = useWishlist();
    const { addToCompare, isInCompare, removeFromCompare } = useComparison();
    const { formatMoney } = useCurrency();
    const stock = Number(product.stock ?? 0);
    const saved = isSaved(product.id);
    const inCompare = isInCompare(product.id);
    const sizes = Array.isArray(product.sizes)
        ? product.sizes
        : String(product.size || product.available_sizes || 'S,M,L').split(',').map((item) => item.trim()).filter(Boolean);
    const colors = Array.isArray(product.colors)
        ? product.colors
        : String(product.colors || product.color || product.colour || '').split(',').map((item) => item.trim()).filter(Boolean);
    const [showQuickView, setShowQuickView] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(colors[0] || '');
    const [showImageGallery, setShowImageGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const color = colors.slice(0, 2).join(' / ') || product.category || 'Style';
    const displayImage = product.display_image_url || product.image_url;
    const allImages = displayImage ? [displayImage, ...(product.additional_images || [])] : (product.additional_images || []);

    const discount = product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0;

    const handleCompare = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inCompare) {
            removeFromCompare(product.id);
        } else {
            const added = addToCompare(product);
            if (!added) {
                alert('You can compare up to 3 products at a time');
            }
        }
    }, [inCompare, addToCompare, removeFromCompare, product.id]);

    const handleAddToCart = useCallback(() => {
        if (sizes.length > 0 && !selectedSize) {
            setShowSizeModal(true);
            return;
        }
        addItem(product, 1, { size: selectedSize, color: selectedColor });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 1500);
    }, [addItem, product, selectedSize, selectedColor, sizes.length]);

    const handleSizeSelect = useCallback((size) => {
        setSelectedSize(size);
        setShowSizeModal(false);
        addItem(product, 1, { size, color: selectedColor });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 1500);
    }, [addItem, product, selectedColor]);

    const handleImageClick = useCallback(() => {
        if (allImages.length > 1) {
            setShowImageGallery(true);
            setCurrentImageIndex(0);
        }
    }, [allImages.length]);

    const handleWishlistToggle = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product.id);
    }, [toggleItem, product.id]);

    return (
        <>
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:shadow-xl hover:ring-rose-200"
            >
                {/* Wishlist button */}
                <button
                    type="button"
                    onClick={handleWishlistToggle}
                    aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-pressed={saved}
                    className={`absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full shadow-lg transition-all duration-300 active:scale-90 ${
                        saved ? 'bg-rose-600 text-white scale-110' : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white'
                    }`}
                >
                    <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform duration-300 ${saved ? 'scale-110' : ''}`} fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M12 21s-7-4.4-9.2-8.5C.7 8.6 3.1 4 7.4 4c2 0 3.5 1 4.6 2.4C13.1 5 14.6 4 16.6 4c4.3 0 6.7 4.6 4.6 8.5C19 16.6 12 21 12 21Z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <Link href={`/products/${product.id}`} className="block" aria-label={`View ${product.name} details`}>
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-rose-50 cursor-pointer" onClick={handleImageClick}>
                        {/* Discount badge */}
                        {discount > 0 && (
                            <span className="absolute left-2 top-2 z-10 rounded-full bg-rose-600 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg" aria-label={`${discount}% discount`}>
                                -{discount}%
                            </span>
                        )}

                        {/* Category badge */}
                        <span className="absolute right-2 top-2 z-10 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-rose-700 shadow-sm">
                            {product.category || 'Fashion'}
                        </span>

                        {/* Stock badge */}
                        {stock === 0 && (
                            <div className="absolute inset-0 z-10 grid place-items-center bg-black/30">
                                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-gray-600">Out of Stock</span>
                            </div>
                        )}
                        {stock > 0 && stock <= 5 && (
                            <span className="absolute bottom-2 left-2 z-10 rounded bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                Only {stock} left!
                            </span>
                        )}

                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />
                        ) : (
                            <div className="grid h-full place-items-center">
                                <div className="text-center">
                                    <svg viewBox="0 0 24 24" className="mx-auto h-10 w-10 text-gray-200" fill="none" aria-hidden="true">
                                        <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <p className="mt-1 text-[10px] font-medium text-gray-300">No image</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="p-3">
                        <p className="line-clamp-2 min-h-[36px] text-[13px] font-black leading-[18px] text-slate-900">
                            {product.name}
                        </p>

                        {/* Color swatches - always visible */}
                        {colors.length > 0 && (
                            <div className="mt-2 flex gap-1.5">
                                {colors.slice(0, 4).map((colorName, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedColor(colorName);
                                        }}
                                        className={`h-5 w-5 rounded-full border-2 transition-all duration-300 ${
                                            selectedColor === colorName
                                                ? 'border-rose-600 ring-2 ring-rose-100 ring-offset-1 scale-110'
                                                : 'border-slate-300 hover:border-slate-400 hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: colorName.toLowerCase() }}
                                        title={colorName}
                                    />
                                ))}
                                {colors.length > 4 && (
                                    <span className="text-[10px] font-semibold text-slate-500 self-center">+{colors.length - 4}</span>
                                )}
                            </div>
                        )}

                        {/* Rating */}
                        <div className="mt-2 flex items-center gap-1">
                            <StarRating rating={Number(product.rating ?? 0)} size="sm" />
                            <span className="text-[10px] font-semibold text-slate-400">({Number(product.rating ?? 0).toFixed(1)})</span>
                        </div>

                        {/* Price */}
                        <div className="mt-2 flex items-baseline gap-1.5">
                            <span className="text-[17px] font-black text-rose-700">{formatMoney(product.price)}</span>
                            {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                                <span className="text-[12px] text-slate-400 line-through">{formatMoney(product.compare_price)}</span>
                            )}
                        </div>

                        {/* Stock status text */}
                        <p className={`mt-1 text-[10px] font-bold ${stock > 5 ? 'text-emerald-600' : stock > 0 ? 'text-amber-600' : 'text-red-500'}`} role="status" aria-live="polite">
                            {stock > 5 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
                        </p>
                    </div>
                </Link>

                {/* Add to cart button - shows on hover (desktop) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 flex items-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                >
                    <motion.button
                        type="button"
                        disabled={stock <= 0 || addedToCart}
                        onClick={handleAddToCart}
                        whileTap={{ scale: 0.95 }}
                        className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg text-xs font-black transition-all duration-300 ${
                            addedToCart
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                                : stock > 0
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-200 hover:bg-rose-700'
                                : 'cursor-not-allowed bg-gray-100 text-gray-400'
                        }`}
                        aria-label={addedToCart ? 'Added to cart' : stock > 0 ? 'Add to cart' : 'Out of stock'}
                    >
                        {addedToCart ? (
                            <>
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                Added
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                Add to Cart
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </motion.article>
            {showQuickView && <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />}

            {/* Size Selection Modal */}
            {showSizeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-w-sm w-full rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-black text-slate-950">Select Size</h3>
                            <button
                                type="button"
                                onClick={() => setShowSizeModal(false)}
                                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-slate-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeSelect(size)}
                                    className={`h-12 rounded-xl border-2 text-sm font-black transition-all duration-300 ${
                                        selectedSize === size
                                            ? 'border-rose-600 bg-rose-50 text-rose-600 shadow-md'
                                            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:shadow-md'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Image Gallery Modal */}
            {showImageGallery && allImages.length > 1 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                    <button
                        type="button"
                        onClick={() => setShowImageGallery(false)}
                        className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <div className="relative max-w-2xl w-full">
                        <img
                            src={allImages[currentImageIndex]}
                            alt={`Gallery image ${currentImageIndex + 1}`}
                            className="w-full rounded-2xl"
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {allImages.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`h-2 w-2 rounded-full transition-all ${
                                        currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30"
                        >
                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30"
                        >
                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

const ProductCardMemo = memo(ProductCard);
export default ProductCardMemo;
