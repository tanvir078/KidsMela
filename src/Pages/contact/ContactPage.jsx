import { Head, Link } from '@/lib/inertiaCompat';
import { useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useToast } from '@/Contexts/ToastContext';

export default function ContactPage() {
    const { addToast } = useToast();
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

    const submit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Enter your name';
        if (!form.email.trim()) newErrors.email = 'Enter your email';
        if (!form.phone.trim()) newErrors.phone = 'Enter your phone number';
        if (!form.subject.trim()) newErrors.subject = 'Enter subject';
        if (!form.message.trim()) newErrors.message = 'Enter your message';
        
        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            addToast('Message sent successfully!', 'success');
            setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 1000);
    };

    return (
        <MobileShell title="Contact Us">
            <Head title="Contact Us" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                            Get in Touch
                        </p>
                        <h1 className="mt-2 text-2xl font-black">Contact Us</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            We'd love to hear from you
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Send us a message</h2>
                    <form onSubmit={submit} className="mt-4 space-y-4">
                        <div>
                            <label className="mb-2 block text-xs font-bold text-slate-600">Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => update('name', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
                                placeholder="Your name"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-bold text-slate-600">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => update('email', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
                                placeholder="your@email.com"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-bold text-slate-600">Phone</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => update('phone', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
                                placeholder="01XXXXXXXXX"
                            />
                            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-bold text-slate-600">Subject</label>
                            <input
                                type="text"
                                value={form.subject}
                                onChange={(e) => update('subject', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
                                placeholder="How can we help?"
                            />
                            {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-bold text-slate-600">Message</label>
                            <textarea
                                value={form.message}
                                onChange={(e) => update('message', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
                                rows={4}
                                placeholder="Tell us more..."
                            />
                            {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Contact Information</h2>
                    <div className="mt-4 space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-lg">📍</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Address</h3>
                                <p className="mt-1 font-medium text-slate-600">Dhaka, Bangladesh</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-lg">📞</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Phone</h3>
                                <p className="mt-1 font-medium text-slate-600">+880 1XXX-XXXXXX</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-lg">✉️</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Email</h3>
                                <p className="mt-1 font-medium text-slate-600">support@kidsmela.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-lg">⏰</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Business Hours</h3>
                                <p className="mt-1 font-medium text-slate-600">Saturday - Thursday: 10AM - 9PM</p>
                                <p className="font-medium text-slate-600">Friday: 3PM - 9PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Follow Us</h2>
                    <div className="mt-4 flex gap-3">
                        <a href="#" className="grid h-12 w-12 place-items-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700">
                            <span className="text-lg">f</span>
                        </a>
                        <a href="#" className="grid h-12 w-12 place-items-center rounded-full bg-pink-600 text-white transition-all hover:bg-pink-700">
                            <span className="text-lg">📷</span>
                        </a>
                        <a href="#" className="grid h-12 w-12 place-items-center rounded-full bg-sky-500 text-white transition-all hover:bg-sky-600">
                            <span className="text-lg">🐦</span>
                        </a>
                        <a href="#" className="grid h-12 w-12 place-items-center rounded-full bg-red-600 text-white transition-all hover:bg-red-700">
                            <span className="text-lg">▶</span>
                        </a>
                    </div>
                </div>
            </section>
        </MobileShell>
    );
}
