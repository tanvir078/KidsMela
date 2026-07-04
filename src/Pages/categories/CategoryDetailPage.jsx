import { Head, Link, usePage } from '@/lib/inertiaCompat';
import { useState, useEffect } from 'react';
import DesktopHeader from '@/Components/Storefront/DesktopHeader';
import Footer from '@/Components/Storefront/Footer';
import CategoryHero from '@/Components/Storefront/CategoryHero';
import SubmenuSlider from '@/Components/Storefront/SubmenuSlider';
import PremiumProductCard from '@/Components/Storefront/PremiumProductCard';
import DesktopFilterSheet from '@/Components/Storefront/DesktopFilterSheet';
import MobileFilterSheet from '@/Components/Storefront/MobileFilterSheet';
import SortDropdown from '@/Components/Storefront/SortDropdown';
import { Filter } from 'lucide-react';
import { storefrontApi } from '@/lib/api';

export default function CategoryDetailPage({ slug }) {
    const { props } = usePage();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sort, setSort] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        categories: [],
        colors: [],
        tags: [],
        brands: [],
        priceRange: { min: 0, max: 10000 },
    });

    // Mock filter data - will be replaced with API data
    const filterData = {
        categories: category?.submenus?.flatMap(s => [s, ...s.children]) || [],
        priceRange: { min: 0, max: 10000 },
        colors: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Brown'],
        tags: ['New', 'Sale', 'Featured', 'Trending'],
        brands: ['Brand A', 'Brand B', 'Brand C'],
    };

    useEffect(() => {
        loadCategory();
    }, [slug]);

    useEffect(() => {
        loadProducts();
    }, [slug, activeSubmenu, currentPage, sort]);

    const loadCategory = async () => {
        try {
            const data = await storefrontApi.categoryBySlug(slug);
            setCategory(data);
        } catch (error) {
            console.error('Failed to load category:', error);
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 24,
                category: slug,
                sort,
            };
            
            if (activeSubmenu) {
                params.submenu = activeSubmenu.slug;
            }

            // Add filter params
            if (selectedFilters.categories.length > 0) {
                params.categories = selectedFilters.categories.join(',');
            }
            if (selectedFilters.colors.length > 0) {
                params.colors = selectedFilters.colors.join(',');
            }
            if (selectedFilters.tags.length > 0) {
                params.tags = selectedFilters.tags.join(',');
            }
            if (selectedFilters.brands.length > 0) {
                params.brands = selectedFilters.brands.join(',');
            }
            if (selectedFilters.priceRange.min !== filterData.priceRange.min) {
                params.priceMin = selectedFilters.priceRange.min;
            }
            if (selectedFilters.priceRange.max !== filterData.priceRange.max) {
                params.priceMax = selectedFilters.priceRange.max;
            }

            const data = await storefrontApi.products(params);
            
            if (currentPage === 1) {
                setProducts(data.products || []);
            } else {
                setProducts(prev => [...prev, ...(data.products || [])]);
            }
            
            setHasMore(data.hasMore || false);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmenuChange = (submenu) => {
        setActiveSubmenu(submenu);
        setCurrentPage(1);
    };

    const handleFilterChange = (filters) => {
        setSelectedFilters(filters);
    };

    const handleApplyFilters = () => {
        setIsFilterOpen(false);
        setCurrentPage(1);
        loadProducts();
    };

    const handleResetFilters = () => {
        setSelectedFilters({
            categories: [],
            colors: [],
            tags: [],
            brands: [],
            priceRange: { min: filterData.priceRange.min, max: filterData.priceRange.max },
        });
        setIsFilterOpen(false);
        setCurrentPage(1);
        loadProducts();
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setCurrentPage(prev => prev + 1);
        }
    };

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto" />
                    <p className="mt-4 text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title={category.seo_title || category.name}>
                {category.seo_description && (
                    <meta name="description" content={category.seo_description} />
                )}
                <meta property="og:title" content={category.seo_title || category.name} />
                {category.seo_description && (
                    <meta property="og:description" content={category.seo_description} />
                )}
                {category.cover_image_url && (
                    <meta property="og:image" content={category.cover_image_url} />
                )}
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={category.seo_title || category.name} />
                {category.seo_description && (
                    <meta name="twitter:description" content={category.seo_description} />
                )}
                {category.cover_image_url && (
                    <meta name="twitter:image" content={category.cover_image_url} />
                )}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'CollectionPage',
                            name: category.seo_title || category.name,
                            description: category.seo_description || category.description || '',
                            url: typeof window !== 'undefined' ? window.location.href : '',
                            image: category.cover_image_url || category.image_url || '',
                            breadcrumb: {
                                '@type': 'BreadcrumbList',
                                itemListElement: [
                                    {
                                        '@type': 'ListItem',
                                        position: 1,
                                        name: 'Home',
                                        item: typeof window !== 'undefined' ? window.location.origin : '',
                                    },
                                    {
                                        '@type': 'ListItem',
                                        position: 2,
                                        name: category.name,
                                        item: typeof window !== 'undefined' ? window.location.href : '',
                                    },
                                ],
                            },
                        }),
                    }}
                />
            </Head>

            <DesktopHeader />

            <main className="min-h-screen bg-white">
                {/* Category Hero */}
                <CategoryHero category={category} />

                {/* Submenu Slider */}
                {category.submenus && category.submenus.length > 0 && (
                    <SubmenuSlider
                        submenus={category.submenus}
                        activeSubmenu={activeSubmenu}
                        onSubmenuChange={handleSubmenuChange}
                    />
                )}

                {/* Filter + Sort Toolbar */}
                <div className="sticky top-0 z-30 bg-white border-b border-slate-100">
                    <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
                        <div className="flex items-center justify-between">
                            {/* Filter Button */}
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 lg:hidden"
                            >
                                <Filter className="h-4 w-4" />
                                Filter
                            </button>

                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                            >
                                <Filter className="h-4 w-4" />
                                Filter
                            </button>

                            {/* Sort Dropdown */}
                            <SortDropdown value={sort} onChange={setSort} />
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                    {loading && products.length === 0 ? (
                        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[3/4] bg-slate-200" />
                                    <div className="mt-4 h-4 bg-slate-200 rounded" />
                                    <div className="mt-2 h-4 bg-slate-200 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-lg font-semibold text-slate-600">No products found</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                                {products.map((product) => (
                                    <PremiumProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-12 text-center">
                                    <button
                                        onClick={loadMore}
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Loading...
                                            </>
                                        ) : (
                                            'Load More'
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />

            {/* Desktop Filter Sheet */}
            <DesktopFilterSheet
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={{
                    ...filterData,
                    selectedFilters,
                }}
                onFilterChange={handleFilterChange}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />

            {/* Mobile Filter Sheet */}
            <MobileFilterSheet
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={{
                    ...filterData,
                    selectedFilters,
                }}
                onFilterChange={handleFilterChange}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />
        </>
    );
}
