import { useState, useEffect } from 'react';
import { Head, usePage } from '@/lib/inertiaCompat';
import DesktopHeader from '@/Components/Storefront/DesktopHeader';
import Footer from '@/Components/Storefront/Footer';
import Breadcrumb from '@/Components/Storefront/Breadcrumb';
import ProductMedia from '@/Components/Storefront/ProductMedia';
import ProductInfo from '@/Components/Storefront/ProductInfo';
import ProductTabs from '@/Components/Storefront/ProductTabs';
import PremiumProductCard from '@/Components/Storefront/PremiumProductCard';
import MobileProductActionBar from '@/Components/Storefront/MobileProductActionBar';
import RecentlyViewedSlider from '@/Components/Storefront/RecentlyViewedSlider';
import { storefrontApi } from '@/lib/api';
import { useCart } from '@/Contexts/CartContext';
import { useRecentlyViewed } from '@/Contexts/RecentlyViewedContext';

export default function ProductDetailPage({ slug }) {
    const { props } = usePage();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const { addToRecentlyViewed, getRecentlyViewed } = useRecentlyViewed();

    useEffect(() => {
        loadProduct();
        loadRecentlyViewed();
    }, [slug]);

    useEffect(() => {
        if (product) {
            addToRecentlyViewed(product);
        }
    }, [product, addToRecentlyViewed]);

    const loadRecentlyViewed = () => {
        setRecentlyViewed(getRecentlyViewed());
    };

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await storefrontApi.productBySlug(slug);
            setProduct(data.product);
            setRelatedProducts(data.related_products || []);
            setError(null);
        } catch (err) {
            setError('Failed to load product');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (cartData) => {
        try {
            await addToCart(cartData);
            // Show success notification
        } catch (err) {
            console.error('Failed to add to cart', err);
        }
    };

    const handleBuyNow = async (cartData) => {
        try {
            await addToCart(cartData);
            // Navigate to checkout
            window.location.href = '/checkout';
        } catch (err) {
            console.error('Failed to buy now', err);
        }
    };

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        ...(product?.categoryModel ? [{ label: product.categoryModel.name, href: `/categories/${product.categoryModel.slug}` }] : []),
        ...(product?.subcategory ? [{ label: product.subcategory, href: '#' }] : []),
        ...(product ? [{ label: product.name }] : []),
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <DesktopHeader />
                <div className="flex min-h-[600px] items-center justify-center">
                    <div className="text-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto" />
                        <p className="mt-4 text-slate-600">Loading...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-white">
                <DesktopHeader />
                <div className="flex min-h-[600px] items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-red-600">{error || 'Product not found'}</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Head>
                <title>{product.meta_title || product.name} | Rafi Fashion</title>
                {product.meta_description && (
                    <meta name="description" content={product.meta_description} />
                )}
                {product.meta_keywords && (
                    <meta name="keywords" content={product.meta_keywords} />
                )}
                <meta property="og:title" content={product.meta_title || product.name} />
                {product.meta_description && (
                    <meta property="og:description" content={product.meta_description} />
                )}
                {product.og_image && (
                    <meta property="og:image" content={product.og_image} />
                )}
                <meta property="og:type" content="product" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={product.meta_title || product.name} />
                {product.meta_description && (
                    <meta name="twitter:description" content={product.meta_description} />
                )}
                {product.og_image && (
                    <meta name="twitter:image" content={product.og_image} />
                )}
                {product.canonical_url && (
                    <link rel="canonical" href={product.canonical_url} />
                )}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Product',
                            name: product.name,
                            description: product.description,
                            image: product.display_image_url || product.image_url,
                            sku: product.sku,
                            brand: {
                                '@type': 'Brand',
                                name: product.brand?.name || 'Rafi Fashion',
                            },
                            offers: {
                                '@type': 'Offer',
                                price: product.sale_price || product.price,
                                priceCurrency: 'BDT',
                                availability: product.stock_status === 'in_stock' 
                                    ? 'https://schema.org/InStock'
                                    : 'https://schema.org/OutOfStock',
                            },
                        }),
                    }}
                />
            </Head>

            <DesktopHeader />

            <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 pb-24 lg:pb-6">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                {/* Product Hero Section */}
                <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left Column - Product Media (55%) */}
                    <div className="lg:col-span-7">
                        <ProductMedia product={product} />
                    </div>

                    {/* Right Column - Product Info (45%) */}
                    <div className="lg:col-span-5">
                        <ProductInfo 
                            product={product} 
                            onAddToCart={handleAddToCart}
                            onBuyNow={handleBuyNow}
                        />
                    </div>
                </div>

                {/* Product Information Tabs */}
                <ProductTabs product={product} />

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <section className="py-12">
                        <h2 className="mb-6 text-2xl font-black text-slate-900">Related Products</h2>
                        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 md:grid-cols-3 xl:grid-cols-4">
                            {relatedProducts.slice(0, 8).map((relatedProduct) => (
                                <PremiumProductCard 
                                    key={relatedProduct.id} 
                                    product={relatedProduct} 
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Recently Viewed Section */}
                {recentlyViewed.length > 0 && (
                    <RecentlyViewedSlider products={recentlyViewed} />
                )}
            </main>

            {/* Mobile Action Bar */}
            <MobileProductActionBar 
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                disabled={product.stock_status === 'out_of_stock'}
            />

            <Footer />
        </div>
    );
}
