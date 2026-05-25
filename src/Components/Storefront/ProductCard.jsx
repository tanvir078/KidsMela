import { Link } from '@/lib/inertiaCompat';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useComparison } from '@/Contexts/ComparisonContext';
import { useState } from 'react';
import StarRating from './StarRating';
import QuickViewModal from './QuickViewModal';

function money(value) {
    return `৳${Number(value ?? 0).toLocaleString()}`;
}

export default function ProductCard({ product }) {
    const { addItem } = useCart();
    const { isSaved, toggleItem } = useWishlist();
    const { addToCompare, isInCompare, removeFromCompare } = useComparison();
    const stock = Number(product.stock ?? 0);
    const saved = isSaved(product.id);
    const inCompare = isInCompare(product.id);
    const [showQuickView, setShowQuickView] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const discount = product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0;

    const handleCompare = (e) => {
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
    };

    const handleAddToCart = () => {
        addItem(product, 1);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 1500);
    };

    return (
        <>
            <article className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow duration-200 hover:shadow-md">
                {/* Wishlist button */}
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(product); }}
                    className={`absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full shadow-sm transition-all duration-200 active:scale-90 ${
                        saved ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-400'
                    }`}
                    aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M12 21s-7-4.4-9.2-8.5C.7 8.6 3.1 4 7.4 4c2 0 3.5 1 4.6 2.4C13.1 5 14.6 4 16.6 4c4.3 0 6.7 4.6 4.6 8.5C19 16.6 12 21 12 21Z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <Link href={`/products/${product.id}`} className="block">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                        {/* Discount badge */}
                        {discount > 0 && (
                            <span className="absolute left-0 top-3 z-10 rounded-r-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                                -{discount}%
                            </span>
                        )}

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

                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                    <div className="p-2.5">
                        <p className="line-clamp-2 min-h-[32px] text-[12px] font-semibold leading-4 text-gray-800">
                            {product.name}
                        </p>

                        {/* Rating */}
                        <div className="mt-1 flex items-center gap-1">
                            <StarRating rating={Number(product.rating ?? 0)} size="sm" />
                            <span className="text-[10px] text-gray-400">({Number(product.rating ?? 0).toFixed(1)})</span>
                        </div>

                        {/* Price */}
                        <div className="mt-1.5 flex items-baseline gap-1.5">
                            <span className="text-[15px] font-bold text-slate-900">{money(product.price)}</span>
                            {discount > 0 && (
                                <span className="text-[11px] text-gray-400 line-through">{money(product.compare_price)}</span>
                            )}
                        </div>

                        {/* Stock status text */}
                        <p className={`mt-0.5 text-[10px] font-medium ${stock > 5 ? 'text-emerald-500' : stock > 0 ? 'text-amber-500' : 'text-red-400'}`}>
                            {stock > 5 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
                        </p>
                    </div>
                </Link>

                {/* Add to cart button */}
                <div className="px-2.5 pb-2.5">
                    <button
                        type="button"
                        disabled={stock <= 0 || addedToCart}
                        onClick={handleAddToCart}
                        className={`flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-[0.97] ${
                            addedToCart
                                ? 'bg-emerald-500 text-white'
                                : stock > 0
                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                : 'cursor-not-allowed bg-gray-100 text-gray-400'
                        }`}
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
                    </button>
                </div>
            </article>
            {showQuickView && <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />}
        </>
    );
}
