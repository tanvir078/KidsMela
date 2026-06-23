import { Link } from '@/lib/inertiaCompat';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';

function TrendingCard({ product, rank }) {
    const { addItem } = useCart();
    const { isSaved, toggleItem } = useWishlist();
    const saved = isSaved(product.id);
    const stock = Number(product.stock ?? 0);
    const discount = product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0;

    return (
        <div className="w-[160px] shrink-0 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-gray-100 lg:w-auto">
            <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-[4/5] bg-gray-50">
                    <span className="absolute left-1.5 top-1.5 z-10 grid h-6 w-6 place-items-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow">
                        #{rank}
                    </span>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(product); }}
                        className={`absolute right-1.5 top-1.5 z-10 grid h-7 w-7 place-items-center rounded-full shadow-sm transition-all ${
                            saved ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400'
                        }`}
                    >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.4-9.2-8.5C.7 8.6 3.1 4 7.4 4c2 0 3.5 1 4.6 2.4C13.1 5 14.6 4 16.6 4c4.3 0 6.7 4.6 4.6 8.5C19 16.6 12 21 12 21Z"/></svg>
                    </button>
                    {stock > 0 && stock <= 5 && (
                        <span className="absolute bottom-1.5 left-1.5 z-10 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            Only {stock} left
                        </span>
                    )}
                    {stock === 0 && (
                        <div className="absolute inset-0 z-10 grid place-items-center bg-black/40">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-700">Out of Stock</span>
                        </div>
                    )}
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <div className="grid h-full place-items-center">
                            <svg viewBox="0 0 24 24" className="h-10 w-10 text-gray-200" fill="none"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    )}
                </div>
            </Link>
            <div className="p-2.5">
                <p className="line-clamp-2 text-xs font-semibold leading-4 text-gray-800">{product.name}</p>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-slate-900">${Number(product.price).toFixed(2)}</span>
                    {discount > 0 && (
                        <span className="text-[10px] text-gray-400 line-through">${Number(product.compare_price).toFixed(2)}</span>
                    )}
                </div>
                {stock > 0 && (
                    <button
                        type="button"
                        onClick={() => addItem(product, 1)}
                        className="mt-2 h-7 w-full rounded-lg bg-rose-600 text-[11px] font-bold text-white transition-all active:scale-95 active:bg-rose-700"
                    >
                        Add Style
                    </button>
                )}
            </div>
        </div>
    );
}

export default function TrendingProducts({ products = [] }) {
    const trendingProducts = products
        .filter(p => Number(p.rating ?? 0) >= 3)
        .sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0))
        .slice(0, 10);

    if (trendingProducts.length === 0) return null;

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-rose-500" fill="currentColor"><path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/><path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/></svg>
                    <h2 className="text-base font-bold text-slate-900">Trending Styles</h2>
                </div>
                <Link href="/search" className="text-xs font-semibold text-orange-500">
                    View All →
                </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-5 lg:overflow-visible">
                {trendingProducts.map((product, index) => (
                    <TrendingCard key={product.id} product={product} rank={index + 1} />
                ))}
            </div>
        </div>
    );
}
