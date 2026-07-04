import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useState, useMemo } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import SkeletonLoader from '@/Components/Storefront/SkeletonLoader';
import { useCart } from '@/Contexts/CartContext';
import { getProducts } from '@/services/products';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

function getFlashSaleEndTime() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return end;
}

function useCountdown(endDate) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const tick = () => {
            const diff = endDate - new Date();
            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [endDate]);

    return timeLeft;
}

function FlashProductCard({ product }) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);
    const discount = product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : Math.floor(Math.random() * 30) + 10;
    const originalPrice = product.compare_price || (product.price * (1 + discount / 100)).toFixed(0);
    const stock = Number(product.stock ?? 0);
    const soldPercent = Math.min(95, Math.max(30, 100 - stock * 5));

    const handleAdd = () => {
        addItem(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md">
            <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square bg-slate-50">
                    <span className="absolute left-0 top-3 z-10 rounded-r-full bg-red-500 px-2.5 py-0.5 text-xs font-black text-white shadow-sm">
                        -{discount}%
                    </span>
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <div className="grid h-full place-items-center">
                            <svg viewBox="0 0 24 24" className="h-10 w-10 text-slate-200" fill="none"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    )}
                    {stock === 0 && (
                        <div className="absolute inset-0 z-10 grid place-items-center bg-black/40">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-red-600">Out of Stock</span>
                        </div>
                    )}
                </div>
            </Link>
            <div className="p-3">
                <Link href={`/products/${product.id}`}>
                    <p className="line-clamp-2 text-sm font-bold text-slate-800">{product.name}</p>
                </Link>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-black text-orange-600">{money(product.price)}</span>
                    <span className="text-xs text-slate-400 line-through">{money(originalPrice)}</span>
                </div>
                <div className="mt-2">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
                            style={{ width: `${soldPercent}%` }}
                        />
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400">{soldPercent}% sold</p>
                        {stock > 0 && stock <= 5 && (
                            <p className="text-[10px] font-bold text-amber-600">Only {stock} left!</p>
                        )}
                    </div>
                </div>
                <button
                    type="button"
                    disabled={stock === 0}
                    onClick={handleAdd}
                    className={`mt-2 h-9 w-full rounded-xl text-xs font-black transition-all duration-200 active:scale-95 ${
                        added
                            ? 'bg-emerald-500 text-white'
                            : stock === 0
                                ? 'bg-slate-100 text-slate-400'
                                : 'bg-orange-600 text-white shadow-sm shadow-orange-200 hover:bg-orange-700'
                    }`}
                >
                    {added ? '✓ Added' : stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}

export default function FlashSalePage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('discount');
    const [endTime] = useState(() => getFlashSaleEndTime());
    const { hours, minutes, seconds } = useCountdown(endTime);

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .finally(() => setIsLoading(false));
    }, []);

    const flashProducts = useMemo(() => {
        let list = [...products];

        if (sortBy === 'discount') {
            list.sort((a, b) => {
                const discA = a.compare_price ? ((a.compare_price - a.price) / a.compare_price) : 0;
                const discB = b.compare_price ? ((b.compare_price - b.price) / b.compare_price) : 0;
                return discB - discA;
            });
        } else if (sortBy === 'price-low') {
            list.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'price-high') {
            list.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === 'ending') {
            list.sort((a, b) => Number(a.stock ?? 0) - Number(b.stock ?? 0));
        }

        return list;
    }, [products, sortBy]);

    return (
        <MobileShell title="Flash Sale" showSearch={false} simpleHeader={true}>
            <Head title="Flash Sale" />
            <section className="space-y-4 px-4 py-4">
                {/* Flash Sale Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="absolute left-4 top-4 animate-pulse text-4xl">⚡</div>
                    <div className="relative ml-10">
                        <h1 className="text-2xl font-black">Flash Sale</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Today's special offers — limited time!
                        </p>
                    </div>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 p-4">
                    <span className="text-sm font-bold text-white/60">Ends in</span>
                    <div className="flex items-center gap-1">
                        <span className="grid h-10 w-12 place-items-center rounded-lg bg-white/10 text-lg font-black text-white">
                            {String(hours).padStart(2, '0')}
                        </span>
                        <span className="text-lg font-black text-orange-400">:</span>
                        <span className="grid h-10 w-12 place-items-center rounded-lg bg-white/10 text-lg font-black text-white">
                            {String(minutes).padStart(2, '0')}
                        </span>
                        <span className="text-lg font-black text-orange-400">:</span>
                        <span className="grid h-10 w-12 place-items-center rounded-lg bg-white/10 text-lg font-black text-white">
                            {String(seconds).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-sm font-bold text-white/60">later</span>
                </div>

                {/* Sort Options */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {[
                        { value: 'discount', label: 'Best Discount' },
                        { value: 'price-low', label: 'Low Price' },
                        { value: 'price-high', label: 'High Price' },
                        { value: 'ending', label: 'Ending Soon' },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setSortBy(opt.value)}
                            className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition-all duration-200 ${
                                sortBy === opt.value
                                    ? 'bg-red-500 text-white shadow-sm'
                                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Products */}
                {isLoading ? (
                    <SkeletonLoader type="card" count={6} />
                ) : flashProducts.length === 0 ? (
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-orange-100 text-3xl">
                            ⚡
                        </div>
                        <h2 className="mt-4 text-lg font-black text-slate-950">No flash sale products</h2>
                        <Link href="/" className="mt-4 inline-flex rounded-2xl bg-orange-600 px-5 py-2.5 text-sm font-black text-white">
                            Go Home
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-sm font-bold text-slate-500">{flashProducts.length} products</p>
                        <div className="grid grid-cols-2 gap-3">
                            {flashProducts.map((product) => (
                                <FlashProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </MobileShell>
    );
}
