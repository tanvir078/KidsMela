import { Head, Link } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';

export default function AboutPage() {
    return (
        <MobileShell title="About Us">
            <Head title="About Us" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                            Our Story
                        </p>
                        <h1 className="mt-2 text-2xl font-black">About Kids Mela</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Your trusted fashion destination
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Who We Are</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        Kids Mela is a leading fashion retailer in Bangladesh, dedicated to providing high-quality clothing and accessories for men, women, and kids. Since our establishment, we have been committed to offering the latest trends at affordable prices while maintaining exceptional quality and customer service.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Our Mission</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        To make fashionable clothing accessible to everyone while maintaining the highest standards of quality, sustainability, and customer satisfaction. We believe that great style shouldn't come with a hefty price tag.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Our Values</h2>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">✓</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Quality First</h3>
                                <p className="mt-1 text-xs font-medium text-slate-600">We never compromise on quality materials and craftsmanship.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">✓</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Customer Satisfaction</h3>
                                <p className="mt-1 text-xs font-medium text-slate-600">Your happiness is our priority, and we go above and beyond to ensure it.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">✓</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Affordable Fashion</h3>
                                <p className="mt-1 text-xs font-medium text-slate-600">Great style at prices that won't break the bank.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">✓</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Sustainability</h3>
                                <p className="mt-1 text-xs font-medium text-slate-600">We're committed to eco-friendly practices and ethical sourcing.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Why Choose Us</h2>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-slate-50 p-3 text-center">
                            <div className="text-2xl font-black text-orange-600">10K+</div>
                            <div className="mt-1 text-xs font-semibold text-slate-600">Happy Customers</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3 text-center">
                            <div className="text-2xl font-black text-orange-600">500+</div>
                            <div className="mt-1 text-xs font-semibold text-slate-600">Products</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3 text-center">
                            <div className="text-2xl font-black text-orange-600">5+</div>
                            <div className="mt-1 text-xs font-semibold text-slate-600">Years Experience</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3 text-center">
                            <div className="text-2xl font-black text-orange-600">24/7</div>
                            <div className="mt-1 text-xs font-semibold text-slate-600">Support</div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Contact Us</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100">
                                <span className="text-sm">📍</span>
                            </div>
                            <span className="font-medium text-slate-700">Dhaka, Bangladesh</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100">
                                <span className="text-sm">📞</span>
                            </div>
                            <span className="font-medium text-slate-700">+880 1XXX-XXXXXX</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100">
                                <span className="text-sm">✉️</span>
                            </div>
                            <span className="font-medium text-slate-700">support@kidsmela.com</span>
                        </div>
                    </div>
                    <Link href="/contact" className="mt-4 inline-flex w-full justify-center rounded-2xl bg-orange-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                        Get in Touch
                    </Link>
                </div>
            </section>
        </MobileShell>
    );
}
