import { Head, Link } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';

export default function ShippingPage() {
    return (
        <MobileShell title="Shipping Information">
            <Head title="Shipping Information" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                            Delivery Info
                        </p>
                        <h1 className="mt-2 text-2xl font-black">Shipping Information</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Fast and reliable delivery
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Delivery Areas</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        We deliver to all major cities and towns across Bangladesh. Our delivery network covers Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur, and surrounding areas.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Delivery Time</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-lg">🏙️</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Dhaka City</h3>
                                <p className="mt-1 font-medium text-slate-600">1-2 business days</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-lg">🌆</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Major Cities</h3>
                                <p className="mt-1 font-medium text-slate-600">2-3 business days</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-lg">🏘️</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Other Areas</h3>
                                <p className="mt-1 font-medium text-slate-600">3-5 business days</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Shipping Charges</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                            <span className="font-bold text-slate-900">Standard Delivery</span>
                            <span className="font-black text-orange-600">60 BDT</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                            <span className="font-bold text-slate-900">Express Delivery</span>
                            <span className="font-black text-orange-600">120 BDT</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-3">
                            <span className="font-bold text-slate-900">Free Shipping</span>
                            <span className="font-black text-emerald-600">Orders above 1000 BDT</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                            <span className="font-bold text-slate-900">Store Pickup</span>
                            <span className="font-black text-orange-600">Free</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Order Processing</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        Orders are processed within 24 hours on business days (Saturday-Thursday). Orders placed on Friday or after 4 PM may be processed the next business day.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Order Tracking</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        You can track your order through our website or app using your order number. You'll also receive SMS updates at key stages: order confirmed, shipped, and delivered.
                    </p>
                    <Link href="/orders" className="mt-4 inline-flex rounded-2xl bg-orange-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                        Track Your Order
                    </Link>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Delivery Instructions</h2>
                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-xs font-black">•</span>
                            </div>
                            <span className="font-medium text-slate-600">Provide complete and accurate address with landmark</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-xs font-black">•</span>
                            </div>
                            <span className="font-medium text-slate-600">Ensure phone number is active for delivery coordination</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-xs font-black">•</span>
                            </div>
                            <span className="font-medium text-slate-600">Someone should be available to receive the package</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-xs font-black">•</span>
                            </div>
                            <span className="font-medium text-slate-600">Check package before signing delivery receipt</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Cash on Delivery (COD)</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        We offer cash on delivery for all orders. Pay in cash when you receive your package. For COD orders, please ensure you have the exact amount ready.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Need Help?</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        If you have any questions about shipping or delivery, our customer support team is here to assist you.
                    </p>
                    <Link href="/contact" className="mt-4 inline-flex rounded-2xl bg-orange-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                        Contact Support
                    </Link>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 text-center shadow-sm ring-1 ring-slate-200">
                    <p className="text-xs font-medium text-slate-500">
                        Last updated: June 20, 2026
                    </p>
                </div>
            </section>
        </MobileShell>
    );
}
