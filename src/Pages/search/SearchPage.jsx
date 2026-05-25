import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useMemo, useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import SkeletonLoader from '@/Components/Storefront/SkeletonLoader';
import { getProducts } from '@/services/products';

const sortOptions = [
    { label: 'Best Match', value: 'match' },
    { label: 'Low Price', value: 'price-low' },
    { label: 'High Price', value: 'price-high' },
    { label: 'Top Rated', value: 'rating' },
];

function productMatches(product, query, category) {
    const normalizedQuery = query.trim().toLowerCase();
    const categoryMatches = category === 'All' || product.category === category;

    if (!categoryMatches) {
        return false;
    }

    if (!normalizedQuery) {
        return true;
    }

    return [product.name, product.description, product.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
}

export default function SearchPage({ q = '', category = 'All' }) {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(category || 'All');
    const [sortBy, setSortBy] = useState('match');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [minRating, setMinRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setError('');

        getProducts()
            .then(setProducts)
            .catch((exception) => setError(exception.message || 'Search could not be loaded.'))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        setActiveCategory(category || 'All');
    }, [category]);

    const categories = useMemo(() => {
        const names = products.map((product) => product.category).filter(Boolean);
        return ['All', ...Array.from(new Set(names))];
    }, [products]);

    const results = useMemo(() => {
        const matchedProducts = products.filter((product) => {
            const categoryMatches = activeCategory === 'All' || product.category === activeCategory;
            const priceMatches = Number(product.price) >= priceRange.min && Number(product.price) <= priceRange.max;
            const ratingMatches = Number(product.rating ?? 0) >= minRating;
            const stockMatches = !inStockOnly || Number(product.stock ?? 0) > 0;
            const queryMatches = productMatches(product, q, activeCategory);

            return categoryMatches && priceMatches && ratingMatches && stockMatches && queryMatches;
        });

        return [...matchedProducts].sort((first, second) => {
            if (sortBy === 'price-low') {
                return Number(first.price) - Number(second.price);
            }

            if (sortBy === 'price-high') {
                return Number(second.price) - Number(first.price);
            }

            if (sortBy === 'rating') {
                return Number(second.rating ?? 0) - Number(first.rating ?? 0);
            }

            return 0;
        });
    }, [activeCategory, products, q, sortBy, priceRange, minRating, inStockOnly]);

    return (
        <MobileShell title="Search">
            <Head title={q ? `Search: ${q}` : 'Search'} />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                            Product finder
                        </p>
                        <h1 className="mt-2 text-2xl font-black">
                            {q ? `Results for "${q}"` : 'Browse all products'}
                        </h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Filter by category and sort by price or rating.
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setActiveCategory(item)}
                            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-black transition-all duration-200 active:scale-95 ${
                                activeCategory === item
                                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-300 hover:bg-slate-800'
                                    : 'bg-white text-slate-600 ring-1 ring-slate-200 shadow-sm hover:bg-slate-50 hover:ring-slate-300'
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:bg-slate-50 active:scale-95"
                >
                    <span>🔍</span>
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>

                {showFilters && (
                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-base font-black text-slate-950 mb-4">Advanced Filters</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">Price Range</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                        className="h-10 w-full rounded-xl border-slate-200 px-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Min"
                                    />
                                    <span className="text-slate-400">-</span>
                                    <input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                        className="h-10 w-full rounded-xl border-slate-200 px-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">Minimum Rating</label>
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => setMinRating(rating)}
                                            className={`h-10 w-10 rounded-xl text-sm font-black transition-all duration-200 active:scale-95 ${
                                                minRating === rating
                                                    ? 'bg-orange-600 text-white'
                                                    : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            {rating}+
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="inStock"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                />
                                <label htmlFor="inStock" className="text-sm font-bold text-slate-700">
                                    In Stock Only
                                </label>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setPriceRange({ min: 0, max: 1000 });
                                    setMinRating(0);
                                    setInStockOnly(false);
                                }}
                                className="w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-95"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                )}

                <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-base font-black text-slate-950">Sort by</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setSortBy(option.value)}
                                className={`rounded-2xl px-3 py-3 text-sm font-black transition-all duration-200 active:scale-95 ${
                                    sortBy === option.value
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 hover:bg-orange-700'
                                        : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-slate-950">Products</h2>
                        <p className="text-xs font-semibold text-slate-500">
                            {results.length} item{results.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                    <span className="rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-2.5 py-1 text-xs font-black text-orange-700 ring-1 ring-orange-200">
                        {activeCategory}
                    </span>
                </div>

                {isLoading && <SkeletonLoader type="card" count={4} />}

                {error && (
                    <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-red-100">
                        <p className="text-sm font-bold text-red-600">{error}</p>
                    </div>
                )}

                {!isLoading && !error && results.length === 0 && (
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-200">
                            <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-400" fill="none" aria-hidden="true">
                                <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h2 className="mt-5 text-xl font-black text-slate-950">No products found</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            Try another keyword or browse categories.
                        </p>
                        <Link href="/categories" className="mt-5 inline-flex rounded-2xl bg-orange-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-200">
                            Browse Categories
                        </Link>
                    </div>
                )}

                {!isLoading && !error && results.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {results.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </MobileShell>
    );
}
