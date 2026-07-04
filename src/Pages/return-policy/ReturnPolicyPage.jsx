import { Head, Link } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';

export default function ReturnPolicyPage() {
    return (
        <MobileShell title="Return Policy" simpleHeader={true}>
            <Head title="Return Policy" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                            Customer Service
                        </p>
                        <h1 className="mt-2 text-2xl font-black">Return Policy</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Easy returns and exchanges
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Return Period</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        You can return or exchange items within 7 days of delivery. The item must be unused, in original condition, with all tags attached and original packaging intact.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Eligible Items</h2>
                    <div className="mt-3 space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                                <span className="text-xs font-black">✓</span>
                            </div>
                            <span className="font-medium text-slate-600">All clothing items (shirts, pants, dresses, etc.)</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                                <span className="text-xs font-black">✓</span>
                            </div>
                            <span className="font-medium text-slate-600">Accessories with original packaging</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
                                <span className="text-xs font-black">✗</span>
                            </div>
                            <span className="font-medium text-slate-600">Items marked as "Final Sale"</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
                                <span className="text-xs font-black">✗</span>
                            </div>
                            <span className="font-medium text-slate-600">Used or worn items</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
                                <span className="text-xs font-black">✗</span>
                            </div>
                            <span className="font-medium text-slate-600">Items without original tags/packaging</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">How to Return</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">1</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Go to Your Orders</h3>
                                <p className="mt-1 font-medium text-slate-600">Navigate to your order details page in your account.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">2</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Request Return/Exchange</h3>
                                <p className="mt-1 font-medium text-slate-600">Click on "Request Return/Exchange" button next to the item.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">3</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Fill Details</h3>
                                <p className="mt-1 font-medium text-slate-600">Select reason, preferred resolution (refund/exchange), and provide details.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">4</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Wait for Approval</h3>
                                <p className="mt-1 font-medium text-slate-600">Our team will review and approve within 24-48 hours.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">5</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Ship the Item</h3>
                                <p className="mt-1 font-medium text-slate-600">Follow instructions to ship the item back to us.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Refund Process</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        Once we receive and verify the returned item, refunds will be processed within 7-10 business days. Refunds will be credited to your original payment method or store credit, depending on your preference.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Exchange Policy</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        Exchanges are allowed for different sizes or colors of the same product. If the desired size/color is unavailable, you can opt for store credit or a different item of equal or greater value.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Return Shipping</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        If the return is due to our error (wrong item, defective product), we cover return shipping. For change of mind returns, customer pays return shipping costs.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Contact Support</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        If you need assistance with your return or exchange, our customer support team is here to help. Contact us via phone, email, or live chat.
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
