import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PremiumProductCard from './PremiumProductCard';

export default function RecentlyViewedSlider({ products }) {
    const scrollRef = useRef(null);
    const canScrollLeft = false;
    const canScrollRight = false;

    if (!products || products.length === 0) {
        return null;
    }

    const scroll = (direction) => {
        if (!scrollRef.current) return;

        const scrollAmount = direction === 'left' ? -400 : 400;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <section className="py-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900">Recently Viewed</h2>
                <div className="hidden lg:flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="grid h-10 w-10 place-items-center rounded-full border-2 border-slate-200 text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="grid h-10 w-10 place-items-center rounded-full border-2 border-slate-200 text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            >
                {products.slice(0, 8).map((product) => (
                    <div
                        key={product.id}
                        className="shrink-0 snap-start"
                        style={{
                            width: 'calc(50% - 12px)',
                        }}
                    >
                        <PremiumProductCard product={product} />
                    </div>
                ))}
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
