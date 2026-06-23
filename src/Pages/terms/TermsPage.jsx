import { Head, Link } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';

export default function TermsPage() {
    return (
        <MobileShell title="Terms & Conditions">
            <Head title="Terms & Conditions" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                            Legal
                        </p>
                        <h1 className="mt-2 text-2xl font-black">Terms & Conditions</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Please read our terms carefully
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">1. Acceptance of Terms</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        By accessing and using Kids Mela's website and services, you agree to be bound by these Terms & Conditions. If you do not agree with these terms, please do not use our services.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">2. Account Registration</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">3. Products & Pricing</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        All prices are in Bangladeshi Taka (BDT) unless otherwise specified. We reserve the right to modify prices at any time without prior notice. Product images are for illustration purposes and actual products may vary slightly.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">4. Orders & Payment</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        All orders are subject to availability and confirmation of the order price. We reserve the right to refuse or cancel any order for any reason. Payment must be made in full before order processing.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">5. Shipping & Delivery</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        Shipping times are estimates and not guaranteed. We are not responsible for delays caused by weather, customs, or other factors beyond our control. Risk of loss transfers to you upon delivery to the shipping carrier.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">6. Returns & Refunds</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        Returns are accepted within 7 days of delivery for unused items in original condition. Refunds will be processed within 7-10 business days after we receive the returned item. Please refer to our Return Policy for detailed information.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">7. Intellectual Property</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        All content on this website, including text, graphics, logos, images, and software, is the property of Kids Mela or its content suppliers and is protected by copyright laws.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">8. Limitation of Liability</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        Kids Mela shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services. Our liability is limited to the purchase price of the product.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">9. Privacy Policy</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        Your use of our services is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">10. Changes to Terms</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">11. Contact Information</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        If you have any questions about these Terms & Conditions, please contact us at support@kidsmela.com or call +880 1XXX-XXXXXX.
                    </p>
                    <Link href="/contact" className="mt-4 inline-flex rounded-2xl bg-orange-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                        Contact Us
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
