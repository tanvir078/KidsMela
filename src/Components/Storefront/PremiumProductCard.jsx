import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from '@/lib/inertiaCompat';
import { useWishlist } from '@/Contexts/WishlistContext';

export default function PremiumProductCard({ product }) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [showSizeSheet, setShowSizeSheet] = useState(false);
    const containerRef = useRef(null);

    const images = product.images || [product.image_path].filter(Boolean);
    const hasMultipleImages = images.length > 1;
    const isWishlisted = isInWishlist(product.id);
    const hasDiscount = product.discount_price && product.discount_price < product.price;

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowSizeSheet(true);
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const addToCartVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            ref={containerRef}
        >
            <Link href={`/products/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    {/* Badge */}
                    {product.badge && (
                        <div className="absolute top-3 left-3 z-20 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg ring-2 ring-white">
                            {product.badge}
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-3 right-3 z-20 grid h-8 w-8 place-items-center rounded-full shadow-lg ring-2 ring-white transition-all ${
                            isWishlisted
                                ? 'bg-rose-500 text-white'
                                : 'bg-white text-slate-400 hover:text-rose-500'
                        }`}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    {/* Images */}
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={images[currentImageIndex] || '/placeholder.jpg'}
                            alt={product.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            loading="lazy"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            srcSet={images[currentImageIndex] ? `
                                ${images[currentImageIndex]}?w=300 300w,
                                ${images[currentImageIndex]}?w=500 500w,
                                ${images[currentImageIndex]}?w=800 800w
                            ` : undefined}
                            className="h-full w-full object-cover"
                        />
                    </AnimatePresence>

                    {/* Image Navigation (Desktop) */}
                    {hasMultipleImages && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-slate-700 opacity-0 transition-all hover:bg-white group-hover:opacity-100 lg:opacity-0"
                                aria-label="Previous image"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-slate-700 opacity-0 transition-all hover:bg-white group-hover:opacity-100 lg:opacity-0"
                                aria-label="Next image"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Image Dots */}
                    {hasMultipleImages && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCurrentImageIndex(index);
                                    }}
                                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Add to Cart Button (Reveal on Hover) */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                variants={addToCartVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="absolute bottom-0 left-0 right-0 z-20 p-3"
                            >
                                <button
                                    onClick={handleAddToCart}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Add to Cart
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Product Info */}
                <div className="mt-3 space-y-1">
                    {/* Title */}
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-slate-700 transition-colors">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        {hasDiscount ? (
                            <>
                                <span className="text-sm font-bold text-slate-900">
                                    ${product.discount_price}
                                </span>
                                <span className="text-xs font-medium text-slate-400 line-through">
                                    ${product.price}
                                </span>
                            </>
                        ) : (
                            <span className="text-sm font-bold text-slate-900">
                                ${product.price}
                            </span>
                        )}
                    </div>

                    {/* Color/Variant Selector */}
                    {product.variants && product.variants.length > 0 ? (
                        <div className="flex gap-1.5 pt-1">
                            {product.variants
                                .filter((v, index, self) => 
                                    index === self.findIndex((t) => t.color?.id === v.color?.id)
                                )
                                .slice(0, 4)
                                .map((variant, index) => (
                                    <button
                                        key={variant.id}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (variant.images?.[0]?.image) {
                                                const variantImage = `http://127.0.0.1:8000/storage/${variant.images[0].image}`;
                                                const imageIndex = images.indexOf(variantImage);
                                                if (imageIndex !== -1) setCurrentImageIndex(imageIndex);
                                            }
                                        }}
                                        className={`h-4 w-4 rounded-full border-2 transition-all ${
                                            currentImageIndex === index
                                                ? 'border-slate-900'
                                                : 'border-slate-200 hover:border-slate-400'
                                        }`}
                                        style={{ backgroundColor: variant.color?.hex_code || '#e5e7eb' }}
                                        title={variant.color?.name || 'Color'}
                                        aria-label={`Select ${variant.color?.name}`}
                                    />
                                ))}
                            {product.variants.length > 4 && (
                                <span className="text-xs font-medium text-slate-500">
                                    +{product.variants.length - 4}
                                </span>
                            )}
                        </div>
                    ) : product.colors && product.colors.length > 0 ? (
                        <div className="flex gap-1.5 pt-1">
                            {product.colors.slice(0, 4).map((color, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (images[index]) setCurrentImageIndex(index);
                                    }}
                                    className={`h-4 w-4 rounded-full border-2 transition-all ${
                                        index === currentImageIndex
                                            ? 'border-slate-900'
                                            : 'border-slate-200 hover:border-slate-400'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                    aria-label={`Select ${color}`}
                                />
                            ))}
                            {product.colors.length > 4 && (
                                <span className="text-xs font-medium text-slate-500">
                                    +{product.colors.length - 4}
                                </span>
                            )}
                        </div>
                    ) : null}
                </div>
            </Link>

            {/* Size Sheet */}
            <AnimatePresence>
                {showSizeSheet && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mx-4 max-w-md w-full rounded-2xl bg-white p-6 shadow-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <img
                                    src={images[currentImageIndex] || '/placeholder.jpg'}
                                    alt={product.name}
                                    className="h-24 w-24 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900">{product.name}</h3>
                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                        ${hasDiscount ? product.discount_price : product.price}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="mb-3 text-sm font-bold text-slate-900">Select Size</h4>
                                <div className="grid grid-cols-5 gap-2">
                                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                        <button
                                            key={size}
                                            className="rounded-lg border-2 border-slate-200 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-slate-900 hover:bg-slate-50"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setShowSizeSheet(false)}
                                    className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSizeSheet(false);
                                        // Add to cart logic here
                                    }}
                                    className="flex-1 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
