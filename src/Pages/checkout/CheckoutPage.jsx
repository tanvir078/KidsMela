import { Head, Link, router, usePage } from '@/lib/inertiaCompat';
import { useEffect, useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useCart } from '@/Contexts/CartContext';
import { useCoupon } from '@/Contexts/CouponContext';
import { useToast } from '@/Contexts/ToastContext';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function CheckoutPage() {
    const { props } = usePage();
    const user = props.auth?.user;
    const paymentSettings = props.paymentSettings || {
        stripe_enabled: false,
        paypal_enabled: false,
        cod_enabled: true,
    };
    const { items, itemCount, subtotal, clearCart } = useCart();
    const { appliedCoupon, calculateDiscount } = useCoupon();
    const { addToast } = useToast();
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        shippingAddress: '',
        shippingCity: '',
        shippingArea: '',
        shippingPostcode: '',
        shippingCountry: 'Bangladesh',
        billingSameAsShipping: true,
        billingName: '',
        billingEmail: '',
        billingPhone: '',
        billingAddress: '',
        billingCity: '',
        billingArea: '',
        billingPostcode: '',
        billingCountry: 'Bangladesh',
        saveInfo: false,
        giftWrap: false,
        giftMessage: '',
        paymentMethod: 'cod',
        customerNote: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const delivery = itemCount > 0 ? 4.99 : 0;
    const discount = calculateDiscount(subtotal);
    const giftWrapFee = form.giftWrap ? 5.99 : 0;
    const total = subtotal + delivery - discount + giftWrapFee;

    const availablePaymentMethods = [
        { id: 'cod', label: 'Cash on Delivery', enabled: paymentSettings.cod_enabled },
        { id: 'stripe', label: 'Stripe Checkout', enabled: paymentSettings.stripe_enabled },
        { id: 'paypal', label: 'PayPal', enabled: paymentSettings.paypal_enabled },
    ].filter(method => method.enabled);

    const enabledPaymentMethods = availablePaymentMethods.length > 0 ? availablePaymentMethods : [{ id: 'cod', label: 'Cash on Delivery', enabled: true }];

    useEffect(() => {
        if (!enabledPaymentMethods.find(m => m.id === form.paymentMethod)) {
            setForm((current) => ({ ...current, paymentMethod: enabledPaymentMethods[0].id }));
        }
    }, [enabledPaymentMethods, form.paymentMethod]);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submitOrder = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (!form.name || !form.email || !form.phone || !form.shippingAddress || !form.shippingCity || !form.shippingCountry) {
            setErrors({ general: 'Please fill in all required fields' });
            setIsSubmitting(false);
            addToast('Please fill in all required fields', 'error');
            return;
        }

        if (!form.billingSameAsShipping && (!form.billingName || !form.billingPhone || !form.billingAddress)) {
            setErrors({ general: 'Please fill in billing details or use same as shipping' });
            setIsSubmitting(false);
            addToast('Please fill in billing details', 'error');
            return;
        }

        router.post(
            '/checkout',
            {
                customer_name: form.name,
                customer_email: form.email,
                customer_phone: form.phone,
                shipping_name: form.name,
                shipping_email: form.email,
                shipping_phone: form.phone,
                shipping_address: form.shippingAddress,
                shipping_city: form.shippingCity,
                shipping_area: form.shippingArea,
                shipping_postcode: form.shippingPostcode,
                shipping_country: form.shippingCountry,
                billing_same_as_shipping: form.billingSameAsShipping,
                billing_name: form.billingSameAsShipping ? form.name : form.billingName,
                billing_email: form.billingSameAsShipping ? form.email : form.billingEmail,
                billing_phone: form.billingSameAsShipping ? form.phone : form.billingPhone,
                billing_address: form.billingSameAsShipping ? form.shippingAddress : form.billingAddress,
                billing_city: form.billingSameAsShipping ? form.shippingCity : form.billingCity,
                billing_area: form.billingSameAsShipping ? form.shippingArea : form.billingArea,
                billing_postcode: form.billingSameAsShipping ? form.shippingPostcode : form.billingPostcode,
                billing_country: form.billingSameAsShipping ? form.shippingCountry : form.billingCountry,
                phone: form.phone,
                email: form.email,
                save_info: form.saveInfo,
                coupon_code: appliedCoupon?.code,
                payment_method: form.paymentMethod,
                customer_note: form.customerNote,
                items: items.map((item) => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                })),
            },
            {
                preserveScroll: true,
                onError: setErrors,
                onSuccess: (payload) => {
                    clearCart();
                    addToast('Order placed successfully!', 'success');
                    if (payload?.checkout_url) {
                        window.location.href = payload.checkout_url;
                    }
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <MobileShell title="Checkout" showSearch={false}>
            <Head title="Checkout" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <h1 className="text-2xl font-black">Checkout Preview</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Guest checkout is active with complete billing and shipping details.
                        </p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-200">
                            <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-400" fill="none" aria-hidden="true">
                                <path d="M4 5h2l1.4 9.2a2 2 0 0 0 2 1.8h6.8a2 2 0 0 0 1.9-1.4L20 8H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="1.8" fill="currentColor"/>
                                <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="1.8" fill="currentColor"/>
                            </svg>
                        </div>
                        <h2 className="mt-5 text-xl font-black text-slate-950">No items to checkout</h2>
                        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                            Shop Products
                        </Link>
                    </div>
                ) : (
                    <>
                        <form onSubmit={submitOrder} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-lg font-black text-slate-950">Contact & Shipping</h2>
                            <div className="mt-4 space-y-3">
                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Full name</label>
                                    <input
                                        value={form.name}
                                        onChange={(event) => updateField('name', event.target.value)}
                                        className="h-12 w-full rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Phone number</label>
                                    <input
                                        value={form.phone}
                                        onChange={(event) => updateField('phone', event.target.value)}
                                        className="h-12 w-full rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Enter your phone number"
                                    />
                                    {errors.phone && <p className="mt-1 text-xs font-bold text-red-600">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(event) => updateField('email', event.target.value)}
                                        className="h-12 w-full rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Enter your email for order updates"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Shipping address</label>
                                    <textarea
                                        value={form.shippingAddress}
                                        onChange={(event) => updateField('shippingAddress', event.target.value)}
                                        className="min-h-24 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="House, road, building, landmark"
                                    />
                                    {errors.shipping_address && (
                                        <p className="mt-1 text-xs font-bold text-red-600">{errors.shipping_address}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input value={form.shippingCity} onChange={(event) => updateField('shippingCity', event.target.value)} className="h-12 rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="City" />
                                    <input value={form.shippingArea} onChange={(event) => updateField('shippingArea', event.target.value)} className="h-12 rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Area" />
                                    <input value={form.shippingPostcode} onChange={(event) => updateField('shippingPostcode', event.target.value)} className="h-12 rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Postcode" />
                                    <input value={form.shippingCountry} onChange={(event) => updateField('shippingCountry', event.target.value)} className="h-12 rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Country" />
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                    <label className="flex items-center gap-2 text-sm font-black text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={form.billingSameAsShipping}
                                            onChange={(event) => updateField('billingSameAsShipping', event.target.checked)}
                                            className="h-5 w-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        Billing address same as shipping
                                    </label>
                                    {!form.billingSameAsShipping && (
                                        <div className="mt-4 space-y-3">
                                            <input value={form.billingName} onChange={(event) => updateField('billingName', event.target.value)} className="h-12 w-full rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Billing name" />
                                            <input value={form.billingEmail} onChange={(event) => updateField('billingEmail', event.target.value)} className="h-12 w-full rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Billing email" />
                                            <input value={form.billingPhone} onChange={(event) => updateField('billingPhone', event.target.value)} className="h-12 w-full rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Billing phone" />
                                            <textarea value={form.billingAddress} onChange={(event) => updateField('billingAddress', event.target.value)} className="min-h-20 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Billing address" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input value={form.billingCity} onChange={(event) => updateField('billingCity', event.target.value)} className="h-12 rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="City" />
                                                <input value={form.billingArea} onChange={(event) => updateField('billingArea', event.target.value)} className="h-12 rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Area" />
                                                <input value={form.billingPostcode} onChange={(event) => updateField('billingPostcode', event.target.value)} className="h-12 rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Postcode" />
                                                <input value={form.billingCountry} onChange={(event) => updateField('billingCountry', event.target.value)} className="h-12 rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Country" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Order note (optional)</label>
                                    <textarea
                                        value={form.customerNote}
                                        onChange={(event) => updateField('customerNote', event.target.value)}
                                        className="min-h-20 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Delivery instruction or note"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="saveInfo"
                                        checked={form.saveInfo}
                                        onChange={(event) => updateField('saveInfo', event.target.checked)}
                                        className="h-5 w-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <label htmlFor="saveInfo" className="text-sm font-semibold text-slate-700">
                                        Save my information for next time
                                    </label>
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Payment method</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {enabledPaymentMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => updateField('paymentMethod', method.id)}
                                                className={`rounded-2xl px-4 py-3 text-sm font-black ring-1 ${form.paymentMethod === method.id ? 'bg-slate-950 text-white ring-slate-950' : 'bg-white text-slate-700 ring-slate-200'}`}
                                            >
                                                {method.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 ring-1 ring-purple-200">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="giftWrap"
                                            checked={form.giftWrap}
                                            onChange={(event) => updateField('giftWrap', event.target.checked)}
                                            className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <label htmlFor="giftWrap" className="text-sm font-black text-purple-700">
                                            🎁 Gift Wrap (+{money(5.99)})
                                        </label>
                                    </div>
                                    {form.giftWrap && (
                                        <div className="mt-3">
                                            <label className="mb-2 block text-xs font-bold text-slate-600">Gift Message (optional)</label>
                                            <textarea
                                                value={form.giftMessage}
                                                onChange={(event) => updateField('giftMessage', event.target.value)}
                                                className="min-h-20 w-full rounded-xl border-slate-200 px-3 py-2 text-sm font-semibold focus:border-purple-500 focus:ring-purple-500"
                                                placeholder="Add a personal message..."
                                                maxLength={200}
                                            />
                                            <p className="mt-1 text-xs font-semibold text-slate-400">{form.giftMessage.length}/200</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-4 h-12 w-full rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95 disabled:bg-slate-300"
                            >
                                {isSubmitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </form>

                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-lg font-black text-slate-950">Order Summary</h2>
                            <div className="mt-3 space-y-3">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                                        <div className="min-w-0">
                                            <p className="truncate font-black text-slate-950">{item.product.name}</p>
                                            <p className="font-bold text-slate-500">Qty {item.quantity}</p>
                                        </div>
                                        <p className="font-black text-orange-600">
                                            {money(Number(item.product.price) * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 space-y-2 border-t border-dashed border-slate-200 pt-4 text-sm font-bold text-slate-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{money(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span>{money(delivery)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount</span>
                                        <span>-{money(discount)}</span>
                                    </div>
                                )}
                                {giftWrapFee > 0 && (
                                    <div className="flex justify-between text-purple-600">
                                        <span>Gift Wrap</span>
                                        <span>{money(giftWrapFee)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-black text-slate-950">
                                    <span>Total</span>
                                    <span className="text-orange-600">{money(total)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 p-4 ring-1 ring-orange-100">
                            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-orange-100/50" />
                            <div className="relative">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">ℹ️</span>
                                    <p className="text-sm font-black text-orange-700">
                                        {user ? 'Ready to place your order' : 'Guest checkout is available'}
                                    </p>
                                </div>
                                <p className="mt-2 text-xs font-semibold leading-5 text-orange-700/80">
                                    {user
                                        ? 'Your order will be saved to your Progotix account and visible in the Orders tab.'
                                        : 'Place the order now, or sign in first if you want account-based order history.'}
                                </p>
                                {!user && (
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <Link href="/login?redirect=/checkout" className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95">
                                            <span>🔑</span>
                                            Login
                                        </Link>
                                        <Link href="/register?redirect=/checkout" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-orange-600 ring-1 ring-orange-200 transition-all duration-200 hover:bg-orange-50 active:scale-95">
                                            <span>📝</span>
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </section>
        </MobileShell>
    );
}
