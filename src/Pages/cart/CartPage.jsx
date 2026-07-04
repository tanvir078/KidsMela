import { Head, Link, usePage } from '@/lib/inertiaCompat';
import { useState, useEffect } from 'react';
import DesktopHeader from '@/Components/Storefront/DesktopHeader';
import Footer from '@/Components/Storefront/Footer';
import LiveChat from '@/Components/Storefront/LiveChat';
import ProductCard from '@/Components/Storefront/ProductCard';
import Toast from '@/Components/Storefront/Toast';
import { useCart } from '@/Contexts/CartContext';
import { useCoupon } from '@/Contexts/CouponContext';
import { useToast } from '@/Contexts/ToastContext';
import { getProducts } from '@/services/products';

const navItems = [
    { label: 'Home', href: '/', match: /^\/$/, icon: 'home' },
    { label: 'Campaigns', href: '/campaigns', match: /^\/campaigns/, icon: 'campaigns' },
    { label: 'Categories', href: '/categories', match: /^\/categories/, icon: 'grid' },
    { label: 'Cart', href: '/cart', match: /^\/cart|^\/checkout/, icon: 'cart' },
    { label: 'Account', href: '/account', match: /^\/account/, icon: 'user' },
];

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

function BottomNavIcon({ icon, active }) {
    const paths = {
        home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
        grid: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
        cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
        user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        campaigns: 'M13 10V3L4 14h7v7l9-11h-7z 0 1 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
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

export default function CartPage() {
    const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();
    const { appliedCoupon, applyCoupon, removeCoupon, calculateDiscount, availableCoupons } = useCoupon();
    const { addToast } = useToast();
    const { url } = usePage();
    const [couponCode, setCouponCode] = useState('');
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    useEffect(() => {
        getProducts().then(setRecommendedProducts);
    }, []);

    const delivery = itemCount > 0 ? 60 : 0;
    const discount = calculateDiscount(subtotal);
    const total = subtotal + delivery - discount;

    const cartProductIds = items.map(item => item.product.id);
    const recommendations = recommendedProducts
        .filter(product => !cartProductIds.includes(product.id))
        .slice(0, 4);

    const handleApplyCoupon = () => {
        if (couponCode.trim()) {
            const success = applyCoupon(couponCode.trim());
            if (success) {
                addToast('Coupon applied successfully!', 'success');
                setCouponCode('');
                setShowCouponInput(false);
            } else {
                addToast('Invalid coupon code', 'error');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
            <DesktopHeader />

            <div className="relative mx-auto min-h-screen max-w-md bg-white lg:max-w-none lg:bg-transparent lg:shadow-none">
            <Head title="Cart" />

            <section className="min-h-screen bg-white pb-24 lg:min-h-0 lg:bg-transparent lg:px-6 lg:py-6">
                <div className="sticky top-0 z-30 border-b border-slate-100 bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-3 shadow-sm lg:hidden">
                    <div className="flex items-center justify-between gap-3">
                        <h1 className="text-lg font-semibold text-white">
                            Cart
                        </h1>

                        <div className="flex items-center gap-3">
                            {showSearchInput ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        placeholder="Search products..."
                                        className="h-9 w-48 rounded-lg border border-slate-200 px-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                                        autoFocus
                                    />
                                    <Link
                                        href={searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search'}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500 text-white shadow-sm transition-colors hover:bg-pink-600"
                                        aria-label="Search"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                                            <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowSearchInput(false);
                                            setSearchQuery('');
                                        }}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                                        aria-label="Close search"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                                            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowSearchInput(true)}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                                        aria-label="Open search"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                                            <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>

                                    {items.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearCart}
                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                                            aria-label="Clear cart"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                                                <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 px-4 py-4 lg:px-0 lg:py-0">
                    <div className="hidden items-center justify-between lg:flex">
                        <h1 className="text-2xl font-black text-slate-950">Cart</h1>
                        {items.length > 0 && (
                            <button
                                type="button"
                                onClick={clearCart}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                {items.length === 0 ? (
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-12 text-center shadow-xl ring-1 ring-slate-200">
                        <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-rose-100">
                            <svg viewBox="0 0 24 24" className="h-16 w-16 text-rose-600" fill="none" aria-hidden="true">
                                <path d="M4 5h2l1.4 9.2a2 2 0 0 0 2 1.8h6.8a2 2 0 0 0 1.9-1.4L20 8H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="1.8" fill="currentColor"/>
                                <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="1.8" fill="currentColor"/>
                            </svg>
                        </div>
                        <h2 className="mt-6 text-2xl font-black text-slate-950">Your cart is empty</h2>
                        <p className="mt-3 text-sm font-semibold text-slate-500">
                            Add products from the home page
                        </p>
                        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-rose-600 px-8 py-4 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all duration-300 hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-300 hover:scale-105">
                            Shop Now
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <article key={item.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200 transition-all duration-300 hover:shadow-xl hover:ring-slate-300">
                                    <Link href={`/products/${item.product.id}`} className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 transition-transform duration-300 hover:scale-105">
                                        {item.product.image_url ? (
                                            <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="grid h-full place-items-center text-xs font-bold text-slate-400">No image</div>
                                        )}
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <p className="line-clamp-2 text-sm font-black leading-5 text-slate-950">
                                            {item.product.name}
                                        </p>
                                        <p className="mt-1 text-xs font-bold text-slate-500">{item.product.category ?? 'Product'}</p>
                                        {(item.product.selected_size || item.product.selected_color) && (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {item.product.selected_size && (
                                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-700">
                                                        Size: {item.product.selected_size}
                                                    </span>
                                                )}
                                                {item.product.selected_color && (
                                                    <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-black text-rose-700">
                                                        Color: {item.product.selected_color}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <p className="mt-2 text-lg font-black text-rose-600">{money(item.product.price)}</p>
                                        <div className="mt-3 flex items-center justify-between gap-2">
                                            <div className="flex h-10 items-center rounded-xl bg-slate-100 px-1">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="grid h-8 w-8 place-items-center rounded-lg bg-white font-black transition-all duration-300 hover:bg-slate-50 hover:scale-110 active:scale-95"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="grid h-8 w-8 place-items-center rounded-lg bg-white font-black transition-all duration-300 hover:bg-slate-50 hover:scale-110 active:scale-95"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600 transition-all duration-300 hover:bg-red-100 hover:shadow-md active:scale-95"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
                            <h2 className="text-xl font-black text-slate-950">Order Summary</h2>
                            <div className="mt-4 space-y-4 text-sm font-bold text-slate-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900">{money(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="text-slate-900">{money(delivery)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount ({appliedCoupon.description})</span>
                                        <span>-{money(discount)}</span>
                                    </div>
                                )}
                                <div className="border-t-2 border-dashed border-slate-200 pt-4">
                                    <div className="flex justify-between text-xl font-black text-slate-950">
                                        <span>Total</span>
                                        <span className="text-rose-600">{money(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {!appliedCoupon ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowCouponInput(!showCouponInput)}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition-all duration-300 hover:bg-slate-200 active:scale-95"
                                    >
                                        <span>🎟️</span>
                                        {showCouponInput ? 'Hide Coupon' : 'Apply Coupon'}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            removeCoupon();
                                            addToast('Coupon removed', 'info');
                                        }}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 transition-all duration-300 hover:bg-emerald-100 active:scale-95"
                                    >
                                        <span>✓</span>
                                        Applied: {appliedCoupon.code}
                                    </button>
                                )}

                                {showCouponInput && !appliedCoupon && (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Enter coupon code"
                                            className="h-12 flex-1 rounded-2xl border-2 border-slate-200 px-4 text-sm font-semibold focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            className="h-12 rounded-2xl bg-rose-600 px-6 text-sm font-black text-white transition-all duration-300 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-200 active:scale-95"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}

                                {!showCouponInput && !appliedCoupon && (
                                    <div className="flex flex-wrap gap-2">
                                        {Object.keys(availableCoupons).slice(0, 3).map((code) => (
                                            <button
                                                key={code}
                                                type="button"
                                                onClick={() => {
                                                    setCouponCode(code);
                                                    setShowCouponInput(true);
                                                }}
                                                className="rounded-full bg-rose-50 px-4 py-2 text-xs font-black text-rose-700 transition-all duration-300 hover:bg-rose-100 hover:shadow-md active:scale-95"
                                            >
                                                {code}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <Link
                                    href="/checkout"
                                    className="mt-5 flex h-14 items-center justify-center rounded-2xl bg-rose-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all duration-300 hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-300 hover:scale-105 active:scale-95"
                                >
                                    Go to Checkout
                                </Link>
                            </div>
                        </div>
                    </>
                )}

                {recommendations.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-slate-950">You may also like</h2>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {recommendations.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
                </div>
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
