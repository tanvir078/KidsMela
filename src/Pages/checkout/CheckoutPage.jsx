import { Head, Link, router, usePage } from '@/lib/inertiaCompat';
import { useEffect, useState, useRef } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useCart } from '@/Contexts/CartContext';
import { useCoupon } from '@/Contexts/CouponContext';
import { useToast } from '@/Contexts/ToastContext';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

const SHIPPING_METHODS = [
    { id: 'standard', label: 'Standard Delivery', timeline: 'Dhaka 1-2 days, outside Dhaka 3-5 days', fee: 60 },
    { id: 'express', label: 'Express Delivery', timeline: 'Same/next day in supported city areas', fee: 120 },
    { id: 'pickup', label: 'Store Pickup', timeline: 'Pickup after order confirmation', fee: 0 },
];

const DELIVERY_TIME_SLOTS = [
    { id: 'anytime', label: 'Anytime', description: 'Deliver anytime during business hours' },
    { id: 'morning', label: 'Morning (9AM - 12PM)', description: 'Morning delivery slot' },
    { id: 'afternoon', label: 'Afternoon (12PM - 5PM)', description: 'Afternoon delivery slot' },
    { id: 'evening', label: 'Evening (5PM - 9PM)', description: 'Evening delivery slot' },
];

const BANGLADESH_CITIES = [
    'Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Rangpur', 'Barisal', 'Comilla',
    'Gazipur', 'Narayanganj', 'Mymensingh', 'Bogra', 'Cox\'s Bazar', 'Jessore', 'Dinajpur'
];

const DHAKA_AREAS = [
    'Mirpur', 'Uttara', 'Dhanmondi', 'Gulshan', 'Banani', 'Mohammadpur', 'Pallabi', 'Adabor',
    'Cantonment', 'Dhaka Cantonment', 'Tejgaon', 'Farmgate', 'Motijheel', 'Paltan', 'Baily Road',
    'Ramna', 'New Market', 'Elephant Road', 'Shahbagh', 'Science Laboratory', 'Dhanmondi 27',
    'Lalmatia', 'Hazaribagh', 'Kamrangirchar', 'Keraniganj', 'Savar', 'Ashulia', 'Tongi', 'Gazipur Sadar'
];

const STEPS = [
    { id: 1, label: 'Contact', icon: '👤' },
    { id: 2, label: 'Shipping', icon: '📦' },
    { id: 3, label: 'Payment', icon: '💳' },
    { id: 4, label: 'Review', icon: '✓' },
];

function StepIndicator({ currentStep }) {
    return (
        <div className="flex items-center justify-between px-2">
            {STEPS.map((step, i) => (
                <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div className={`grid h-10 w-10 place-items-center rounded-full text-sm font-black transition-all duration-300 ${
                            currentStep >= step.id
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                                : 'bg-slate-100 text-slate-400'
                        }`}>
                            {currentStep > step.id ? '✓' : step.icon}
                        </div>
                        <span className={`mt-2 text-[10px] font-bold ${
                            currentStep >= step.id ? 'text-rose-600' : 'text-slate-400'
                        }`}>
                            {step.label}
                        </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div className={`mx-2 h-0.5 w-10 rounded-full transition-all duration-300 sm:w-16 ${
                            currentStep > step.id ? 'bg-rose-600' : 'bg-slate-200'
                        }`} />
                    )}
                </div>
            ))}
        </div>
    );
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
    const [step, setStep] = useState(1);
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
        shippingMethod: 'standard',
        paymentMethod: 'cod',
        customerNote: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedShippingMethod = SHIPPING_METHODS.find((method) => method.id === form.shippingMethod) || SHIPPING_METHODS[0];
    
    // Address autocomplete states
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [areaSuggestions, setAreaSuggestions] = useState([]);
    const cityInputRef = useRef(null);
    const areaInputRef = useRef(null);
    const delivery = itemCount > 0 ? selectedShippingMethod.fee : 0;
    const discount = calculateDiscount(subtotal);
    const giftWrapFee = form.giftWrap ? 50 : 0;
    const total = subtotal + delivery - discount + giftWrapFee;

    const availablePaymentMethods = [
        { id: 'cod', label: 'Cash on Delivery', icon: '💵', enabled: paymentSettings.cod_enabled },
        { id: 'bkash', label: 'bKash Manual Payment', icon: '📱', enabled: true, submitsAs: 'cod' },
        { id: 'nagad', label: 'Nagad Manual Payment', icon: '📲', enabled: true, submitsAs: 'cod' },
        { id: 'stripe', label: 'Card Payment', icon: '💳', enabled: paymentSettings.stripe_enabled },
    ].filter(method => method.enabled);

    const enabledPaymentMethods = availablePaymentMethods.length > 0 ? availablePaymentMethods : [{ id: 'cod', label: 'Cash on Delivery', icon: '💵', enabled: true }];

    useEffect(() => {
        if (!enabledPaymentMethods.find(m => m.id === form.paymentMethod)) {
            setForm((current) => ({ ...current, paymentMethod: enabledPaymentMethods[0].id }));
        }
    }, [enabledPaymentMethods, form.paymentMethod]);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    // City autocomplete handler
    const handleCityChange = (value) => {
        updateField('shippingCity', value);
        if (value.trim().length >= 1) {
            const filtered = BANGLADESH_CITIES.filter(city =>
                city.toLowerCase().includes(value.toLowerCase())
            );
            setCitySuggestions(filtered);
            setShowCitySuggestions(filtered.length > 0);
        } else {
            setCitySuggestions([]);
            setShowCitySuggestions(false);
        }
    };

    // Area autocomplete handler
    const handleAreaChange = (value) => {
        updateField('shippingArea', value);
        if (value.trim().length >= 1) {
            const filtered = DHAKA_AREAS.filter(area =>
                area.toLowerCase().includes(value.toLowerCase())
            );
            setAreaSuggestions(filtered);
            setShowAreaSuggestions(filtered.length > 0);
        } else {
            setAreaSuggestions([]);
            setShowAreaSuggestions(false);
        }
    };

    const selectCity = (city) => {
        updateField('shippingCity', city);
        setShowCitySuggestions(false);
    };

    const selectArea = (area) => {
        updateField('shippingArea', area);
        setShowAreaSuggestions(false);
    };

    const validateStep = (stepNum) => {
        const newErrors = {};
        if (stepNum === 1) {
            if (!form.name.trim()) newErrors.name = 'Name is required';
            if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
            if (!form.email.trim()) newErrors.email = 'Email is required';
        } else if (stepNum === 2) {
            if (!form.shippingAddress.trim()) newErrors.shippingAddress = 'Address is required';
            if (!form.shippingCity.trim()) newErrors.shippingCity = 'City is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep((s) => Math.min(s + 1, 4));
        }
    };

    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const submitOrder = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        const selectedPaymentMethod = enabledPaymentMethods.find((method) => method.id === form.paymentMethod);
        const backendPaymentMethod = selectedPaymentMethod?.submitsAs || form.paymentMethod;
        const variantLines = items.map((item) => {
            const size = item.product.selected_size ? `Size: ${item.product.selected_size}` : null;
            const color = item.product.selected_color ? `Color: ${item.product.selected_color}` : null;
            return `${item.product.name} (${[size, color].filter(Boolean).join(', ') || 'No variant selected'}) x${item.quantity}`;
        });
        const orderNotes = [
            form.customerNote && `Customer note: ${form.customerNote}`,
            `Delivery method: ${selectedShippingMethod.label} - ${selectedShippingMethod.timeline}`,
            form.giftWrap && `Gift wrap requested${form.giftMessage ? `: ${form.giftMessage}` : ''}`,
            `Fashion variants: ${variantLines.join(' | ')}`,
            selectedPaymentMethod?.submitsAs && `Payment preference: ${selectedPaymentMethod.label}`,
        ].filter(Boolean).join('\n');

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
                payment_method: backendPaymentMethod,
                customer_note: orderNotes,
                items: items.map((item) => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    selected_size: item.product.selected_size,
                    selected_color: item.product.selected_color,
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

    const inputClass = "h-12 w-full rounded-2xl border-2 border-slate-200 px-4 text-sm font-semibold focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all duration-300";

    return (
        <MobileShell title="Checkout" showSearch={false} simpleHeader={true}>
            <Head title="Checkout" />

            <section className="space-y-4 px-4 py-4">
                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-rose-950 to-fuchsia-900 p-5 text-white shadow-xl shadow-rose-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <h1 className="text-2xl font-black">Kids Mela Checkout</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            {user ? 'Complete your order' : 'Guest Checkout'}
                        </p>
                    </div>
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
                        <h2 className="mt-6 text-2xl font-black text-slate-950">Cart is empty</h2>
                        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-rose-600 px-8 py-4 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all duration-300 hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-300 hover:scale-105">
                            Shop Now
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Step Indicator */}
                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <StepIndicator currentStep={step} />
                        </div>

                        <form onSubmit={submitOrder}>
                            {/* Step 1: Contact Info */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                        <h2 className="text-lg font-black text-slate-950">Contact Information</h2>
                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">Full Name *</label>
                                                <input
                                                    value={form.name}
                                                    onChange={(e) => updateField('name', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="Your full name"
                                                />
                                                {errors.name && <p className="mt-1 text-xs font-bold text-red-600">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    value={form.phone}
                                                    onChange={(e) => updateField('phone', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="01XXXXXXXXX"
                                                />
                                                {errors.phone && <p className="mt-1 text-xs font-bold text-red-600">{errors.phone}</p>}
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">Email *</label>
                                                <input
                                                    type="email"
                                                    value={form.email}
                                                    onChange={(e) => updateField('email', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="email@example.com"
                                                />
                                                {errors.email && <p className="mt-1 text-xs font-bold text-red-600">{errors.email}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="h-12 w-full rounded-2xl bg-rose-600 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all duration-300 hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-300 active:scale-95"
                                    >
                                        Next: Shipping Address →
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Shipping */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="rounded-3xl bg-white p-4 shadow-md ring-1 ring-slate-200">
                                        <h2 className="text-lg font-black text-slate-950">Shipping Address</h2>
                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">Address *</label>
                                                <textarea
                                                    value={form.shippingAddress}
                                                    onChange={(e) => updateField('shippingAddress', e.target.value)}
                                                    className="min-h-20 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-semibold focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all duration-300"
                                                    placeholder="House, street, landmark"
                                                />
                                                {errors.shippingAddress && <p className="mt-1 text-xs font-bold text-red-600">{errors.shippingAddress}</p>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="relative">
                                                    <label className="mb-2 block text-xs font-bold text-slate-600">City *</label>
                                                    <input
                                                        ref={cityInputRef}
                                                        value={form.shippingCity}
                                                        onChange={(e) => handleCityChange(e.target.value)}
                                                        onFocus={() => setShowCitySuggestions(citySuggestions.length > 0)}
                                                        onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                                                        className={inputClass}
                                                        placeholder="Dhaka"
                                                    />
                                                    {errors.shippingCity && <p className="mt-1 text-xs font-bold text-red-600">{errors.shippingCity}</p>}
                                                    {showCitySuggestions && citySuggestions.length > 0 && (
                                                        <div className="absolute z-50 mt-1 w-full rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 max-h-40 overflow-y-auto">
                                                            {citySuggestions.map((city) => (
                                                                <button
                                                                    key={city}
                                                                    type="button"
                                                                    onClick={() => selectCity(city)}
                                                                    className="w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                                                >
                                                                    {city}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <label className="mb-2 block text-xs font-bold text-slate-600">Area</label>
                                                    <input
                                                        ref={areaInputRef}
                                                        value={form.shippingArea}
                                                        onChange={(e) => handleAreaChange(e.target.value)}
                                                        onFocus={() => setShowAreaSuggestions(areaSuggestions.length > 0)}
                                                        onBlur={() => setTimeout(() => setShowAreaSuggestions(false), 200)}
                                                        className={inputClass}
                                                        placeholder="Mirpur"
                                                    />
                                                    {showAreaSuggestions && areaSuggestions.length > 0 && (
                                                        <div className="absolute z-50 mt-1 w-full rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 max-h-40 overflow-y-auto">
                                                            {areaSuggestions.map((area) => (
                                                                <button
                                                                    key={area}
                                                                    type="button"
                                                                    onClick={() => selectArea(area)}
                                                                    className="w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                                                >
                                                                    {area}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="mb-2 block text-xs font-bold text-slate-600">Postcode</label>
                                                    <input value={form.shippingPostcode} onChange={(e) => updateField('shippingPostcode', e.target.value)} className={inputClass} placeholder="1216" />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-xs font-bold text-slate-600">Country</label>
                                                    <input value={form.shippingCountry} onChange={(e) => updateField('shippingCountry', e.target.value)} className={inputClass} placeholder="Bangladesh" />
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                                                <label className="flex items-center gap-2 text-sm font-black text-slate-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={form.billingSameAsShipping}
                                                        onChange={(e) => updateField('billingSameAsShipping', e.target.checked)}
                                                        className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                                                    />
                                                    Billing address same as shipping
                                                </label>
                                            </div>
                                            {!form.billingSameAsShipping && (
                                                <div className="space-y-3 border-t border-slate-200 pt-3">
                                                    <h3 className="text-sm font-black text-slate-700">Billing Address</h3>
                                                    <input value={form.billingName} onChange={(e) => updateField('billingName', e.target.value)} className={inputClass} placeholder="Billing name" />
                                                    <input value={form.billingPhone} onChange={(e) => updateField('billingPhone', e.target.value)} className={inputClass} placeholder="Billing phone" />
                                                    <textarea value={form.billingAddress} onChange={(e) => updateField('billingAddress', e.target.value)} className="min-h-20 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-rose-500 focus:ring-rose-500" placeholder="Billing address" />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input value={form.billingCity} onChange={(e) => updateField('billingCity', e.target.value)} className={inputClass} placeholder="City" />
                                                        <input value={form.billingArea} onChange={(e) => updateField('billingArea', e.target.value)} className={inputClass} placeholder="Area" />
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">Order Note (optional)</label>
                                                <textarea
                                                    value={form.customerNote}
                                                    onChange={(e) => updateField('customerNote', e.target.value)}
                                                    className="min-h-16 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-rose-500 focus:ring-rose-500"
                                                    placeholder="Delivery instructions"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-3xl bg-white p-4 shadow-md ring-1 ring-slate-200">
                                        <h2 className="text-lg font-black text-slate-950">Delivery Method</h2>
                                        <div className="mt-4 space-y-3">
                                            {SHIPPING_METHODS.map((method) => (
                                                <button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => updateField('shippingMethod', method.id)}
                                                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-4 text-left ring-2 transition-all duration-300 ${
                                                        form.shippingMethod === method.id
                                                            ? 'bg-rose-50 text-rose-700 ring-rose-500 shadow-md'
                                                            : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300'
                                                    }`}
                                                >
                                                    <span>
                                                        <span className="block text-sm font-black">{method.label}</span>
                                                        <span className="mt-1 block text-xs font-semibold text-slate-500">{method.timeline}</span>
                                                    </span>
                                                    <span className="shrink-0 text-sm font-black">{money(method.fee)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={prevStep} className="h-12 flex-1 rounded-2xl bg-slate-100 text-sm font-black text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95">
                                            ← Previous
                                        </button>
                                        <button type="button" onClick={nextStep} className="h-12 flex-[2] rounded-2xl bg-rose-600 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all duration-200 hover:bg-rose-700 active:scale-95">
                                            Next: Payment →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="rounded-3xl bg-white p-4 shadow-md ring-1 ring-slate-200">
                                        <h2 className="text-lg font-black text-slate-950">Payment Method</h2>
                                        <div className="mt-4 space-y-3">
                                            {enabledPaymentMethods.map((method) => (
                                                <button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => updateField('paymentMethod', method.id)}
                                                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-black ring-2 transition-all duration-300 ${
                                                        form.paymentMethod === method.id
                                                            ? 'bg-rose-50 text-rose-700 ring-rose-500 shadow-md'
                                                            : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300'
                                                    }`}
                                                >
                                                    <span className="text-xl">{method.icon}</span>
                                                    <span>{method.label}</span>
                                                    {form.paymentMethod === method.id && (
                                                        <span className="ml-auto grid h-6 w-6 place-items-center rounded-full bg-rose-600 text-xs text-white shadow-md">✓</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        {enabledPaymentMethods.find((method) => method.id === form.paymentMethod)?.submitsAs && (
                                            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
                                                Manual mobile payment will be confirmed by Kids Mela support after order placement.
                                            </p>
                                        )}
                                    </div>

                                    {/* Gift Wrap */}
                                    <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 shadow-md ring-1 ring-purple-200">
                                        <label className="flex items-center gap-2 text-sm font-black text-purple-700">
                                            <input
                                                type="checkbox"
                                                checked={form.giftWrap}
                                                onChange={(e) => updateField('giftWrap', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            🎁 Gift Wrap (+{money(50)})
                                        </label>
                                        {form.giftWrap && (
                                            <div className="mt-3">
                                                <textarea
                                                    value={form.giftMessage}
                                                    onChange={(e) => updateField('giftMessage', e.target.value)}
                                                    className="min-h-16 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-semibold focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                                                    placeholder="Write a gift message..."
                                                    maxLength={200}
                                                />
                                                <p className="mt-1 text-xs font-semibold text-slate-400">{form.giftMessage.length}/200</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 transition-all hover:bg-slate-100">
                                        <input
                                            type="checkbox"
                                            id="saveInfo"
                                            checked={form.saveInfo}
                                            onChange={(e) => updateField('saveInfo', e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                                        />
                                        <label htmlFor="saveInfo" className="text-sm font-semibold text-slate-700">
                                            Save info for next time
                                        </label>
                                    </div>

                                    <div className="flex gap-3">
                                        <button type="button" onClick={prevStep} className="h-12 flex-1 rounded-2xl bg-slate-100 text-sm font-black text-slate-700 transition-all duration-300 hover:bg-slate-200 active:scale-95">
                                            ← Previous
                                        </button>
                                        <button type="button" onClick={nextStep} className="h-12 flex-[2] rounded-2xl bg-rose-600 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all duration-300 hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-300 active:scale-95">
                                            Next: Review →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Review & Confirm */}
                            {step === 4 && (
                                <div className="space-y-4">
                                    {/* Contact Summary */}
                                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-base font-black text-slate-950">Contact</h2>
                                            <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-orange-600">Change</button>
                                        </div>
                                        <div className="mt-2 space-y-1 text-sm text-slate-600">
                                            <p className="font-bold">{form.name}</p>
                                            <p>{form.phone}</p>
                                            <p>{form.email}</p>
                                        </div>
                                    </div>

                                    {/* Shipping Summary */}
                                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-base font-black text-slate-950">Shipping</h2>
                                            <button type="button" onClick={() => setStep(2)} className="text-xs font-bold text-orange-600">Change</button>
                                        </div>
                                        <div className="mt-2 text-sm text-slate-600">
                                            <p>{form.shippingAddress}</p>
                                            <p>{[form.shippingArea, form.shippingCity, form.shippingPostcode].filter(Boolean).join(', ')}</p>
                                            <p>{form.shippingCountry}</p>
                                            <p className="mt-2 font-black text-rose-700">{selectedShippingMethod.label}: {selectedShippingMethod.timeline}</p>
                                        </div>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-base font-black text-slate-950">Payment</h2>
                                            <button type="button" onClick={() => setStep(3)} className="text-xs font-bold text-orange-600">Change</button>
                                        </div>
                                        <p className="mt-2 text-sm font-bold text-slate-600">
                                            {enabledPaymentMethods.find(m => m.id === form.paymentMethod)?.icon}{' '}
                                            {enabledPaymentMethods.find(m => m.id === form.paymentMethod)?.label}
                                        </p>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                        <h2 className="text-lg font-black text-slate-950">Order Summary</h2>
                                        <div className="mt-3 space-y-3">
                                            {items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-3">
                                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                                        {item.product.image_url ? (
                                                            <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="grid h-full place-items-center text-[10px] font-bold text-slate-400">No img</div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-black text-slate-950">{item.product.name}</p>
                                                        <p className="text-xs font-bold text-slate-500">x{item.quantity}</p>
                                                        {(item.product.selected_size || item.product.selected_color) && (
                                                            <p className="mt-0.5 text-[11px] font-black text-rose-600">
                                                                {[item.product.selected_size && `Size ${item.product.selected_size}`, item.product.selected_color && item.product.selected_color].filter(Boolean).join(' / ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-black text-rose-600">
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
                                                <span className="text-rose-600">{money(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guest login prompt */}
                                    {!user && (
                                        <div className="rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 p-4 ring-1 ring-orange-100">
                                            <p className="text-sm font-bold text-orange-700">
                                                Login to track your orders
                                            </p>
                                            <div className="mt-3 grid grid-cols-2 gap-3">
                                                <Link href="/login?redirect=/checkout" className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95">
                                                    Login
                                                </Link>
                                                <Link href="/register?redirect=/checkout" className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-black text-orange-600 ring-1 ring-orange-200 transition-all duration-200 hover:bg-orange-50 active:scale-95">
                                                    Register
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button type="button" onClick={prevStep} className="h-12 flex-1 rounded-2xl bg-slate-100 text-sm font-black text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95">
                                            ← Previous
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-12 flex-[2] rounded-2xl bg-rose-600 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all duration-200 hover:bg-rose-700 active:scale-95 disabled:bg-slate-300"
                                        >
                                            {isSubmitting ? 'Ordering...' : 'Confirm Order'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </>
                )}
            </section>
        </MobileShell>
    );
}
