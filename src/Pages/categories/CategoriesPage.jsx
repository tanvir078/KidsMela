import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useMemo, useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import SkeletonLoader from '@/Components/Storefront/SkeletonLoader';
import { getProducts } from '@/services/products';

const categoryIcons = {
    'Electronics': '📱',
    'Fashion': '👗',
    'Gadgets': '⚡',
    'Sports': '⚽',
    'Home': '🏠',
    'Accessories': '💍',
    'Books': '📚',
    'Toys': '🧸',
    'Food': '🍔',
    'Beauty': '💄',
};

const categoryColors = {
    'Electronics': 'from-blue-400 to-indigo-500',
    'Fashion': 'from-pink-400 to-rose-500',
    'Gadgets': 'from-purple-400 to-fuchsia-500',
    'Sports': 'from-green-400 to-emerald-500',
    'Home': 'from-amber-400 to-orange-500',
    'Accessories': 'from-rose-400 to-pink-500',
    'Books': 'from-indigo-400 to-blue-500',
    'Toys': 'from-cyan-400 to-teal-500',
    'Food': 'from-orange-400 to-red-500',
    'Beauty': 'from-fuchsia-400 to-pink-500',
};

export default function CategoriesPage() {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .finally(() => setIsLoading(false));
    }, []);

    const categories = useMemo(() => {
        const names = products.map((product) => product.category).filter(Boolean);
        return ['All', ...Array.from(new Set(names))];
    }, [products]);

    const filteredProducts =
        activeCategory === 'All'
            ? products
            : products.filter((product) => product.category === activeCategory);

    return (
        <MobileShell title="Categories">
            <Head title="Categories" />
            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <h1 className="text-2xl font-black">Shop by Category</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Pick a section and continue shopping.
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                            <Link
                                key={category}
                                href={`/search${category === 'All' ? '' : `?category=${encodeURIComponent(category)}`}`}
                                className="group relative overflow-hidden rounded-2xl bg-slate-50 p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md hover:ring-slate-300 active:scale-95"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${categoryColors[category] || 'from-slate-400 to-slate-500'} text-2xl shadow-sm`}>
                                        {categoryIcons[category] || '📦'}
                                    </div>
                                    <span className="text-sm font-black text-slate-800 group-hover:text-slate-900">{category}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-slate-950">{activeCategory} Products</h2>
                        <p className="text-xs font-semibold text-slate-500">
                            {filteredProducts.length} items found
                        </p>
                    </div>
                    <Link href="/" className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600 transition-all duration-200 hover:bg-orange-100 active:scale-95">
                        Home
                    </Link>
                </div>

                {isLoading ? (
                    <SkeletonLoader type="card" count={4} />
                ) : filteredProducts.length === 0 ? (
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-200">
                            <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-400" fill="none" aria-hidden="true">
                                <path d="M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className="mt-5 text-xl font-black text-slate-950">No products found</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            No products in this category.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </MobileShell>
    );
}
