import { Head, Link, usePage } from '@/lib/inertiaCompat';
import { useState } from 'react';
import DesktopHeader from '@/Components/Storefront/DesktopHeader';
import Footer from '@/Components/Storefront/Footer';
import LiveChat from '@/Components/Storefront/LiveChat';
import Toast from '@/Components/Storefront/Toast';
import { useCart } from '@/Contexts/CartContext';

const navItems = [
    { label: 'Home', href: '/', match: /^\/$/, icon: 'home' },
    { label: 'Campaigns', href: '/campaigns', match: /^\/campaigns/, icon: 'campaigns' },
    { label: 'Categories', href: '/categories', match: /^\/categories/, icon: 'grid' },
    { label: 'Cart', href: '/cart', match: /^\/cart|^\/checkout/, icon: 'cart' },
    { label: 'Account', href: '/account', match: /^\/account/, icon: 'user' },
];

function BottomNavIcon({ icon, active }) {
    const paths = {
        home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
        grid: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
        cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
        user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        campaigns: 'M13 10V3L4 14h7v7l9-11h-7z',
    };

    return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" aria-hidden="true">
            <path d={paths[icon]} stroke="currentColor" strokeWidth={active ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function formatRange(campaign) {
    if (!campaign.starts_at && !campaign.ends_at) return 'Limited time';
    const start = campaign.starts_at ? new Date(campaign.starts_at).toLocaleDateString() : 'Now';
    const end = campaign.ends_at ? new Date(campaign.ends_at).toLocaleDateString() : 'Ongoing';
    return `${start} - ${end}`;
}

export default function CampaignsPage({ campaigns = [] }) {
    const { itemCount } = useCart();
    const { url } = usePage();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
            <DesktopHeader />

            <div className="relative mx-auto min-h-screen max-w-md bg-white lg:max-w-none lg:bg-transparent lg:shadow-none">
                <Head title="Campaigns" />

                <section className="min-h-screen bg-white pb-24 lg:min-h-0 lg:bg-transparent lg:px-6 lg:py-6">
                    <div className="sticky top-0 z-30 border-b border-slate-100 bg-[#560056] px-4 py-3 shadow-sm lg:hidden">
                        <div className="flex items-center justify-between gap-3">
                            <h1 className="text-lg font-semibold text-white">Campaigns</h1>

                            <div className="flex items-center gap-3">
                                {showSearchInput ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(event) => setSearchQuery(event.target.value)}
                                            placeholder="Search products..."
                                            className="h-9 w-48 rounded-lg border border-slate-200 px-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                                            autoFocus
                                        />
                                        <Link href={searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search'} className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500 text-white shadow-sm">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                        </Link>
                                        <button type="button" onClick={() => { setShowSearchInput(false); setSearchQuery(''); }} className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => setShowSearchInput(true)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 px-4 py-4 lg:px-0 lg:py-0">
                        <div className="hidden lg:block">
                            <h1 className="text-2xl font-black text-slate-950">Campaigns</h1>
                        </div>

                        {campaigns.length === 0 ? (
                            <div className="rounded-2xl bg-slate-50 p-8 text-center ring-1 ring-slate-100">
                                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-purple-100 text-purple-700">
                                    <BottomNavIcon icon="campaigns" active />
                                </div>
                                <h2 className="mt-4 text-lg font-black text-slate-950">No active campaigns</h2>
                                <p className="mt-1 text-sm font-semibold text-slate-500">New offers will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {campaigns.map((campaign) => (
                                    <Link
                                        key={campaign.id}
                                        href={campaign.target_url || '/search'}
                                        className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
                                    >
                                        <div className="relative aspect-[16/9] bg-slate-100">
                                            {campaign.image_url ? (
                                                <img src={campaign.image_url} alt={campaign.title} className="h-full w-full object-cover" loading="lazy" />
                                            ) : (
                                                <div className="grid h-full place-items-center bg-purple-50 text-purple-700">
                                                    <BottomNavIcon icon="campaigns" active />
                                                </div>
                                            )}
                                            {campaign.badge && (
                                                <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white shadow-sm">
                                                    {campaign.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <p className="text-xs font-black uppercase text-purple-700">{formatRange(campaign)}</p>
                                            <h2 className="mt-1 line-clamp-2 text-base font-black text-slate-950">{campaign.title}</h2>
                                            {campaign.description && (
                                                <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-500">{campaign.description}</p>
                                            )}
                                            <div className="mt-4 inline-flex rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white transition group-active:scale-95">
                                                View Offer
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-gray-100 bg-[#4d0659] pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
                    <div className="grid grid-cols-5">
                        {navItems.map((item) => {
                            const active = item.match.test(url);

                            return (
                                <Link key={item.href} href={item.href} className={`relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${active ? 'text-orange-500' : 'text-gray-400'}`}>
                                    <BottomNavIcon icon={item.icon} active={active} />
                                    <span>{item.label}</span>
                                    {item.label === 'Cart' && itemCount > 0 && (
                                        <span className="absolute left-1/2 top-1 ml-2 grid min-h-[16px] min-w-[16px] place-items-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                                            {itemCount}
                                        </span>
                                    )}
                                    {active && <span className="absolute bottom-0 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-orange-500" />}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <Toast />
                <LiveChat />
            </div>

            <Footer />
        </div>
    );
}
