import { Head, Link } from '@/lib/inertiaCompat';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import SkeletonLoader from '@/Components/Storefront/SkeletonLoader';
import { getProducts } from '@/services/products';

const categoryMeta = {
    Electronics: { icon: 'Tech', tone: 'bg-cyan-50 text-cyan-700 ring-cyan-100' },
    Fashion: { icon: 'Style', tone: 'bg-pink-50 text-pink-700 ring-pink-100' },
    Gadgets: { icon: 'Gear', tone: 'bg-violet-50 text-violet-700 ring-violet-100' },
    Sports: { icon: 'Fit', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
    Home: { icon: 'Home', tone: 'bg-amber-50 text-amber-700 ring-amber-100' },
    Accessories: { icon: 'Bag', tone: 'bg-rose-50 text-rose-700 ring-rose-100' },
    Books: { icon: 'Read', tone: 'bg-indigo-50 text-indigo-700 ring-indigo-100' },
    Toys: { icon: 'Play', tone: 'bg-sky-50 text-sky-700 ring-sky-100' },
    Food: { icon: 'Food', tone: 'bg-orange-50 text-orange-700 ring-orange-100' },
    Beauty: { icon: 'Glow', tone: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100' },
};

const defaultMeta = { icon: 'Item', tone: 'bg-slate-50 text-slate-700 ring-slate-100' };

function getMeta(category) {
    return categoryMeta[category] || defaultMeta;
}

function price(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function CategoriesPage() {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(categoryName || '');
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('default');

    useEffect(() => {
        setIsLoading(true);
        getProducts()
            .then(setProducts)
            .finally(() => setIsLoading(false));
    }, []);

    const categoriesWithCount = useMemo(() => {
        const counts = {};
        products.forEach((product) => {
            const category = product.category || 'Other';
            counts[category] = (counts[category] || 0) + 1;
        });

        return Object.entries(counts).map(([name, count]) => ({
            name,
            count,
            ...getMeta(name),
        }));
    }, [products]);

    useEffect(() => {
        if (categoryName) {
            setActiveCategory(categoryName);
            return;
        }

        if (!activeCategory && categoriesWithCount.length > 0) {
            setActiveCategory(categoriesWithCount[0].name);
        }
    }, [activeCategory, categoriesWithCount, categoryName]);

    const filteredProducts = useMemo(() => {
        let list = activeCategory ? products.filter((product) => (product.category || 'Other') === activeCategory) : [];

        if (sortBy === 'price-low') list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
        else if (sortBy === 'price-high') list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
        else if (sortBy === 'rating') list = [...list].sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));

        return list;
    }, [activeCategory, products, sortBy]);

    const activeMeta = getMeta(activeCategory);

    return (
        <MobileShell title="Categories" showSearch={false} showPromoBanner={false}>
            <Head title="Categories" />

            <section className="bg-white lg:hidden">
                <div className="sticky top-[58px] z-20 flex items-center justify-between bg-[#39d9d0] px-4 py-3 text-slate-900 shadow-sm">
                    <h1 className="text-sm font-black">Categories</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/search" className="grid h-8 w-8 place-items-center rounded bg-white/85 text-slate-700 shadow-sm" aria-label="Search categories">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                                <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </Link>
                        <Link href="/cart" className="grid h-8 w-8 place-items-center rounded bg-white/85 text-slate-700 shadow-sm" aria-label="Cart">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-3">
                        <SkeletonLoader type="card" count={6} />
                    </div>
                ) : categoriesWithCount.length === 0 ? (
                    <div className="grid min-h-[55vh] place-items-center px-6 text-center">
                        <div>
                            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-400">Empty</div>
                            <h2 className="mt-3 text-base font-black text-slate-800">No categories found</h2>
                        </div>
                    </div>
                ) : (
                    <div className="grid min-h-[calc(100vh-122px)] grid-cols-[88px_minmax(0,1fr)]">
                        <aside className="border-r border-slate-100 bg-slate-50">
                            <div className="sticky top-[106px] max-h-[calc(100vh-170px)] overflow-y-auto pb-20 scrollbar-hide">
                                {categoriesWithCount.map((category) => {
                                    const active = category.name === activeCategory;

                                    return (
                                        <button
                                            key={category.name}
                                            type="button"
                                            onClick={() => {
                                                setActiveCategory(category.name);
                                                setSortBy('default');
                                            }}
                                            className={`relative flex min-h-[66px] w-full flex-col items-center justify-center gap-1 px-2 text-center text-[10px] font-black transition-colors ${
                                                active ? 'bg-white text-pink-600' : 'text-slate-500'
                                            }`}
                                        >
                                            {active && <span className="absolute left-0 top-2 h-10 w-1 rounded-r bg-pink-500" />}
                                            <span className={`grid h-8 w-8 place-items-center rounded-full text-[8px] ring-1 ${category.tone}`}>{category.icon}</span>
                                            <span className="line-clamp-2 leading-3">{category.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </aside>

                        <div className="min-w-0 bg-white px-3 pb-24 pt-3">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-black text-slate-900">{activeCategory}</h2>
                                    <p className="text-[11px] font-semibold text-slate-400">{filteredProducts.length} items</p>
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(event) => setSortBy(event.target.value)}
                                    className="h-8 rounded border border-slate-200 bg-white px-2 text-[11px] font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-300"
                                >
                                    <option value="default">Default</option>
                                    <option value="price-low">Low Price</option>
                                    <option value="price-high">High Price</option>
                                    <option value="rating">Top Rating</option>
                                </select>
                            </div>

                            {filteredProducts.length === 0 ? (
                                <div className="rounded bg-slate-50 p-6 text-center">
                                    <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full text-[10px] font-black ring-1 ${activeMeta.tone}`}>{activeMeta.icon}</div>
                                    <p className="mt-3 text-sm font-black text-slate-700">No products in this category</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-x-3 gap-y-5">
                                    {filteredProducts.map((product) => (
                                        <Link key={product.id} href={`/products/${product.id}`} className="min-w-0 text-center">
                                            <div className="mx-auto aspect-square w-full overflow-hidden rounded bg-slate-50 ring-1 ring-slate-100">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                                                ) : (
                                                    <div className={`grid h-full place-items-center text-[9px] font-black ${activeMeta.tone}`}>{activeMeta.icon}</div>
                                                )}
                                            </div>
                                            <p className="mt-1 line-clamp-2 min-h-[28px] text-[10px] font-semibold leading-[14px] text-slate-600">{product.name}</p>
                                            <p className="text-[10px] font-black text-pink-600">{price(product.price)}</p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            <section className="hidden space-y-4 px-4 py-4 lg:block">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h1 className="text-2xl font-black text-slate-900">Categories</h1>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                        Find products across {categoriesWithCount.length} categories
                    </p>
                </div>

                {isLoading ? (
                    <SkeletonLoader type="card" count={6} />
                ) : (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {(activeCategory ? filteredProducts : products).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </MobileShell>
    );
}
