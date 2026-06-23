import { useState } from 'react';
import { Link } from '@/lib/inertiaCompat';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useCurrency } from '@/Contexts/CurrencyContext';
import StarRating from './StarRating';

export default function QuickViewModal({ product, onClose }) {
    const { addItem } = useCart();
    const { isSaved, toggleItem } = useWishlist();
    const { formatMoney } = useCurrency();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const saved = isSaved(product.id);

    const handleAdd = () => {
        addItem(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-95"
                >
                    ✕
                </button>

                <div className="p-6">
                    <div className="flex gap-4">
                        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="grid h-full place-items-center text-xs font-bold text-slate-400">No image</div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-black text-slate-950 line-clamp-2">{product.name}</h3>
                            <p className="mt-1 text-xs font-bold text-slate-500">{product.category || 'Featured'}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <StarRating rating={Number(product.rating ?? 0)} size="sm" />
                                <span className="text-xs font-bold text-slate-500">({product.reviews_count ?? 0})</span>
                            </div>
                            <p className="mt-2 text-2xl font-black text-orange-600">{formatMoney(product.price)}</p>
                        </div>
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-600 line-clamp-3">{product.description}</p>

                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-10 items-center rounded-xl bg-slate-100 px-1">
                            <button
                                type="button"
                                onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                                className="grid h-8 w-8 place-items-center rounded-lg bg-white font-black transition-all duration-200 hover:bg-slate-50 active:scale-95"
                            >
                                -
                            </button>
                            <span className="w-8 text-center text-sm font-black">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity((v) => v + 1)}
                                className="grid h-8 w-8 place-items-center rounded-lg bg-white font-black transition-all duration-200 hover:bg-slate-50 active:scale-95"
                            >
                                +
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => toggleItem(product)}
                            className={`h-10 w-10 rounded-full text-xl transition-all duration-200 active:scale-95 ${
                                saved ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                        >
                            ♥
                        </button>
                    </div>

                    {added && (
                        <div className="mt-3 rounded-xl bg-emerald-100 px-4 py-2 text-center text-sm font-black text-emerald-700">
                            Added to cart!
                        </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={Number(product.stock ?? 0) <= 0}
                            className="h-12 rounded-2xl bg-orange-600 text-sm font-black text-white transition-all duration-200 hover:bg-orange-700 active:scale-95 disabled:bg-slate-300"
                        >
                            Add to Cart
                        </button>
                        <Link
                            href={`/products/${product.id}`}
                            onClick={onClose}
                            className="flex h-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
