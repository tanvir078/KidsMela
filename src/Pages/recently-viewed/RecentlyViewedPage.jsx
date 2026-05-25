import { Head, Link } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import { useRecentlyViewed } from '@/Contexts/RecentlyViewedContext';

export default function RecentlyViewedPage() {
    const { items, clearItems } = useRecentlyViewed();

    return (
        <MobileShell title="Recently Viewed">
            <Head title="Recently Viewed" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                                ব্রাউজিং হিস্টোরি
                            </p>
                            <h1 className="mt-2 text-2xl font-black">সম্প্রতি দেখা</h1>
                            <p className="mt-1 text-sm font-semibold text-white/90">
                                {items.length}টি পণ্য সম্প্রতি দেখেছেন
                            </p>
                        </div>
                        {items.length > 0 && (
                            <button
                                type="button"
                                onClick={clearItems}
                                className="rounded-full bg-white/20 px-4 py-2 text-sm font-black transition-all duration-200 hover:bg-white/30 active:scale-95"
                            >
                                মুছুন
                            </button>
                        )}
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-200">
                            <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-400" fill="none" aria-hidden="true">
                                <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className="mt-5 text-xl font-black text-slate-950">এখনো কোনো পণ্য দেখেননি</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            যেসব পণ্য দেখবেন সেগুলো এখানে দেখা যাবে
                        </p>
                        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                            পণ্য দেখুন
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {items.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </MobileShell>
    );
}
