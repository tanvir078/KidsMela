import { Head, Link } from '@/lib/inertiaCompat';
import { useState, useMemo } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import { useWishlist } from '@/Contexts/WishlistContext';
import { useCart } from '@/Contexts/CartContext';
import { useToast } from '@/Contexts/ToastContext';

export default function WishlistPage() {
    const { items } = useWishlist();
    const { addToast } = useToast();
    const [copied, setCopied] = useState(false);
    const [sortBy, setSortBy] = useState('date');

    const sortedItems = useMemo(() => {
        const sorted = [...items];
        if (sortBy === 'price-low') {
            sorted.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'price-high') {
            sorted.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === 'name') {
            sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }
        return sorted;
    }, [items, sortBy]);

    const handleShareWishlist = () => {
        const wishlistUrl = typeof window !== 'undefined' ? window.location.href : '';
        const shareText = `Check out my wishlist on Kids Mela! ${items.length} items saved.`;

        if (navigator.share) {
            navigator.share({
                title: 'My Wishlist',
                text: shareText,
                url: wishlistUrl,
            });
        } else {
            navigator.clipboard.writeText(wishlistUrl);
            setCopied(true);
            addToast('Wishlist link copied!', 'success');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <MobileShell title="Wishlist">
            <Head title="Wishlist" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-rose-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                                    Saved Products
                                </p>
                                <h1 className="mt-2 text-2xl font-black">Wishlist</h1>
                                <p className="mt-1 text-sm font-semibold text-white/90">
                                    {items.length} item{items.length !== 1 ? 's' : ''} saved
                                </p>
                            </div>
                            {items.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleShareWishlist}
                                    className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-lg transition-all duration-200 hover:bg-white/30 active:scale-95"
                                    title="Share Wishlist"
                                >
                                    📤
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                {items.length > 0 && (
                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="h-10 rounded-xl border-slate-200 px-3 text-sm font-bold focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name</option>
                            </select>
                        </div>
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-pink-100 p-8 text-center shadow-sm ring-1 ring-rose-200">
                        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-white">
                            <svg viewBox="0 0 24 24" className="h-12 w-12 text-rose-600" fill="currentColor" aria-hidden="true">
                                <path d="M12 21s-7-4.4-9.2-8.5C.7 8.6 3.1 4 7.4 4c2 0 3.5 1 4.6 2.4C13.1 5 14.6 4 16.6 4c4.3 0 6.7 4.6 4.6 8.5C19 16.6 12 21 12 21Z"/>
                            </svg>
                        </div>
                        <h2 className="mt-5 text-xl font-black text-slate-950">No saved products yet</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            Tap the heart on any product to save it here.
                        </p>
                        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-rose-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all duration-200 hover:bg-rose-700 active:scale-95">
                            Shop Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {sortedItems.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </MobileShell>
    );
}
