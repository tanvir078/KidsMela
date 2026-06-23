import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useMemo, useState, useRef } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import SkeletonLoader from '@/Components/Storefront/SkeletonLoader';

const sortOptions = [
    { label: 'Best Match', value: 'match' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Top Rated', value: 'rating' },
];

const fallbackSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const fallbackColors = ['Black', 'White', 'Red', 'Blue', 'Pink', 'Green'];
const fallbackFits = ['Regular', 'Slim', 'Relaxed', 'Oversized'];

function asArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function productText(product) {
    return [
        product.name,
        product.description,
        product.category,
        product.brand,
        product.fabric,
        product.material,
        product.fit,
    ].filter(Boolean).join(' ').toLowerCase();
}

function getProductSizes(product) {
    const sizes = asArray(product.sizes || product.available_sizes || product.size);
    return sizes.length ? sizes : fallbackSizes.slice(1, 4);
}

function getProductColors(product) {
    const colors = asArray(product.colors || product.available_colors || product.color || product.colour);
    return colors.length ? colors : [product.category === 'Women' ? 'Pink' : 'Black'];
}

function getProductFit(product) {
    return product.fit || product.style_fit || 'Regular';
}

function hasSelection(selected, values) {
    if (selected.length === 0) return true;
    return values.some((value) => selected.includes(value));
}

function toggleValue(values, value) {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function FilterGroup({ title, children }) {
    return (
        <div className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{title}</h3>
            {children}
        </div>
    );
}

export default function SearchPage({ products: loadedProducts = [], filters = {}, q, category }) {
    const queryText = q ?? filters.q ?? '';
    const selectedCategory = category ?? filters.category ?? 'All';
    const [products, setProducts] = useState(loadedProducts);
    const [activeCategory, setActiveCategory] = useState(selectedCategory || 'All');
    const [sortBy, setSortBy] = useState('match');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedFits, setSelectedFits] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    
    // Search autocomplete states
    const [searchInput, setSearchInput] = useState(queryText);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('recentSearches');
        return saved ? JSON.parse(saved) : [];
    });
    const searchInputRef = useRef(null);

    useEffect(() => {
        setProducts(loadedProducts);
        setIsLoading(false);
        setError('');
    }, [loadedProducts]);

    useEffect(() => {
        setActiveCategory(selectedCategory || 'All');
    }, [selectedCategory]);

    // Autocomplete logic
    useEffect(() => {
        if (searchInput.trim().length >= 2) {
            const suggestions = products
                .filter(p => productText(p).includes(searchInput.toLowerCase()))
                .slice(0, 8)
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    image: p.image_url
                }));
            setAutocompleteSuggestions(suggestions);
            setShowAutocomplete(true);
        } else {
            setAutocompleteSuggestions([]);
            setShowAutocomplete(false);
        }
    }, [searchInput, products]);

    // Save search to recent searches
    const handleSearch = (query) => {
        if (query.trim()) {
            const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
            setRecentSearches(updatedRecent);
            localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
            setSearchInput(query);
            setShowAutocomplete(false);
            // Navigate to search with query
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const facets = useMemo(() => {
        const categories = new Set();
        const sizes = new Set();
        const colors = new Set();
        const fits = new Set();

        products.forEach((product) => {
            if (product.category) categories.add(product.category);
            getProductSizes(product).forEach((size) => sizes.add(size));
            getProductColors(product).forEach((color) => colors.add(color));
            fits.add(getProductFit(product));
        });

        return {
            categories: ['All', ...Array.from(categories)],
            sizes: Array.from(sizes).length ? Array.from(sizes) : fallbackSizes,
            colors: Array.from(colors).length ? Array.from(colors) : fallbackColors,
            fits: Array.from(fits).length ? Array.from(fits) : fallbackFits,
        };
    }, [products]);

    const results = useMemo(() => {
        const minPrice = priceRange.min === '' ? 0 : Number(priceRange.min);
        const maxPrice = priceRange.max === '' ? Number.POSITIVE_INFINITY : Number(priceRange.max);
        const normalizedQuery = queryText.trim().toLowerCase();

        const matchedProducts = products.filter((product) => {
            const categoryMatches = activeCategory === 'All' || product.category === activeCategory;
            const textMatches = !normalizedQuery || productText(product).includes(normalizedQuery);
            const price = Number(product.price ?? 0);
            const priceMatches = price >= minPrice && price <= maxPrice;
            const sizeMatches = hasSelection(selectedSizes, getProductSizes(product));
            const colorMatches = hasSelection(selectedColors, getProductColors(product));
            const fitMatches = selectedFits.length === 0 || selectedFits.includes(getProductFit(product));
            const ratingMatches = Number(product.rating ?? 0) >= minRating;
            const stockMatches = !inStockOnly || Number(product.stock ?? 0) > 0;

            return categoryMatches && textMatches && priceMatches && sizeMatches && colorMatches && fitMatches && ratingMatches && stockMatches;
        });

        return [...matchedProducts].sort((first, second) => {
            if (sortBy === 'price-low') return Number(first.price) - Number(second.price);
            if (sortBy === 'price-high') return Number(second.price) - Number(first.price);
            if (sortBy === 'rating') return Number(second.rating ?? 0) - Number(first.rating ?? 0);
            if (sortBy === 'newest') return Number(second.id ?? 0) - Number(first.id ?? 0);
            return 0;
        });
    }, [activeCategory, inStockOnly, minRating, priceRange, products, queryText, selectedColors, selectedFits, selectedSizes, sortBy]);

    const activeFilterCount = selectedSizes.length + selectedColors.length + selectedFits.length + (minRating > 0 ? 1 : 0) + (inStockOnly ? 1 : 0) + (priceRange.min || priceRange.max ? 1 : 0);

    const resetFilters = () => {
        setPriceRange({ min: '', max: '' });
        setSelectedSizes([]);
        setSelectedColors([]);
        setSelectedFits([]);
        setMinRating(0);
        setInStockOnly(false);
    };

    const filtersPanel = (
        <div className="space-y-5">
            <FilterGroup title="Category">
                <div className="space-y-2">
                    {facets.categories.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setActiveCategory(item)}
                            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-bold ${
                                activeCategory === item ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <span>{item}</span>
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup title="Size">
                <div className="grid grid-cols-3 gap-2">
                    {facets.sizes.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSizes(toggleValue(selectedSizes, size))}
                            className={`h-10 rounded-md text-xs font-black ring-1 ${
                                selectedSizes.includes(size) ? 'bg-slate-950 text-white ring-slate-950' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup title="Color">
                <div className="flex flex-wrap gap-2">
                    {facets.colors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedColors(toggleValue(selectedColors, color))}
                            className={`rounded-full px-3 py-2 text-xs font-black ring-1 ${
                                selectedColors.includes(color) ? 'bg-rose-600 text-white ring-rose-600' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup title="Fit">
                <div className="flex flex-wrap gap-2">
                    {facets.fits.map((fit) => (
                        <button
                            key={fit}
                            type="button"
                            onClick={() => setSelectedFits(toggleValue(selectedFits, fit))}
                            className={`rounded-full px-3 py-2 text-xs font-black ring-1 ${
                                selectedFits.includes(fit) ? 'bg-slate-950 text-white ring-slate-950' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {fit}
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup title="Price">
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        value={priceRange.min}
                        onChange={(event) => setPriceRange({ ...priceRange, min: event.target.value })}
                        className="h-10 rounded-md border-slate-200 px-3 text-sm font-bold focus:border-rose-500 focus:ring-rose-500"
                        placeholder="Min"
                    />
                    <input
                        type="number"
                        value={priceRange.max}
                        onChange={(event) => setPriceRange({ ...priceRange, max: event.target.value })}
                        className="h-10 rounded-md border-slate-200 px-3 text-sm font-bold focus:border-rose-500 focus:ring-rose-500"
                        placeholder="Max"
                    />
                </div>
            </FilterGroup>

            <FilterGroup title="Availability">
                <label className="flex items-center gap-3 rounded-md bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700">
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(event) => setInStockOnly(event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    In stock only
                </label>
            </FilterGroup>

            <FilterGroup title="Rating">
                <div className="grid grid-cols-3 gap-2">
                    {[0, 3, 4].map((rating) => (
                        <button
                            key={rating}
                            type="button"
                            onClick={() => setMinRating(rating)}
                            className={`h-10 rounded-md text-xs font-black ring-1 ${
                                minRating === rating ? 'bg-rose-600 text-white ring-rose-600' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {rating === 0 ? 'Any' : `${rating}+`}
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <button
                type="button"
                onClick={resetFilters}
                className="h-11 w-full rounded-md bg-slate-100 text-sm font-black text-slate-700 transition-colors hover:bg-slate-200"
            >
                Reset Filters
            </button>
        </div>
    );

    return (
        <MobileShell title="Shop Fashion">
            <Head title={queryText ? `Search: ${queryText}` : 'Shop Fashion'} />

            <section className="px-3 py-4 lg:px-0">
                {/* Search Input with Autocomplete */}
                <div className="mb-4 relative">
                    <div className="relative">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch(searchInput);
                                }
                            }}
                            onFocus={() => {
                                if (searchInput.trim().length >= 2 || recentSearches.length > 0) {
                                    setShowAutocomplete(true);
                                }
                            }}
                            onBlur={() => {
                                setTimeout(() => setShowAutocomplete(false), 200);
                            }}
                            placeholder="Search products..."
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pl-12 text-sm font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                        />
                        <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.3-4.3"/>
                        </svg>
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchInput('');
                                    setShowAutocomplete(false);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18M6 6l12 12"/>
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Autocomplete Dropdown */}
                    {showAutocomplete && (
                        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
                            <div className="max-h-80 overflow-y-auto">
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && searchInput.trim().length < 2 && (
                                    <div className="border-b border-slate-100 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Recent Searches</h3>
                                            <button
                                                type="button"
                                                onClick={clearRecentSearches}
                                                className="text-xs font-bold text-rose-600 hover:text-rose-700"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {recentSearches.map((search, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleSearch(search)}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                                >
                                                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                                                    </svg>
                                                    {search}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Product Suggestions */}
                                {autocompleteSuggestions.length > 0 && (
                                    <div className="p-4">
                                        <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-500">Suggested Products</h3>
                                        <div className="space-y-2">
                                            {autocompleteSuggestions.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50"
                                                >
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="grid h-full place-items-center text-xs font-bold text-slate-400">No img</div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-bold text-slate-800">{product.name}</p>
                                                        <p className="text-xs font-medium text-slate-500">{product.category}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* No Results */}
                                {searchInput.trim().length >= 2 && autocompleteSuggestions.length === 0 && (
                                    <div className="p-4 text-center">
                                        <p className="text-sm font-semibold text-slate-500">No suggestions found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-4 rounded-md bg-slate-950 px-4 py-5 text-white lg:px-7 lg:py-6">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-300">Kids Mela Catalog</p>
                    <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-black lg:text-3xl">
                                {queryText ? `Results for "${queryText}"` : 'Shop curated fashion'}
                            </h1>
                            <p className="mt-1 text-sm font-semibold text-slate-300">
                                Filter by size, color, fit, price, availability, and category.
                            </p>
                        </div>
                        <div className="text-sm font-black text-white">
                            {results.length} of {products.length} items
                        </div>
                    </div>
                </div>

                <div className="mb-4 flex items-center gap-2 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="h-11 flex-1 rounded-md bg-white text-sm font-black text-slate-800 shadow-sm ring-1 ring-slate-200"
                    >
                        Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}
                    </button>
                    <select
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                        className="h-11 rounded-md border-slate-200 bg-white px-3 text-sm font-black text-slate-700"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                {showFilters && (
                    <div className="mb-4 rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:hidden">
                        {filtersPanel}
                    </div>
                )}

                <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="hidden rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:block">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-base font-black text-slate-950">Filters</h2>
                            {activeFilterCount > 0 && (
                                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-black text-rose-700">{activeFilterCount}</span>
                            )}
                        </div>
                        {filtersPanel}
                    </aside>

                    <div className="min-w-0">
                        <div className="mb-4 hidden items-center justify-between rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:flex">
                            <div>
                                <h2 className="text-base font-black text-slate-950">{activeCategory === 'All' ? 'All Fashion' : activeCategory}</h2>
                                <p className="text-xs font-semibold text-slate-500">{results.length} products available</p>
                            </div>
                            <select
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value)}
                                className="h-10 rounded-md border-slate-200 bg-white px-3 text-sm font-black text-slate-700 focus:border-rose-500 focus:ring-rose-500"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {isLoading && <SkeletonLoader type="card" count={8} />}

                        {error && (
                            <div className="rounded-md bg-white p-8 text-center shadow-sm ring-1 ring-red-100">
                                <p className="text-sm font-bold text-red-600">{error}</p>
                            </div>
                        )}

                        {!isLoading && !error && results.length === 0 && (
                            <div className="rounded-md bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                                <h2 className="text-xl font-black text-slate-950">No styles found</h2>
                                <p className="mt-2 text-sm font-semibold text-slate-500">
                                    Adjust your filters or browse the fashion categories.
                                </p>
                                <Link href="/categories" className="mt-5 inline-flex rounded-md bg-rose-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-rose-200">
                                    Browse Categories
                                </Link>
                            </div>
                        )}

                        {!isLoading && !error && results.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                                {results.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </MobileShell>
    );
}
