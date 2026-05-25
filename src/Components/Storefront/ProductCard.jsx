import { Link } from '@/lib/inertiaCompat';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useComparison } from '@/Contexts/ComparisonContext';
import { useState } from 'react';
import StarRating from './StarRating';
import QuickViewModal from './QuickViewModal';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

const BADGES = {
    new: { label: 'NEW', color: 'bg-emerald-500' },
    sale: { label: 'SALE', color: 'bg-red-500' },
    bestseller: { label: 'BEST', color: 'bg-amber-500' },
};

export default function ProductCard({ product }) {
    const { addItem } = useCart();
    const { isSaved, toggleItem } = useWishlist();
    const { addToCompare, isInCompare, removeFromCompare } = useComparison();
    const stock = Number(product.stock ?? 0);
    const saved = isSaved(product.id);
    const inCompare = isInCompare(product.id);
    const [showQuickView, setShowQuickView] = useState(false);

    const badge = product.badge ? BADGES[product.badge] : null;

    const handleCompare = () => {
        if (inCompare) {
            removeFromCompare(product.id);
        } else {
            const added = addToCompare(product);
            if (!added) {
                alert('You can compare up to 3 products at a time');
            }
        }
    };

    return (
        <>
            <article className="relative overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                <button
                    type="button"
                    onClick={() => toggleItem(product)}
                    className={`absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full shadow-md transition-all duration-200 active:scale-95 ${
                        saved ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-white text-slate-500 hover:bg-slate-100'
                    }`}
                    aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    ♥
                </button>
                <button
                    type="button"
                    onClick={handleCompare}
                    className={`absolute left-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full shadow-md transition-all duration-200 active:scale-95 ${
                        inCompare ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-slate-500 hover:bg-slate-100'
                    }`}
                    aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
                >
                    ⚖️
                </button>
                <button
                    type="button"
                    onClick={() => setShowQuickView(true)}
                    className="absolute bottom-2 right-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-white shadow-md transition-all duration-200 hover:bg-slate-800 active:scale-95"
                    aria-label="Quick view"
                >
                    👁️
                </button>
                <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200">
                        {badge && (
                            <div className={`absolute left-2 top-2 z-10 rounded-full px-2 py-1 text-[10px] font-black text-white ${badge.color}`}>
                                {badge.label}
                            </div>
                        )}
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="grid h-full place-items-center">
                                <div className="text-center">
                                    <svg viewBox="0 0 24 24" className="mx-auto h-12 w-12 text-slate-300" fill="none" aria-hidden="true">
                                        <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <p className="mt-2 text-xs font-semibold text-slate-400">No image</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-1.5 p-2.5">
                        <p className="line-clamp-2 min-h-10 text-[13px] font-bold leading-5 text-slate-900">
                            {product.name}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-base font-black text-orange-600">{money(product.price)}</p>
                            <div className="flex items-center gap-1">
                                <StarRating rating={Number(product.rating ?? 0)} size="sm" />
                            </div>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500">
                            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                        </p>
                    </div>
                </Link>
                <div className="px-2.5 pb-2.5">
                    <button
                        type="button"
                        disabled={stock <= 0}
                        onClick={() => addItem(product, 1)}
                        className="h-9 w-full rounded-md bg-slate-950 text-xs font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300 disabled:active:scale-100"
                    >
                        Add to Cart
                    </button>
                </div>
            </article>
            {showQuickView && <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />}
        </>
    );
}
