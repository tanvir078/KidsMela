import { Head, Link } from '@/lib/inertiaCompat';
import { useState, useEffect } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import ProductCard from '@/Components/Storefront/ProductCard';
import { useCart } from '@/Contexts/CartContext';
import { useCoupon } from '@/Contexts/CouponContext';
import { useToast } from '@/Contexts/ToastContext';
import { getProducts } from '@/services/products';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function CartPage() {
    const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();
    const { appliedCoupon, applyCoupon, removeCoupon, calculateDiscount, availableCoupons } = useCoupon();
    const { addToast } = useToast();
    const [couponCode, setCouponCode] = useState('');
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    useEffect(() => {
        getProducts().then(setRecommendedProducts);
    }, []);

    const delivery = itemCount > 0 ? 4.99 : 0;
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
        <MobileShell title="Shopping Cart" showSearch={false}>
            <Head title="Cart" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black">My Cart</h1>
                            <p className="mt-1 text-sm font-semibold text-white/90">{itemCount} guest cart items</p>
                        </div>
                        {items.length > 0 && (
                            <button
                                type="button"
                                onClick={clearCart}
                                className="rounded-full bg-white/20 px-4 py-2 text-sm font-black transition-all duration-200 hover:bg-white/30 active:scale-95"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-orange-100">
                            <svg viewBox="0 0 24 24" className="h-12 w-12 text-orange-600" fill="none" aria-hidden="true">
                                <path d="M4 5h2l1.4 9.2a2 2 0 0 0 2 1.8h6.8a2 2 0 0 0 1.9-1.4L20 8H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="1.8" fill="currentColor"/>
                                <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="1.8" fill="currentColor"/>
                            </svg>
                        </div>
                        <h2 className="mt-5 text-xl font-black text-slate-950">Your cart is empty</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            Add products from the home screen and they will stay here after refresh.
                        </p>
                        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-200">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {items.map((item) => (
                                <article key={item.id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md hover:ring-slate-300">
                                    <Link href={`/products/${item.product.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
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
                                        <p className="mt-2 text-lg font-black text-orange-600">{money(item.product.price)}</p>
                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <div className="flex h-9 items-center rounded-xl bg-slate-100 px-1">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="grid h-7 w-7 place-items-center rounded-lg bg-white font-black transition-all duration-200 hover:bg-slate-50 active:scale-95"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="grid h-7 w-7 place-items-center rounded-lg bg-white font-black transition-all duration-200 hover:bg-slate-50 active:scale-95"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.product.id)}
                                                className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition-all duration-200 hover:bg-red-100 active:scale-95"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-lg font-black text-slate-950">Order Summary</h2>
                            <div className="mt-4 space-y-3 text-sm font-bold text-slate-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{money(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery preview</span>
                                    <span>{money(delivery)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount ({appliedCoupon.description})</span>
                                        <span>-{money(discount)}</span>
                                    </div>
                                )}
                                <div className="border-t border-dashed border-slate-200 pt-3">
                                    <div className="flex justify-between text-lg font-black text-slate-950">
                                        <span>Total</span>
                                        <span>{money(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                {!appliedCoupon ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowCouponInput(!showCouponInput)}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95"
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
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 transition-all duration-200 hover:bg-emerald-100 active:scale-95"
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
                                            className="h-12 flex-1 rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            className="h-12 rounded-2xl bg-orange-600 px-4 text-sm font-black text-white transition-all duration-200 hover:bg-orange-700 active:scale-95"
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
                                                className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700 transition-all duration-200 hover:bg-orange-100 active:scale-95"
                                            >
                                                {code}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/checkout"
                                className="mt-5 flex h-12 items-center justify-center rounded-2xl bg-orange-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95"
                            >
                                Go to Checkout
                            </Link>
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
            </section>
        </MobileShell>
    );
}
