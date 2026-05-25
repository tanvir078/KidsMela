import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useMemo, useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import SkeletonLoader from '@/Components/Storefront/SkeletonLoader';
import { getProducts } from '@/services/products';

const categoryMeta = {
    'Electronics': { icon: '📱', gradient: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50' },
    'Fashion': { icon: '👗', gradient: 'from-pink-400 to-rose-500', bg: 'bg-pink-50' },
    'Gadgets': { icon: '⚡', gradient: 'from-purple-400 to-fuchsia-500', bg: 'bg-purple-50' },
    'Sports': { icon: '⚽', gradient: 'from-green-400 to-emerald-500', bg: 'bg-green-50' },
    'Home': { icon: '🏠', gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
    'Accessories': { icon: '💍', gradient: 'from-rose-400 to-pink-500', bg: 'bg-rose-50' },
    'Books': { icon: '📚', gradient: 'from-indigo-400 to-blue-500', bg: 'bg-indigo-50' },
    'Toys': { icon: '🧸', gradient: 'from-cyan-400 to-teal-500', bg: 'bg-cyan-50' },
    'Food': { icon: '🍔', gradient: 'from-orange-400 to-red-500', bg: 'bg-orange-50' },
    'Beauty': { icon: '💄', gradient: 'from-fuchsia-400 to-pink-500', bg: 'bg-fuchsia-50' },
};

const defaultMeta = { icon: '📦', gradient: 'from-slate-400 to-slate-500', bg: 'bg-slate-50' };

function money(value) {
    return '৳' + Number(value ?? 0).toLocaleString();
}

export default function CategoriesPage() {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('default');

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .finally(() => setIsLoading(false));
    }, []);

    const categoriesWithCount = useMemo(() => {
        const counts = {};
        products.forEach((p) => {
            const cat = p.category || 'Other';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.entries(counts).map(([name, count]) => ({
            name,
            count,
            ...(categoryMeta[name] || defaultMeta),
        }));
    }, [products]);

    const filteredProducts = useMemo(() => {
        let list = activeCategory
            ? products.filter((p) => p.category === activeCategory)
            : [];

        if (sortBy === 'price-low') list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
        else if (sortBy === 'price-high') list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
        else if (sortBy === 'rating') list = [...list].sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));

        return list;
    }, [activeCategory, products, sortBy]);

    const activeMeta = activeCategory ? (categoryMeta[activeCategory] || defaultMeta) : null;

    return (
        <MobileShell title="Categories">
            <Head title="ক্যাটাগরি" />
            <section className="space-y-4 px-4 py-4">
                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <h1 className="text-2xl font-black">ক্যাটাগরি</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            {categoriesWithCount.length}টি ক্যাটাগরিতে পণ্য খুঁজুন
                        </p>
                    </div>
                </div>

                {/* Category Grid */}
                {isLoading ? (
                    <SkeletonLoader type="card" count={6} />
                ) : !activeCategory ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {categoriesWithCount.map((cat) => (
                            <button
                                key={cat.name}
                                type="button"
                                onClick={() => setActiveCategory(cat.name)}
                                className="group overflow-hidden rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md hover:ring-orange-200 active:scale-95"
                            >
                                <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${cat.gradient} text-2xl shadow-sm`}>
                                    {cat.icon}
                                </div>
                                <p className="mt-3 text-center text-sm font-black text-slate-800 group-hover:text-orange-600">{cat.name}</p>
                                <p className="mt-0.5 text-center text-xs font-semibold text-slate-400">{cat.count}টি পণ্য</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Active Category Header */}
                        <div className={`flex items-center gap-3 rounded-2xl ${activeMeta.bg} p-3 ring-1 ring-slate-200`}>
                            <button type="button" onClick={() => { setActiveCategory(null); setSortBy('default'); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-sm font-black text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95">
                                ←
                            </button>
                            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${activeMeta.gradient} text-xl shadow-sm`}>
                                {activeMeta.icon}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-slate-900">{activeCategory}</p>
                                <p className="text-xs font-semibold text-slate-500">{filteredProducts.length}টি পণ্য</p>
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {[
                                { value: 'default', label: 'ডিফল্ট' },
                                { value: 'price-low', label: 'কম দাম' },
                                { value: 'price-high', label: 'বেশি দাম' },
                                { value: 'rating', label: 'সেরা রেটিং' },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setSortBy(opt.value)}
                                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition-all duration-200 ${
                                        sortBy === opt.value
                                            ? 'bg-orange-600 text-white shadow-sm'
                                            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Products */}
                        {filteredProducts.length === 0 ? (
                            <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-slate-200 text-3xl">
                                    {activeMeta.icon}
                                </div>
                                <h2 className="mt-4 text-lg font-black text-slate-950">এই ক্যাটাগরিতে পণ্য নেই</h2>
                                <button type="button" onClick={() => setActiveCategory(null)} className="mt-4 rounded-2xl bg-orange-600 px-5 py-2.5 text-sm font-black text-white transition-all hover:bg-orange-700 active:scale-95">
                                    সব ক্যাটাগরি দেখুন
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </MobileShell>
    );
}
