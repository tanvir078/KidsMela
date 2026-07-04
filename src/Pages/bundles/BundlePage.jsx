import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductBundleCard from '@/Components/Storefront/ProductBundleCard';
import { apiRequest } from '@/lib/api';

export default function BundlePage() {
    const [bundles, setBundles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadBundles = async () => {
            try {
                const data = await apiRequest('/storefront/bundles');
                setBundles(data.data || []);
            } catch (exception) {
                setError(exception.message || 'Bundles could not be loaded.');
            } finally {
                setIsLoading(false);
            }
        };
        loadBundles();
    }, []);

    return (
        <MobileShell title="Bundle Deals" simpleHeader={true}>
            <Head title="Bundle Deals" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                            Special Offers
                        </p>
                        <h1 className="mt-2 text-2xl font-black">Bundle Deals</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Save more when you buy together
                        </p>
                    </div>
                </div>

                {isLoading && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-200" />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="rounded-3xl bg-red-50 p-5 text-center ring-1 ring-red-100">
                        <p className="text-sm font-semibold text-red-600">{error}</p>
                    </div>
                )}

                {!isLoading && !error && bundles.length === 0 && (
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-200">
                            <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-400" fill="none" aria-hidden="true">
                                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8-4m0-10L4 7l8 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className="mt-5 text-xl font-black text-slate-950">No bundle deals available</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            Check back later for special bundle offers
                        </p>
                        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                            Browse Products
                        </Link>
                    </div>
                )}

                {!isLoading && !error && bundles.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {bundles.map((bundle) => (
                            <ProductBundleCard key={bundle.id} bundle={bundle} />
                        ))}
                    </div>
                )}
            </section>
        </MobileShell>
    );
}
