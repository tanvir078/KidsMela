import { Link } from '@/lib/inertiaCompat';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useComparison } from '@/Contexts/ComparisonContext';
import { useCurrency } from '@/Contexts/CurrencyContext';
import { useState, useCallback, memo } from 'react';
import StarRating from './StarRating';
import QuickViewModal from './QuickViewModal';

function ProductCard({ product }) {
    const { addItem } = useCart();
    const { isSaved, toggleItem } = useWishlist();
    const { addToCompare, isInCompare, removeFromCompare } = useComparison();
    const { formatMoney } = useCurrency();
    const stock = Number(product.stock ?? 0);
    const saved = isSaved(product.id);
    const inCompare = isInCompare(product.id);
    const [showQuickView, setShowQuickView] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const sizes = Array.isArray(product.sizes)
        ? product.sizes
        : String(product.size || product.available_sizes || 'S,M,L').split(',').map((item) => item.trim()).filter(Boolean);
    const colors = Array.isArray(product.colors)
        ? product.colors
        : String(product.colors || product.color || product.colour || '').split(',').map((item) => item.trim()).filter(Boolean);
    const color = colors.slice(0, 2).join(' / ') || product.category || 'Style';
    const displayImage = product.display_image_url || product.image_url;

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
        addItem(product, 1);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 1500);
    }, [addItem, product]);

    return (
        <>
            <article className="group relative overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-100 transition-shadow duration-200 hover:shadow-md">
                {/* Wishlist button */}
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(product); }}
                    className={`absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full shadow-sm transition-all duration-200 active:scale-90 ${
                        saved ? 'bg-rose-600 text-white' : 'bg-white/90 text-slate-400 hover:text-rose-500'
                    }`}
                    aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-pressed={saved}
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M12 21s-7-4.4-9.2-8.5C.7 8.6 3.1 4 7.4 4c2 0 3.5 1 4.6 2.4C13.1 5 14.6 4 16.6 4c4.3 0 6.7 4.6 4.6 8.5C19 16.6 12 21 12 21Z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <Link href={`/products/${product.id}`} className="block">
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-rose-50">
                        <span className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-rose-700 shadow-sm">
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
                        <p className="line-clamp-2 min-h-[34px] text-[13px] font-black leading-[17px] text-slate-900">
                            {product.name}
                        </p>

                        <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] font-bold text-slate-500">
                            <span className="truncate">{color}</span>
                            <span className="shrink-0">{sizes.slice(0, 3).join('/')}</span>
                        </div>

                        {/* Rating */}
                        <div className="mt-1.5 flex items-center gap-1">
                            <StarRating rating={Number(product.rating ?? 0)} size="sm" />
                            <span className="text-[10px] font-semibold text-slate-400">({Number(product.rating ?? 0).toFixed(1)})</span>
                        </div>

                        {/* Price */}
                        <div className="mt-1.5 flex items-baseline gap-1.5">
                            <span className="text-[16px] font-black text-rose-700">{formatMoney(product.price)}</span>
                            {product.sale_price && Number(product.sale_price) > Number(product.price) && (
                                <span className="text-[11px] text-slate-400 line-through">{formatMoney(product.sale_price)}</span>
                            )}
                        </div>

                        {/* Stock status text */}
                        <p className={`mt-0.5 text-[10px] font-bold ${stock > 5 ? 'text-emerald-600' : stock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
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
                        className={`flex h-9 w-full items-center justify-center gap-1.5 rounded-md text-xs font-black transition-all duration-200 active:scale-[0.97] ${
                            addedToCart
                                ? 'bg-emerald-500 text-white'
                                : stock > 0
                                ? 'bg-rose-600 text-white hover:bg-rose-700'
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
                                Choose Style
                            </>
                        )}
                    </button>
                </div>
            </article>
            {showQuickView && <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />}
        </>
    );
}

const ProductCardMemo = memo(ProductCard);
export default ProductCardMemo;
