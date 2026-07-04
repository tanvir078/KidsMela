import { useState, useEffect } from 'react';
import { Link } from '@/lib/inertiaCompat';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

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
    const discount = product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : Math.floor(Math.random() * 30) + 10;
    const originalPrice = product.compare_price || (product.price * (1 + discount / 100)).toFixed(2);
    const stock = Number(product.stock ?? 0);
    const soldPercent = Math.min(95, Math.max(30, 100 - stock * 5));

    return (
        <div className="w-[140px] shrink-0 overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-100 transition-all duration-300 hover:shadow-xl hover:scale-105">
            <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square bg-slate-50">
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-rose-600 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                        -{discount}%
                    </span>
                    {stock <= 5 && stock > 0 && (
                        <span className="absolute top-2 right-2 z-10 rounded-full bg-amber-500 px-2 py-1 text-[9px] font-bold text-white shadow-lg">
                            Only {stock}!
                        </span>
                    )}
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy" />
                    ) : (
                        <div className="grid h-full place-items-center">
                            <div className="text-center">
                                <svg viewBox="0 0 24 24" className="mx-auto h-8 w-8 text-slate-200" fill="none"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <p className="line-clamp-2 min-h-[32px] text-[11px] font-semibold leading-4 text-slate-700">{product.name}</p>
                    <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-rose-600">${Number(product.price).toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400 line-through">${Number(originalPrice).toFixed(2)}</span>
                    </div>
                    <div className="mt-2">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 transition-all duration-500"
                                style={{ width: `${soldPercent}%` }}
                            />
                        </div>
                        <p className="mt-1 text-[9px] font-bold text-slate-500">{soldPercent}% sold</p>
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
        <>
            {/* Mobile Flash Sale */}
            <div className="lg:hidden">
                <div className="overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-700 shadow-lg">
                    <div className="flex h-10 items-center justify-between px-3 text-white">
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-5 w-5 text-yellow-300" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            <h2 className="text-sm font-black uppercase tracking-wide">Flash Sale</h2>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="grid h-7 min-w-7 place-items-center rounded-lg bg-slate-950 px-1.5 text-[11px] font-black text-white">{String(hours).padStart(2, '0')}</span>
                            <span className="text-xs font-black text-white">:</span>
                            <span className="grid h-7 min-w-7 place-items-center rounded-lg bg-slate-950 px-1.5 text-[11px] font-black text-white">{String(minutes).padStart(2, '0')}</span>
                            <span className="text-xs font-black text-white">:</span>
                            <span className="grid h-7 min-w-7 place-items-center rounded-lg bg-slate-950 px-1.5 text-[11px] font-black text-white">{String(seconds).padStart(2, '0')}</span>
                        </div>
                        <Link href="/flash-sale" className="text-[10px] font-black text-white/90">
                            View All
                        </Link>
                    </div>
                    <div className="flex gap-3 overflow-x-auto bg-white p-3 scrollbar-hide">
                        {flashProducts.map((product) => (
                            <FlashProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Flash Sale */}
            <section className="hidden lg:block">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-6 w-6 text-rose-600" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            <h2 className="text-3xl font-black text-slate-900">Flash Sale</h2>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2">
                            <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-slate-900 px-2 text-sm font-black text-white">{String(hours).padStart(2, '0')}</span>
                            <span className="text-sm font-black text-slate-600">:</span>
                            <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-slate-900 px-2 text-sm font-black text-white">{String(minutes).padStart(2, '0')}</span>
                            <span className="text-sm font-black text-slate-600">:</span>
                            <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-slate-900 px-2 text-sm font-black text-white">{String(seconds).padStart(2, '0')}</span>
                        </div>
                    </div>
                    <Link href="/flash-sale" className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors">
                        View All →
                    </Link>
                </div>
                <Swiper
                    modules={[Autoplay, Navigation]}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    navigation={true}
                    slidesPerView={6}
                    spaceBetween={20}
                    className="pb-8"
                >
                    {flashProducts.map((product) => (
                        <SwiperSlide key={product.id}>
                            <FlashProductCard product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
        </>
    );
}
