import { Head, Link } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';

export default function PrivacyPage() {
    return (
        <MobileShell title="Privacy Policy">
            <Head title="Privacy Policy" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                            Legal
                        </p>
                        <h1 className="mt-2 text-2xl font-black">Privacy Policy</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Your privacy is important to us
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">1. Information We Collect</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        We collect information you provide directly, including name, email, phone number, shipping address, and payment information. We also collect information about your browsing behavior and preferences.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">2. How We Use Your Information</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        We use your information to process orders, provide customer support, improve our services, send promotional communications (with your consent), and comply with legal obligations.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">3. Information Sharing</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        We do not sell your personal information. We may share your information with service providers who assist in operating our business, shipping partners, and when required by law.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">4. Data Security</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">5. Cookies & Tracking</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        We use cookies and similar technologies to improve your experience, analyze usage patterns, and personalize content. You can manage cookie preferences through your browser settings.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">6. Your Rights</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        You have the right to access, correct, or delete your personal information. You can opt out of marketing communications at any time. Contact us to exercise these rights.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">7. Third-Party Services</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        Our website may contain links to third-party sites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">8. Children's Privacy</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">9. Changes to This Policy</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">10. Contact Us</h2>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        If you have any questions about this Privacy Policy, please contact us at support@kidsmela.com or call +880 1XXX-XXXXXX.
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
