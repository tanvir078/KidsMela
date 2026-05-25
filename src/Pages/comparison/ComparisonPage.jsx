import { Head, Link } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useComparison } from '@/Contexts/ComparisonContext';
import StarRating from '@/Components/Storefront/StarRating';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function ComparisonPage() {
    const { compareList, removeFromCompare, clearCompare } = useComparison();

    return (
        <MobileShell title="Compare Products" showSearch={false}>
            <Head title="Compare Products" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black">Compare Products</h1>
                            <p className="mt-1 text-sm font-semibold text-white/90">
                                {compareList.length} product{compareList.length !== 1 ? 's' : ''} selected
                            </p>
                        </div>
                        {compareList.length > 0 && (
                            <button
                                type="button"
                                onClick={clearCompare}
                                className="rounded-full bg-white/20 px-4 py-2 text-sm font-black transition-all duration-200 hover:bg-white/30 active:scale-95"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {compareList.length === 0 ? (
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-200">
                            <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-400" fill="none" aria-hidden="true">
                                <path d="M8 7h12M8 12h8m-4 5h4M4 7h.01M4 12h.01M4 17h.01M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className="mt-5 text-xl font-black text-slate-950">No products to compare</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            Add products from the store to compare them side by side.
                        </p>
                        <Link href="/" className="mt-5 inline-flex rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {compareList.map((product) => (
                            <div key={product.id} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-black text-slate-950">{product.name}</h3>
                                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-black text-orange-700">
                                                {product.category || 'Featured'}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <StarRating rating={Number(product.rating ?? 0)} size="sm" />
                                            <span className="text-xs font-bold text-slate-500">
                                                ({product.reviews_count ?? 0} reviews)
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFromCompare(product.id)}
                                        className="rounded-full bg-red-50 p-2 text-red-600 transition-all duration-200 hover:bg-red-100 active:scale-95"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-semibold text-slate-500">Price</p>
                                        <p className="mt-1 text-lg font-black text-orange-600">{money(product.price)}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-500">Stock</p>
                                        <p className={`mt-1 font-black ${Number(product.stock ?? 0) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {Number(product.stock ?? 0) > 0 ? `${product.stock} available` : 'Out of stock'}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="font-semibold text-slate-500">Description</p>
                                        <p className="mt-1 text-slate-700 line-clamp-2">{product.description}</p>
                                    </div>
                                </div>

                                <Link
                                    href={`/products/${product.id}`}
                                    className="mt-4 block w-full rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </MobileShell>
    );
}
