import { useState, useEffect } from 'react';
import { Link } from '@/lib/inertiaCompat';
import { useCart } from '@/Contexts/CartContext';

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
    const discount = product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : Math.floor(Math.random() * 30) + 10;
    const originalPrice = product.compare_price || (product.price * (1 + discount / 100)).toFixed(2);
    const stock = Number(product.stock ?? 0);
    const soldPercent = Math.min(95, Math.max(30, 100 - stock * 5));

    return (
        <div className="w-[140px] shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square bg-gray-50">
                    <span className="absolute left-1.5 top-1.5 z-10 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        -{discount}%
                    </span>
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <div className="grid h-full place-items-center">
                            <div className="text-center">
                                <svg viewBox="0 0 24 24" className="mx-auto h-8 w-8 text-gray-200" fill="none"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-2">
                    <p className="line-clamp-1 text-xs font-medium text-gray-800">{product.name}</p>
                    <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-orange-600">৳{Number(product.price).toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400 line-through">৳{Number(originalPrice).toLocaleString()}</span>
                    </div>
                    <div className="mt-1.5">
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
                                style={{ width: `${soldPercent}%` }}
                            />
                        </div>
                        <p className="mt-0.5 text-[9px] font-medium text-gray-400">{soldPercent}% sold</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default function FlashSale({ products = [] }) {
    const [endTime] = useState(() => getFlashSaleEndTime());
    const { hours, minutes, seconds } = useCountdown(endTime);
    const flashProducts = products.slice(0, 10);

    if (flashProducts.length === 0) return null;

    return (
        <div className="lg:hidden">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-orange-500" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        <h2 className="text-base font-bold text-slate-900">Flash Sale</h2>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="grid h-6 w-7 place-items-center rounded bg-slate-900 text-[11px] font-bold text-white">{String(hours).padStart(2, '0')}</span>
                        <span className="text-xs font-bold text-slate-900">:</span>
                        <span className="grid h-6 w-7 place-items-center rounded bg-slate-900 text-[11px] font-bold text-white">{String(minutes).padStart(2, '0')}</span>
                        <span className="text-xs font-bold text-slate-900">:</span>
                        <span className="grid h-6 w-7 place-items-center rounded bg-slate-900 text-[11px] font-bold text-white">{String(seconds).padStart(2, '0')}</span>
                    </div>
                </div>
                <Link href="/flash-sale" className="text-xs font-semibold text-orange-500">
                    সব দেখুন →
                </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {flashProducts.map((product) => (
                    <FlashProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
