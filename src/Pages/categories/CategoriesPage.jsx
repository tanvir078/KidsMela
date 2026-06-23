import { Head, Link, usePage } from '@/lib/inertiaCompat';
import { useEffect, useMemo, useState } from 'react';
import DesktopHeader from '@/Components/Storefront/DesktopHeader';
import Footer from '@/Components/Storefront/Footer';
import Toast from '@/Components/Storefront/Toast';
import LiveChat from '@/Components/Storefront/LiveChat';
import { useCart } from '@/Contexts/CartContext';

const categoryMeta = {
    Men: { icon: 'Style', tone: 'bg-cyan-50 text-cyan-700 ring-cyan-100' },
    Women: { icon: 'Style', tone: 'bg-pink-50 text-pink-700 ring-pink-100' },
    Kids: { icon: 'Style', tone: 'bg-sky-50 text-sky-700 ring-sky-100' },
    Fashion: { icon: 'Style', tone: 'bg-pink-50 text-pink-700 ring-pink-100' },
    Accessories: { icon: 'Bag', tone: 'bg-rose-50 text-rose-700 ring-rose-100' },
    Shoes: { icon: 'Shoe', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
    Beauty: { icon: 'Glow', tone: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100' },
};

const defaultMeta = { icon: 'Item', tone: 'bg-slate-50 text-slate-700 ring-slate-100' };

function getCategoryIconKey(name = '') {
    const value = String(name).toLowerCase();

    if (value.includes('fashion') || value.includes('style') || value.includes('shirt') || value.includes('dress') || value.includes('tops')) return 'style';
    if (value.includes('men') || value.includes('woman') || value.includes('women') || value.includes('kid') || value.includes('panjabi') || value.includes('saree')) return 'style';
    if (value.includes('accessories') || value.includes('bag') || value.includes('cover')) return 'bag';
    if (value.includes('beauty') || value.includes('glow') || value.includes('makeup') || value.includes('skin')) return 'beauty';
    if (value.includes('shoe') || value.includes('heel') || value.includes('sneaker')) return 'shoe';

    return 'item';
}

function CategoryIcon({ name, icon, className = 'h-5 w-5' }) {
    const key = getCategoryIconKey(icon || name);
    const paths = {
        style: 'M6 3l3 2a3 3 0 006 0l3-2 3 5-3 2v10H6V10L3 8l3-5z',
        tech: 'M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zm5 14h.01',
        bag: 'M6 8h12l-1 12H7L6 8zm3 0a3 3 0 016 0',
        sports: 'M5 17c4-1 7-4 8-8m-6-4c7 1 11 5 12 12M12 22a10 10 0 110-20 10 10 0 010 20z',
        home: 'M3 11l9-8 9 8M5 10v10h14V10m-10 10v-6h6v6',
        beauty: 'M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3zm5 10l1 2.2 2 1-2 1-1 2.2-1-2.2-2-1 2-1 1-2.2z',
        book: 'M5 4h10a4 4 0 014 4v12H8a3 3 0 00-3 3V4zm0 0v19',
        toy: 'M7 8h10a4 4 0 014 4v1a4 4 0 01-4 4H7a4 4 0 01-4-4v-1a4 4 0 014-4zm2 3v3m-1.5-1.5h3M16 12h.01M18 14h.01',
        food: 'M6 3v8m3-8v8M6 7h3m0 4c0 2-3 2-3 0m9-8v18m0-18c3 2 4 6 2 9h-2',
        audio: 'M4 13a8 8 0 0116 0v5a2 2 0 01-2 2h-2v-7h4M4 13h4v7H6a2 2 0 01-2-2v-5z',
        shoe: 'M4 14c4 2 8 3 14 2 2 0 3 1 3 3H4v-5zm2-5c2 3 5 5 10 5',
        item: 'M4 7l8-4 8 4-8 4-8-4zm0 5l8 4 8-4M4 17l8 4 8-4',
    };

    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
            <path
                d={paths[key]}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const navItems = [
    { label: 'Home', href: '/', match: /^\/$/, icon: 'home' },
    { label: 'Campaigns', href: '/campaigns', match: /^\/campaigns/, icon: 'campaigns' },
    { label: 'Categories', href: '/categories', match: /^\/categories/, icon: 'grid' },
    { label: 'Cart', href: '/cart', match: /^\/cart|^\/checkout/, icon: 'cart' },
    { label: 'Account', href: '/account', match: /^\/account/, icon: 'user' },
];

function BottomNavIcon({ icon, active }) {
    const paths = {
        home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
        grid: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
        tag: 'M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z',
        cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
        user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        campaigns: 'M13 10V3L4 14h7v7l9-11h-7z 0 1 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4'
    };

    return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" aria-hidden="true">
            <path
                d={paths[icon]}
                stroke="currentColor"
                strokeWidth={active ? '2.2' : '1.8'}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function getMeta(category) {
    return categoryMeta[category] || defaultMeta;
}

function normalizeCategory(category) {
    return {
        ...category,
        id: category.id ?? category.slug ?? category.name,
        children: (category.children || category.active_children_recursive || []).map(normalizeCategory),
    };
}

function categorySearchHref(category) {
    if (String(category.id).startsWith('fallback-')) {
        return `/search?category=${encodeURIComponent(category.name)}`;
    }

    return `/search?category_id=${encodeURIComponent(category.id)}&category=${encodeURIComponent(category.name)}`;
}

function CategoryVisual({ category, icon, className = 'h-5 w-5', imageClassName = 'h-full w-full object-cover' }) {
    const image = category?.icon_url || category?.image_url;

    if (image) {
        return <img src={image} alt="Category" className={imageClassName} loading="lazy" />;
    }

    return <CategoryIcon name={category?.name} icon={icon} className={className} />;
}

export default function CategoriesPage({ categories = [] }) {
    const [activeCategory, setActiveCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const { itemCount } = useCart();
    const { url } = usePage();

    const mainCategories = useMemo(() => {
        if (categories.length === 0) return [];

        return categories.map(normalizeCategory).map((category) => ({
            ...category,
            ...getMeta(category.name),
        }));
    }, [categories]);

    useEffect(() => {
        if (!activeCategory && mainCategories.length > 0) {
            setActiveCategory(mainCategories[0].id);
        }
    }, [activeCategory, mainCategories]);

    const activeCategoryItem = mainCategories.find((category) => String(category.id) === String(activeCategory)) || mainCategories[0];
    const activeSubCategories = activeCategoryItem?.children || [];

    return (
        <div className="min-h-screen bg-gray-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
            <DesktopHeader />

            <div className="relative mx-auto min-h-screen max-w-md bg-white lg:max-w-none lg:bg-transparent lg:shadow-none">
                <Head title="Categories" />

                <section className="h-[calc(100vh-70px)] overflow-hidden bg-[white] lg:hidden flex flex-col">
                {/* PAGE HEADER */}
                <div className="sticky top-0 z-30 bg-[#560056] border-b border-slate-100 px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <h1 className="text-lg font-semibold text-white">
                            Categories
                        </h1>

                        <div className="flex items-center gap-5">
                            {showSearchInput ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search fashion..."
                                        className="h-9 w-48 rounded-lg border border-slate-200 px-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                                        autoFocus
                                    />
                                    <Link
                                        href={searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search'}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500 text-white shadow-sm transition-colors hover:bg-pink-600"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                            fill="none"
                                        >
                                            <path
                                                d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowSearchInput(false);
                                            setSearchQuery('');
                                        }}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                            fill="none"
                                        >
                                            <path
                                                d="M18 6 6 18M6 6l12 12"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowSearchInput(true)}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                            fill="none"
                                        >
                                            <path
                                                d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </button>

                                    <Link
                                        href="/cart"
                                        className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                            fill="none"
                                        >
                                            <path
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                    <div className="grid flex-1 grid-cols-[115px_minmax(0,1fr)] overflow-hidden">
                        {/* LEFT COLUMN */}
                        <aside className="h-full overflow-y-auto border-r border-slate-100 bg-[#f3fade] pb-24 scrollbar-hide">
                            {mainCategories.map((category) => {
                                const active = String(category.id) === String(activeCategory);

                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() =>
                                            setActiveCategory(
                                                category.id
                                            )
                                        }
                                        className={`relative flex min-h-[74px] w-[100px] rounded-[8px] flex-col items-center justify-center gap-1.5 px-1.5 pt-1 m-2 text-center text-[10px] font-black transition-colors hover:bg-purple-100 ${
                                            active
                                                ? 'bg-purple-600 text-yellow-400'
                                                : 'text-slate-600 bg-slate-50'
                                        }`}
                                    >
                                        {active && (
                                            <span className="absolute right-0 h-full w-1 rounded-r bg-yellow-400" />
                                        )}

                                        <span
                                            className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ${
                                                active
                                                    ? 'bg-purple-500 text-yellow-300 ring-yellow-400'
                                                    : category.tone
                                            }`}
                                        >
                                            <CategoryVisual category={category} icon={category.icon} />
                                        </span>

                                        <span className="line-clamp-2 leading-3">
                                            {category.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </aside>

                        {/* RIGHT COLUMN */}
                        <div className="h-full overflow-y-auto bg-white px-3 pb-24 pt-3 scrollbar-hide">
                            <div className="space-y-3">
                                {activeSubCategories.length === 0 && (
                                    <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm font-bold text-slate-500 ring-1 ring-slate-100">
                                        No sub categories added yet.
                                    </div>
                                )}
                                {activeSubCategories.map(
                                    (subCategory) => {
                                        const childCategories = subCategory.children || [];

                                        return (
                                        <div
                                            key={subCategory.id}
                                            className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100"
                                        >
                                            <div
                                                className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-slate-100"
                                            >
                                                <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-white text-purple-700 ring-1 ring-purple-100">
                                                    <CategoryVisual category={subCategory} className="h-[18px] w-[18px]" />
                                                </span>

                                                <span className="text-sm font-black text-slate-800">
                                                    {
                                                        subCategory.name
                                                    }
                                                </span>
                                            </div>

                                            {childCategories.length > 0 ? (
                                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                                        {childCategories.map(
                                                            (
                                                                child
                                                            ) => (
                                                                <Link
                                                                    key={
                                                                        child.id
                                                                    }
                                                                    href={categorySearchHref(child)}
                                                                    className="flex min-h-[70px] flex-col items-center justify-center gap-1.5 rounded-xl bg-white px-1.5 py-2 text-center text-[10px] font-bold leading-3 text-slate-600 ring-1 ring-slate-100 active:bg-slate-50"
                                                                >
                                                                    <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-purple-50 text-purple-700 ring-1 ring-purple-100">
                                                                        <CategoryVisual category={child} className="h-4 w-4" />
                                                                    </span>
                                                                    <span className="line-clamp-2">{child.name}</span>
                                                                </Link>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                                        <Link
                                                            href={categorySearchHref(subCategory)}
                                                            className="flex min-h-[70px] flex-col items-center justify-center gap-1.5 rounded-xl bg-white px-1.5 py-2 text-center text-[10px] font-bold leading-3 text-slate-600 ring-1 ring-slate-100 active:bg-slate-50"
                                                        >
                                                            <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-purple-50 text-purple-700 ring-1 ring-purple-100">
                                                                <CategoryVisual category={subCategory} className="h-4 w-4" />
                                                            </span>
                                                            <span className="line-clamp-2">{subCategory.name}</span>
                                                        </Link>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                )}
                            </div>
                        </div>
                    </div>
            </section>

            <section className="hidden lg:mx-auto lg:block lg:max-w-7xl lg:px-6 lg:py-8">
                {mainCategories.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 p-12 text-center">
                        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-slate-100">
                            <svg viewBox="0 0 24 24" className="h-10 w-10 text-slate-300" fill="none">
                                <path d="M4 7l8-4 8 4-8 4-8-4zm0 5l8 4 8-4M4 17l8 4 8-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className="mt-4 text-xl font-black text-slate-900">No categories available</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            Categories haven't been added yet. Please check back later.
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-flex rounded-full bg-rose-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-700"
                        >
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
                        {/* Left Sidebar - Main Categories */}
                        <aside className="sticky top-24 h-fit rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="mb-4 px-2 text-lg font-black text-slate-950">Categories</h2>
                            <div className="space-y-1">
                                {mainCategories.map((category) => {
                                    const active = String(category.id) === String(activeCategory);
                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => setActiveCategory(category.id)}
                                            onMouseEnter={() => setActiveCategory(category.id)}
                                            className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                                active
                                                    ? 'bg-rose-50 text-rose-700'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {active && (
                                                <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-rose-600" />
                                            )}
                                            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ${
                                                active ? 'bg-rose-100 text-rose-600 ring-rose-200' : category.tone
                                            }`}>
                                                <CategoryVisual category={category} icon={category.icon} className="h-4 w-4" />
                                            </span>
                                            <span className="truncate">{category.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </aside>

                        {/* Right Content - Subcategories */}
                        <div>
                            <div className="mb-6 rounded-2xl bg-slate-950 px-7 py-6 text-white">
                                <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-300">Fashion Taxonomy</p>
                                <div className="mt-2 flex items-end justify-between gap-6">
                                    <div>
                                        <h1 className="text-3xl font-black">{activeCategoryItem?.name || 'Shop by category'}</h1>
                                        <p className="mt-1 text-sm font-semibold text-slate-300">
                                            Browse {activeCategoryItem?.name || 'our'} collections by department, product type, and style.
                                        </p>
                                    </div>
                                    <Link href="/search" className="rounded-md bg-rose-600 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-rose-700">
                                        View All Products
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {activeSubCategories.length === 0 ? (
                                    <div className="rounded-2xl bg-slate-50 p-8 text-center">
                                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100">
                                            <svg viewBox="0 0 24 24" className="h-8 w-8 text-slate-300" fill="none">
                                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </div>
                                        <p className="mt-3 text-sm font-bold text-slate-700">No subcategories added yet</p>
                                    </div>
                                ) : (
                                    activeSubCategories.map((subCategory) => {
                                        const childCategories = subCategory.children || [];

                                        return (
                                            <div key={subCategory.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                                                    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-white text-rose-700 ring-1 ring-rose-100">
                                                        <CategoryVisual category={subCategory} className="h-5 w-5" />
                                                    </span>
                                                    <span className="text-lg font-black text-slate-800">{subCategory.name}</span>
                                                </div>

                                                {childCategories.length > 0 ? (
                                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                                        {childCategories.map((child) => (
                                                            <Link
                                                                key={child.id}
                                                                href={categorySearchHref(child)}
                                                                className="flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-center text-xs font-bold leading-3 text-slate-600 ring-1 ring-slate-200 transition-all hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-100"
                                                            >
                                                                <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                                                                    <CategoryVisual category={child} className="h-5 w-5" />
                                                                </span>
                                                                <span className="line-clamp-2">{child.name}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="mt-4">
                                                        <Link
                                                            href={categorySearchHref(subCategory)}
                                                            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-100"
                                                        >
                                                            <span>View all products in {subCategory.name}</span>
                                                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none">
                                                                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-gray-100 bg-[#4d0659] pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
                <div className="grid grid-cols-5">
                    {navItems.map((item) => {
                        const active = item.match.test(url);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
                                    active ? 'text-orange-500' : 'text-gray-400'
                                }`}
                            >
                                <BottomNavIcon icon={item.icon} active={active} />
                                <span>{item.label}</span>

                                {item.label === 'Cart' && itemCount > 0 && (
                                    <span className="absolute left-1/2 top-1 ml-2 grid min-h-[16px] min-w-[16px] place-items-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                                        {itemCount}
                                    </span>
                                )}

                                {active && (
                                    <span className="absolute bottom-0 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-orange-500" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <Toast />
            <LiveChat />
        </div>

        <Footer />
    </div>
    );
}
