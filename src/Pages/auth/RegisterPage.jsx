import { Head, Link, router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useToast } from '@/Contexts/ToastContext';

export default function RegisterPage() {
    const { addToast } = useToast();
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        passwordConfirm: '',
        agreeTerms: false,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';

    const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

    const submit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'আপনার নাম দিন';
        if (!form.phone.trim()) newErrors.phone = 'ফোন নম্বর দিন';
        if (!form.email.trim()) newErrors.email = 'ইমেইল দিন';
        if (!form.password) newErrors.password = 'পাসওয়ার্ড দিন';
        if (form.password.length < 6) newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে';
        if (form.password !== form.passwordConfirm) newErrors.passwordConfirm = 'পাসওয়ার্ড মিলছে না';
        if (!form.agreeTerms) newErrors.agreeTerms = 'শর্তাবলী গ্রহণ করুন';
        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }
        setIsSubmitting(true);
        setErrors({});
        addToast('রেজিস্ট্রেশন সফল হয়েছে!', 'success');
        setTimeout(() => {
            setIsSubmitting(false);
            router.get(redirect);
        }, 800);
    };

    return (
        <MobileShell title="Register" showSearch={false}>
            <Head title="Register" />

            <section className="min-h-[80vh] px-4 py-6">
                {/* Logo & Welcome */}
                <div className="mb-6 text-center">
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-200">
                        <span className="text-3xl font-black text-white">P</span>
                    </div>
                    <h1 className="mt-4 text-2xl font-black text-slate-950">একাউন্ট তৈরি করুন</h1>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Progotix-এ শপিং শুরু করুন</p>
                </div>

                {/* Register Form */}
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">পুরো নাম</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </span>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => update('name', e.target.value)}
                                className="h-12 w-full rounded-2xl border-slate-200 pl-12 pr-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                placeholder="আপনার পুরো নাম"
                            />
                        </div>
                        {errors.name && <p className="mt-1 text-xs font-bold text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">ফোন নম্বর</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                            </span>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => update('phone', e.target.value)}
                                className="h-12 w-full rounded-2xl border-slate-200 pl-12 pr-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                placeholder="01XXXXXXXXX"
                            />
                        </div>
                        {errors.phone && <p className="mt-1 text-xs font-bold text-red-600">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">ইমেইল</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            </span>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => update('email', e.target.value)}
                                className="h-12 w-full rounded-2xl border-slate-200 pl-12 pr-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                placeholder="email@example.com"
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs font-bold text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">পাসওয়ার্ড</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => update('password', e.target.value)}
                                className="h-12 w-full rounded-2xl border-slate-200 pl-12 pr-12 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                placeholder="কমপক্ষে ৬ অক্ষর"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs font-bold text-red-600">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">পাসওয়ার্ড নিশ্চিত করুন</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={form.passwordConfirm}
                                onChange={(e) => update('passwordConfirm', e.target.value)}
                                className="h-12 w-full rounded-2xl border-slate-200 pl-12 pr-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                placeholder="আবার পাসওয়ার্ড দিন"
                            />
                        </div>
                        {errors.passwordConfirm && <p className="mt-1 text-xs font-bold text-red-600">{errors.passwordConfirm}</p>}
                    </div>

                    <label className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                        <input
                            type="checkbox"
                            checked={form.agreeTerms}
                            onChange={(e) => update('agreeTerms', e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span>
                            আমি Progotix-এর{' '}
                            <button type="button" className="font-black text-orange-600">শর্তাবলী</button>{' '}
                            ও{' '}
                            <button type="button" className="font-black text-orange-600">গোপনীয়তা নীতি</button>{' '}
                            মেনে নিচ্ছি
                        </span>
                    </label>
                    {errors.agreeTerms && <p className="text-xs font-bold text-red-600">{errors.agreeTerms}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 w-full rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95 disabled:bg-slate-300"
                    >
                        {isSubmitting ? 'রেজিস্টার হচ্ছে...' : 'রেজিস্টার করুন'}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-bold text-slate-400">অথবা</span>
                    <div className="h-px flex-1 bg-slate-200" />
                </div>

                {/* Social Register */}
                <div className="space-y-3">
                    <button
                        type="button"
                        className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-white text-sm font-black text-slate-700 ring-1 ring-slate-200 transition-all duration-200 hover:bg-slate-50 active:scale-95"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Google দিয়ে সাইন আপ
                    </button>
                    <button
                        type="button"
                        className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#1877F2] text-sm font-black text-white transition-all duration-200 hover:bg-[#166FE5] active:scale-95"
                    >
                        <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Facebook দিয়ে সাইন আপ
                    </button>
                </div>

                {/* Login Link */}
                <p className="mt-8 text-center text-sm font-semibold text-slate-500">
                    একাউন্ট আছে?{' '}
                    <Link href={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="font-black text-orange-600">
                        লগইন করুন
                    </Link>
                </p>
            </section>
        </MobileShell>
    );
}
