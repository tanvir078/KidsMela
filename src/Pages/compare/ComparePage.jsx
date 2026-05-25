import { Head, Link } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useComparison } from '@/Contexts/ComparisonContext';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';
import StarRating from '@/Components/Storefront/StarRating';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function ComparePage() {
    const { items, removeFromCompare, clearComparison } = useComparison();
    const { addItem } = useCart();
    const { toggleItem, isSaved } = useWishlist();

    if (items.length === 0) {
        return (
            <MobileShell title="Compare" showSearch={false}>
                <Head title="Compare Products" />
                <section className="space-y-4 px-4 py-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-5 text-white shadow-xl shadow-blue-200">
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                        <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                        <div className="relative">
                            <h1 className="text-2xl font-black">Product Comparison</h1>
                            <p className="mt-1 text-sm font-semibold text-white/90">
                                Compare up to 3 products side by side
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-200">
                            <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-400" fill="none" aria-hidden="true">
                                <path d="M8 7h12M8 12h8m-4 5h4m-6 0H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className="mt-5 text-xl font-black text-slate-950">No products to compare</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            Add products from the store to compare them
                        </p>
                        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:bg-blue-700 active:scale-95">
                            Browse Products
                        </Link>
                    </div>
                </section>
            </MobileShell>
        );
    }

    return (
        <MobileShell title="Compare" showSearch={false}>
            <Head title="Compare Products" />
            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-5 text-white shadow-xl shadow-blue-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black">Product Comparison</h1>
                            <p className="mt-1 text-sm font-semibold text-white/90">
                                Comparing {items.length} product{items.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={clearComparison}
                            className="rounded-full bg-white/20 px-4 py-2 text-sm font-black transition-all duration-200 hover:bg-white/30 active:scale-95"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto pb-4">
                    <div className="grid min-w-[600px] gap-4" style={{ gridTemplateColumns: `repeat(${items.length + 1}, minmax(0, 1fr))` }}>
                        <div className="space-y-3">
                            <div className="h-10" />
                            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                <p className="text-xs font-black text-slate-500 uppercase">Feature</p>
                            </div>
                            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                <p className="text-xs font-black text-slate-500 uppercase">Image</p>
                            </div>
                            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                <p className="text-xs font-black text-slate-500 uppercase">Price</p>
                            </div>
                            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                <p className="text-xs font-black text-slate-500 uppercase">Rating</p>
                            </div>
                            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                <p className="text-xs font-black text-slate-500 uppercase">Stock</p>
                            </div>
                            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                <p className="text-xs font-black text-slate-500 uppercase">Category</p>
                            </div>
                            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                <p className="text-xs font-black text-slate-500 uppercase">Description</p>
                            </div>
                            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                <p className="text-xs font-black text-slate-500 uppercase">Actions</p>
                            </div>
                        </div>

                        {items.map((product) => (
                            <div key={product.id} className="space-y-3">
                                <div className="relative h-10">
                                    <button
                                        type="button"
                                        onClick={() => removeFromCompare(product.id)}
                                        className="absolute right-0 top-0 grid h-8 w-8 place-items-center rounded-full bg-red-100 text-red-600 transition-all duration-200 hover:bg-red-200 active:scale-95"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                    <Link href={`/products/${product.id}`} className="block">
                                        <p className="text-sm font-black text-slate-950 line-clamp-2">{product.name}</p>
                                    </Link>
                                </div>
                                <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="grid h-full place-items-center text-xs font-bold text-slate-400">No img</div>
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                    <p className="text-lg font-black text-orange-600">{money(product.price)}</p>
                                </div>
                                <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                    <StarRating rating={Number(product.rating ?? 0)} size="sm" />
                                </div>
                                <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                    <p className={`text-sm font-bold ${Number(product.stock ?? 0) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {Number(product.stock ?? 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                    <p className="text-sm font-semibold text-slate-700">{product.category || 'N/A'}</p>
                                </div>
                                <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                    <p className="text-xs font-medium text-slate-600 line-clamp-4">{product.description || 'No description'}</p>
                                </div>
                                <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                    <div className="space-y-2">
                                        <button
                                            type="button"
                                            onClick={() => addItem(product, 1)}
                                            disabled={Number(product.stock ?? 0) <= 0}
                                            className="w-full rounded-xl bg-orange-600 px-3 py-2 text-xs font-black text-white transition-all duration-200 hover:bg-orange-700 active:scale-95 disabled:bg-slate-300"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => toggleItem(product)}
                                            className={`w-full rounded-xl px-3 py-2 text-xs font-black transition-all duration-200 active:scale-95 ${
                                                isSaved(product.id) ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                            {isSaved(product.id) ? '♥ Saved' : '♥ Save'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MobileShell>
    );
}
