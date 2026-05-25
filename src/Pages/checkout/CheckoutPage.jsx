import { Head, Link, router, usePage } from '@/lib/inertiaCompat';
import { useEffect, useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useCart } from '@/Contexts/CartContext';
import { useCoupon } from '@/Contexts/CouponContext';
import { useToast } from '@/Contexts/ToastContext';

function money(value) {
    return '৳' + Number(value ?? 0).toLocaleString();
}

const STEPS = [
    { id: 1, label: 'যোগাযোগ', icon: '👤' },
    { id: 2, label: 'শিপিং', icon: '📦' },
    { id: 3, label: 'পেমেন্ট', icon: '💳' },
    { id: 4, label: 'রিভিউ', icon: '✓' },
];

function StepIndicator({ currentStep }) {
    return (
        <div className="flex items-center justify-between px-2">
            {STEPS.map((step, i) => (
                <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div className={`grid h-9 w-9 place-items-center rounded-full text-sm font-black transition-all duration-300 ${
                            currentStep >= step.id
                                ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                                : 'bg-slate-100 text-slate-400'
                        }`}>
                            {currentStep > step.id ? '✓' : step.icon}
                        </div>
                        <span className={`mt-1 text-[10px] font-bold ${
                            currentStep >= step.id ? 'text-orange-600' : 'text-slate-400'
                        }`}>
                            {step.label}
                        </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div className={`mx-1 h-0.5 w-8 rounded-full transition-all duration-300 sm:w-12 ${
                            currentStep > step.id ? 'bg-orange-600' : 'bg-slate-200'
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
        paymentMethod: 'cod',
        customerNote: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const delivery = itemCount > 0 ? 60 : 0;
    const discount = calculateDiscount(subtotal);
    const giftWrapFee = form.giftWrap ? 50 : 0;
    const total = subtotal + delivery - discount + giftWrapFee;

    const availablePaymentMethods = [
        { id: 'cod', label: 'ক্যাশ অন ডেলিভারি', icon: '💵', enabled: paymentSettings.cod_enabled },
        { id: 'bkash', label: 'bKash', icon: '📱', enabled: true },
        { id: 'nagad', label: 'Nagad', icon: '📲', enabled: true },
        { id: 'stripe', label: 'কার্ড পেমেন্ট', icon: '💳', enabled: paymentSettings.stripe_enabled },
    ].filter(method => method.enabled);

    const enabledPaymentMethods = availablePaymentMethods.length > 0 ? availablePaymentMethods : [{ id: 'cod', label: 'ক্যাশ অন ডেলিভারি', icon: '💵', enabled: true }];

    useEffect(() => {
        if (!enabledPaymentMethods.find(m => m.id === form.paymentMethod)) {
            setForm((current) => ({ ...current, paymentMethod: enabledPaymentMethods[0].id }));
        }
    }, [enabledPaymentMethods, form.paymentMethod]);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const validateStep = (stepNum) => {
        const newErrors = {};
        if (stepNum === 1) {
            if (!form.name.trim()) newErrors.name = 'নাম দিন';
            if (!form.phone.trim()) newErrors.phone = 'ফোন নম্বর দিন';
            if (!form.email.trim()) newErrors.email = 'ইমেইল দিন';
        } else if (stepNum === 2) {
            if (!form.shippingAddress.trim()) newErrors.shippingAddress = 'ঠিকানা দিন';
            if (!form.shippingCity.trim()) newErrors.shippingCity = 'শহর দিন';
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
                    addToast('অর্ডার সফলভাবে প্লেস হয়েছে!', 'success');
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

    const inputClass = "h-12 w-full rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500";

    return (
        <MobileShell title="Checkout" showSearch={false}>
            <Head title="Checkout" />

            <section className="space-y-4 px-4 py-4">
                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <h1 className="text-2xl font-black">চেকআউট</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            {user ? 'আপনার অর্ডার সম্পন্ন করুন' : 'গেস্ট চেকআউট'}
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
                        <h2 className="mt-5 text-xl font-black text-slate-950">কার্ট খালি</h2>
                        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                            শপিং করুন
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
                                        <h2 className="text-lg font-black text-slate-950">যোগাযোগ তথ্য</h2>
                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">পুরো নাম *</label>
                                                <input
                                                    value={form.name}
                                                    onChange={(e) => updateField('name', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="আপনার পুরো নাম"
                                                />
                                                {errors.name && <p className="mt-1 text-xs font-bold text-red-600">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">ফোন নম্বর *</label>
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
                                                <label className="mb-2 block text-xs font-bold text-slate-600">ইমেইল *</label>
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
                                        className="h-12 w-full rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95"
                                    >
                                        পরবর্তী: শিপিং ঠিকানা →
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Shipping */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                        <h2 className="text-lg font-black text-slate-950">শিপিং ঠিকানা</h2>
                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">ঠিকানা *</label>
                                                <textarea
                                                    value={form.shippingAddress}
                                                    onChange={(e) => updateField('shippingAddress', e.target.value)}
                                                    className="min-h-20 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                                    placeholder="বাড়ি, রাস্তা, ল্যান্ডমার্ক"
                                                />
                                                {errors.shippingAddress && <p className="mt-1 text-xs font-bold text-red-600">{errors.shippingAddress}</p>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="mb-2 block text-xs font-bold text-slate-600">শহর *</label>
                                                    <input value={form.shippingCity} onChange={(e) => updateField('shippingCity', e.target.value)} className={inputClass} placeholder="ঢাকা" />
                                                    {errors.shippingCity && <p className="mt-1 text-xs font-bold text-red-600">{errors.shippingCity}</p>}
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-xs font-bold text-slate-600">এলাকা</label>
                                                    <input value={form.shippingArea} onChange={(e) => updateField('shippingArea', e.target.value)} className={inputClass} placeholder="মিরপুর" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="mb-2 block text-xs font-bold text-slate-600">পোস্টকোড</label>
                                                    <input value={form.shippingPostcode} onChange={(e) => updateField('shippingPostcode', e.target.value)} className={inputClass} placeholder="1216" />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-xs font-bold text-slate-600">দেশ</label>
                                                    <input value={form.shippingCountry} onChange={(e) => updateField('shippingCountry', e.target.value)} className={inputClass} placeholder="Bangladesh" />
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                                                <label className="flex items-center gap-2 text-sm font-black text-slate-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={form.billingSameAsShipping}
                                                        onChange={(e) => updateField('billingSameAsShipping', e.target.checked)}
                                                        className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                                    />
                                                    বিলিং ঠিকানা শিপিং-এর মতো
                                                </label>
                                            </div>
                                            {!form.billingSameAsShipping && (
                                                <div className="space-y-3 border-t border-slate-200 pt-3">
                                                    <h3 className="text-sm font-black text-slate-700">বিলিং ঠিকানা</h3>
                                                    <input value={form.billingName} onChange={(e) => updateField('billingName', e.target.value)} className={inputClass} placeholder="বিলিং নাম" />
                                                    <input value={form.billingPhone} onChange={(e) => updateField('billingPhone', e.target.value)} className={inputClass} placeholder="বিলিং ফোন" />
                                                    <textarea value={form.billingAddress} onChange={(e) => updateField('billingAddress', e.target.value)} className="min-h-20 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="বিলিং ঠিকানা" />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input value={form.billingCity} onChange={(e) => updateField('billingCity', e.target.value)} className={inputClass} placeholder="শহর" />
                                                        <input value={form.billingArea} onChange={(e) => updateField('billingArea', e.target.value)} className={inputClass} placeholder="এলাকা" />
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">অর্ডার নোট (ঐচ্ছিক)</label>
                                                <textarea
                                                    value={form.customerNote}
                                                    onChange={(e) => updateField('customerNote', e.target.value)}
                                                    className="min-h-16 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                                    placeholder="ডেলিভারি নির্দেশনা"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={prevStep} className="h-12 flex-1 rounded-2xl bg-slate-100 text-sm font-black text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95">
                                            ← আগের
                                        </button>
                                        <button type="button" onClick={nextStep} className="h-12 flex-[2] rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                                            পরবর্তী: পেমেন্ট →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                        <h2 className="text-lg font-black text-slate-950">পেমেন্ট মেথড</h2>
                                        <div className="mt-4 space-y-2">
                                            {enabledPaymentMethods.map((method) => (
                                                <button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => updateField('paymentMethod', method.id)}
                                                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-black ring-1 transition-all duration-200 ${
                                                        form.paymentMethod === method.id
                                                            ? 'bg-orange-50 text-orange-700 ring-orange-300'
                                                            : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <span className="text-xl">{method.icon}</span>
                                                    <span>{method.label}</span>
                                                    {form.paymentMethod === method.id && (
                                                        <span className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-orange-600 text-xs text-white">✓</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Gift Wrap */}
                                    <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 ring-1 ring-purple-200">
                                        <label className="flex items-center gap-2 text-sm font-black text-purple-700">
                                            <input
                                                type="checkbox"
                                                checked={form.giftWrap}
                                                onChange={(e) => updateField('giftWrap', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            🎁 গিফট র‍্যাপ (+{money(50)})
                                        </label>
                                        {form.giftWrap && (
                                            <div className="mt-3">
                                                <textarea
                                                    value={form.giftMessage}
                                                    onChange={(e) => updateField('giftMessage', e.target.value)}
                                                    className="min-h-16 w-full rounded-xl border-slate-200 px-3 py-2 text-sm font-semibold focus:border-purple-500 focus:ring-purple-500"
                                                    placeholder="গিফট মেসেজ লিখুন..."
                                                    maxLength={200}
                                                />
                                                <p className="mt-1 text-xs font-semibold text-slate-400">{form.giftMessage.length}/200</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                                        <input
                                            type="checkbox"
                                            id="saveInfo"
                                            checked={form.saveInfo}
                                            onChange={(e) => updateField('saveInfo', e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <label htmlFor="saveInfo" className="text-sm font-semibold text-slate-700">
                                            পরবর্তী সময়ের জন্য তথ্য সংরক্ষণ করুন
                                        </label>
                                    </div>

                                    <div className="flex gap-3">
                                        <button type="button" onClick={prevStep} className="h-12 flex-1 rounded-2xl bg-slate-100 text-sm font-black text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95">
                                            ← আগের
                                        </button>
                                        <button type="button" onClick={nextStep} className="h-12 flex-[2] rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                                            পরবর্তী: রিভিউ →
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
                                            <h2 className="text-base font-black text-slate-950">যোগাযোগ</h2>
                                            <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-orange-600">পরিবর্তন</button>
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
                                            <h2 className="text-base font-black text-slate-950">শিপিং</h2>
                                            <button type="button" onClick={() => setStep(2)} className="text-xs font-bold text-orange-600">পরিবর্তন</button>
                                        </div>
                                        <div className="mt-2 text-sm text-slate-600">
                                            <p>{form.shippingAddress}</p>
                                            <p>{[form.shippingArea, form.shippingCity, form.shippingPostcode].filter(Boolean).join(', ')}</p>
                                            <p>{form.shippingCountry}</p>
                                        </div>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-base font-black text-slate-950">পেমেন্ট</h2>
                                            <button type="button" onClick={() => setStep(3)} className="text-xs font-bold text-orange-600">পরিবর্তন</button>
                                        </div>
                                        <p className="mt-2 text-sm font-bold text-slate-600">
                                            {enabledPaymentMethods.find(m => m.id === form.paymentMethod)?.icon}{' '}
                                            {enabledPaymentMethods.find(m => m.id === form.paymentMethod)?.label}
                                        </p>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                        <h2 className="text-lg font-black text-slate-950">অর্ডার সারাংশ</h2>
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
                                                    </div>
                                                    <p className="text-sm font-black text-orange-600">
                                                        {money(Number(item.product.price) * item.quantity)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 space-y-2 border-t border-dashed border-slate-200 pt-4 text-sm font-bold text-slate-600">
                                            <div className="flex justify-between">
                                                <span>সাবটোটাল</span>
                                                <span>{money(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>ডেলিভারি</span>
                                                <span>{money(delivery)}</span>
                                            </div>
                                            {discount > 0 && (
                                                <div className="flex justify-between text-emerald-600">
                                                    <span>ডিসকাউন্ট</span>
                                                    <span>-{money(discount)}</span>
                                                </div>
                                            )}
                                            {giftWrapFee > 0 && (
                                                <div className="flex justify-between text-purple-600">
                                                    <span>গিফট র‍্যাপ</span>
                                                    <span>{money(giftWrapFee)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-black text-slate-950">
                                                <span>মোট</span>
                                                <span className="text-orange-600">{money(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guest login prompt */}
                                    {!user && (
                                        <div className="rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 p-4 ring-1 ring-orange-100">
                                            <p className="text-sm font-bold text-orange-700">
                                                লগইন করলে অর্ডার ট্র্যাক করতে পারবেন
                                            </p>
                                            <div className="mt-3 grid grid-cols-2 gap-3">
                                                <Link href="/login?redirect=/checkout" className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95">
                                                    লগইন
                                                </Link>
                                                <Link href="/register?redirect=/checkout" className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-black text-orange-600 ring-1 ring-orange-200 transition-all duration-200 hover:bg-orange-50 active:scale-95">
                                                    রেজিস্টার
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button type="button" onClick={prevStep} className="h-12 flex-1 rounded-2xl bg-slate-100 text-sm font-black text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95">
                                            ← আগের
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-12 flex-[2] rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95 disabled:bg-slate-300"
                                        >
                                            {isSubmitting ? 'অর্ডার হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
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
