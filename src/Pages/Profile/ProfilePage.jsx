import { Head, Link, router, usePage } from '@/lib/inertiaCompat';
import { useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useTheme } from '@/Contexts/ThemeContext';
import { useToast } from '@/Contexts/ToastContext';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useCurrency } from '@/Contexts/CurrencyContext';
import { useCart } from '@/Contexts/CartContext';
import { useWishlist } from '@/Contexts/WishlistContext';

export default function ProfilePage() {
    const { props } = usePage();
    const user = props.auth?.user;
    const { theme, toggleTheme } = useTheme();
    const { addToast } = useToast();
    const { language, changeLanguage, availableLanguages } = useLanguage();
    const { currency, setCurrency, availableCurrencies, currencySymbols } = useCurrency();
    const { itemCount: cartCount } = useCart();
    const { items: wishlistItems } = useWishlist();

    const [activeTab, setActiveTab] = useState('overview');
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: '',
    });
    const [passwordForm, setPasswordForm] = useState({
        current: '',
        newPassword: '',
        confirm: '',
    });
    const [addresses, setAddresses] = useState([
        { id: 1, label: 'Home', name: 'John Doe', phone: '01XXXXXXXXX', address: '123 Main Street, Dhaka 1216', isDefault: true },
    ]);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({ label: '', name: '', phone: '', address: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: true,
        newArrivals: false,
        priceDrops: true,
    });

    const logout = () => {
        router.post('/logout');
    };

    const updateProfile = (field, value) => setProfileForm((f) => ({ ...f, [field]: value }));
    const updatePassword = (field, value) => setPasswordForm((f) => ({ ...f, [field]: value }));

    const saveProfile = () => {
        addToast('Profile updated successfully!', 'success');
    };

    const changePasswordHandler = () => {
        if (!passwordForm.current || !passwordForm.newPassword) {
            addToast('Please fill all fields', 'error');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirm) {
            addToast('New passwords do not match', 'error');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            addToast('Password must be at least 6 characters', 'error');
            return;
        }
        addToast('Password changed successfully!', 'success');
        setPasswordForm({ current: '', newPassword: '', confirm: '' });
    };

    const addAddress = () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.address) {
            addToast('Please fill all required fields', 'error');
            return;
        }
        setAddresses((prev) => [...prev, { ...newAddress, id: Date.now(), isDefault: false }]);
        setNewAddress({ label: '', name: '', phone: '', address: '' });
        setShowAddAddress(false);
        addToast('Address added successfully!', 'success');
    };

    const removeAddress = (id) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        addToast('Address removed', 'info');
    };

    const setDefaultAddress = (id) => {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
        addToast('Default address updated', 'success');
    };

    const inputClass = "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-200";

    const displayName = (user?.name ?? profileForm.name) || 'Guest';
    const displayEmail = (user?.email ?? profileForm.email) || '';
    const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <MobileShell title="My Account" showSearch={false} simpleHeader={true}>
            <Head title="My Account" />
            <section className="space-y-3 px-4 py-4 pb-8">

                {/* ─── Profile Card ─── */}
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/10" />
                    <div className="pointer-events-none absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-orange-500/5" />
                    <div className="pointer-events-none absolute right-8 bottom-4 h-20 w-20 rounded-full bg-white/5" />

                    <div className="relative flex items-center gap-4">
                        <div className="relative">
                            <div className="grid h-[72px] w-[72px] place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-2xl font-black text-white shadow-lg shadow-orange-500/30">
                                {initials}
                            </div>
                            <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-lg bg-emerald-500 shadow-md">
                                <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none"><path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="truncate text-xl font-black text-white">{displayName}</h1>
                            {displayEmail && (
                                <p className="mt-0.5 truncate text-sm font-medium text-slate-400">{displayEmail}</p>
                            )}
                            <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-2.5 py-0.5 text-[10px] font-bold text-orange-400">
                                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="currentColor"><path d="M6 1l1.545 3.13L11 4.635 8.5 7.07l.59 3.43L6 8.885 2.91 10.5l.59-3.43L1 4.635l3.455-.505L6 1z"/></svg>
                                    Gold Member
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="relative mt-5 grid grid-cols-4 gap-2">
                        {[
                            { value: user?.orders_count || '0', label: 'Orders' },
                            { value: String(wishlistItems?.length || 0), label: 'Wishlist' },
                            { value: String(cartCount || 0), label: 'Cart' },
                            { value: user?.points || '0', label: 'Points' },
                        ].map((stat) => (
                            <div key={stat.label} className="rounded-2xl bg-white/5 px-2 py-3 text-center backdrop-blur-sm">
                                <p className="text-lg font-black text-white">{stat.value}</p>
                                <p className="mt-0.5 text-[10px] font-semibold text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Auth Actions ─── */}
                {user ? (
                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            onClick={() => setActiveTab('edit')}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-[0.97]"
                        >
                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                            Edit Profile
                        </button>
                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-bold text-slate-600 ring-1 ring-slate-200 transition-all duration-200 hover:bg-slate-50 active:scale-[0.97]"
                        >
                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/></svg>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                        <Link href="/login" className="flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-[0.97]">
                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                            Sign In
                        </Link>
                        <Link href="/register" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-bold text-orange-600 ring-1 ring-orange-200 transition-all duration-200 hover:bg-orange-50 active:scale-[0.97]">
                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/></svg>
                            Create Account
                        </Link>
                    </div>
                )}

                {/* ─── Tab Navigation ─── */}
                <div className="flex gap-1 overflow-x-auto rounded-2xl bg-slate-100/80 p-1 scrollbar-hide">
                    {[
                        { id: 'overview', label: 'Overview', icon: <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg> },
                        { id: 'edit', label: 'Profile', icon: <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg> },
                        { id: 'addresses', label: 'Address', icon: <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg> },
                        { id: 'password', label: 'Security', icon: <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg> },
                        { id: 'settings', label: 'Settings', icon: <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-bold transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-white text-orange-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ═══════════ OVERVIEW TAB ═══════════ */}
                {activeTab === 'overview' && (
                    <>
                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {[
                                { label: 'My Orders', href: '/orders', icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>, gradient: 'from-blue-500 to-indigo-600', count: '12' },
                                { label: 'Wishlist', href: '/wishlist', icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>, gradient: 'from-rose-500 to-pink-600', count: String(wishlistItems?.length || 0) },
                                { label: 'Recently Viewed', href: '/recently-viewed', icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, gradient: 'from-violet-500 to-purple-600', count: '' },
                                { label: 'Compare', href: '/compare', icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/></svg>, gradient: 'from-emerald-500 to-teal-600', count: '' },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all duration-200 hover:shadow-md hover:ring-orange-100 active:scale-[0.97]"
                                >
                                    <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${item.gradient} p-2.5 text-white shadow-sm`}>
                                        {item.icon}
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">{item.label}</p>
                                    {item.count && (
                                        <span className="absolute right-3 top-3 grid h-6 min-w-6 place-items-center rounded-full bg-slate-100 px-1.5 text-[10px] font-black text-slate-600">
                                            {item.count}
                                        </span>
                                    )}
                                    <svg viewBox="0 0 20 20" className="absolute bottom-3 right-3 h-4 w-4 text-slate-300 transition-colors group-hover:text-orange-400" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/></svg>
                                </Link>
                            ))}
                        </div>

                        {/* Preferences Section */}
                        <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
                            <h2 className="mb-3 flex items-center gap-2 text-[13px] font-black uppercase tracking-wider text-slate-400">
                                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
                                Preferences
                            </h2>
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="flex w-full items-center justify-between rounded-2xl px-3 py-3 transition-all duration-200 hover:bg-slate-50 active:bg-slate-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`grid h-9 w-9 place-items-center rounded-xl ${theme === 'dark' ? 'bg-indigo-100' : 'bg-amber-100'}`}>
                                            {theme === 'dark' ? (
                                                <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 text-indigo-600" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
                                            ) : (
                                                <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 text-amber-600" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/></svg>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-800">Appearance</p>
                                            <p className="text-[11px] font-medium text-slate-400">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
                                        </div>
                                    </div>
                                    <div className={`relative h-7 w-12 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300 ${theme === 'dark' ? 'left-[22px]' : 'left-0.5'}`} />
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('settings')}
                                    className="flex w-full items-center justify-between rounded-2xl px-3 py-3 transition-all duration-200 hover:bg-slate-50 active:bg-slate-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100">
                                            <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 text-blue-600" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-800">Notifications</p>
                                            <p className="text-[11px] font-medium text-slate-400">Manage alerts & updates</p>
                                        </div>
                                    </div>
                                    <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-300" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/></svg>
                                </button>
                            </div>
                        </div>

                        {/* Language & Currency */}
                        <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
                            <h2 className="mb-3 flex items-center gap-2 text-[13px] font-black uppercase tracking-wider text-slate-400">
                                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 002.77-3.205A18.847 18.847 0 013.67 8.264a1 1 0 011.832-.8c.293.673.611 1.33.953 1.971a16.84 16.84 0 001.323-3.435H2a1 1 0 010-2h3V3a1 1 0 011-1zm7.707 4.293a1 1 0 010 1.414L13.414 9H17a1 1 0 110 2h-3.586l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                Language & Currency
                            </h2>
                            <div className="space-y-1">
                                <Link
                                    href="/settings/language"
                                    className="flex w-full items-center justify-between rounded-2xl px-3 py-3 transition-all duration-200 hover:bg-slate-50 active:bg-slate-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-100">
                                            <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 text-violet-600" fill="currentColor"><path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 002.77-3.205A18.847 18.847 0 013.67 8.264a1 1 0 011.832-.8c.293.673.611 1.33.953 1.971a16.84 16.84 0 001.323-3.435H2a1 1 0 010-2h3V3a1 1 0 011-1z" clipRule="evenodd"/></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-800">Display Language</p>
                                            <p className="text-[11px] font-medium text-slate-400">{availableLanguages[language]?.flag} {availableLanguages[language]?.label}</p>
                                        </div>
                                    </div>
                                    <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-300" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/></svg>
                                </Link>
                                <Link
                                    href="/settings/currency"
                                    className="flex w-full items-center justify-between rounded-2xl px-3 py-3 transition-all duration-200 hover:bg-slate-50 active:bg-slate-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100">
                                            <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 text-emerald-600" fill="currentColor"><path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.92.363c-.293.18-.418.404-.418.604 0 .2.125.424.418.604z"/><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.514.111.973.292 1.388.543.76.467 1.25 1.168 1.25 2.032 0 .864-.49 1.565-1.25 2.032-.415.25-.874.432-1.388.543v.316a.75.75 0 01-1.5 0v-.316a3.78 3.78 0 01-1.653-.713A2.42 2.42 0 016.75 12.5a.75.75 0 011.395-.55c.12.306.304.522.447.563.175.053.368.09.558.115v-2.812a7.4 7.4 0 01-1.388-.543C7.002 8.806 6.5 8.106 6.5 7.241c0-.864.502-1.565 1.262-2.032.415-.25.874-.432 1.388-.543V4.75A.75.75 0 0110 4z" clipRule="evenodd"/></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-800">Currency</p>
                                            <p className="text-[11px] font-medium text-slate-400">{currencySymbols[currency]} {currency}</p>
                                        </div>
                                    </div>
                                    <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-300" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/></svg>
                                </Link>
                            </div>
                        </div>

                        {/* Admin Panel */}
                        {user?.is_admin && (
                            <Link href="/admin/products" className="flex items-center justify-between rounded-[22px] bg-gradient-to-r from-slate-900 to-slate-800 p-4 shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98]">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                                        <svg viewBox="0 0 20 20" className="h-5 w-5 text-white" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Admin Panel</p>
                                        <p className="text-[11px] font-medium text-slate-400">Manage products & orders</p>
                                    </div>
                                </div>
                                <svg viewBox="0 0 20 20" className="h-5 w-5 text-slate-400" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/></svg>
                            </Link>
                        )}
                    </>
                )}

                {/* ═══════════ EDIT PROFILE TAB ═══════════ */}
                {activeTab === 'edit' && (
                    <div className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <h2 className="text-lg font-black text-slate-900">Edit Profile</h2>
                        <p className="mt-0.5 text-xs font-medium text-slate-400">Update your personal information</p>
                        <div className="mt-5 space-y-4">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-3xl font-black text-white shadow-lg shadow-orange-200">
                                        {initials}
                                    </div>
                                    <button type="button" className="absolute -bottom-1.5 -right-1.5 grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-white shadow-lg transition-all hover:bg-slate-700 active:scale-90">
                                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-500">Full Name</label>
                                <input value={profileForm.name} onChange={(e) => updateProfile('name', e.target.value)} className={inputClass} placeholder="Enter your full name" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-500">Email Address</label>
                                <input type="email" value={profileForm.email} onChange={(e) => updateProfile('email', e.target.value)} className={inputClass} placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-500">Phone Number</label>
                                <input type="tel" value={profileForm.phone} onChange={(e) => updateProfile('phone', e.target.value)} className={inputClass} placeholder="+1 (555) 000-0000" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-500">Bio</label>
                                <textarea value={profileForm.bio} onChange={(e) => updateProfile('bio', e.target.value)} className="min-h-20 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-200" placeholder="A few words about yourself..." />
                            </div>
                            <button type="button" onClick={saveProfile} className="h-12 w-full rounded-2xl bg-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-[0.97]">
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══════════ ADDRESSES TAB ═══════════ */}
                {activeTab === 'addresses' && (
                    <div className="space-y-3">
                        <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Saved Addresses</h2>
                                    <p className="text-xs font-medium text-slate-400">{addresses.length} address{addresses.length !== 1 ? 'es' : ''} saved</p>
                                </div>
                                <button type="button" onClick={() => setShowAddAddress(!showAddAddress)} className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-orange-700 active:scale-95">
                                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
                                    Add New
                                </button>
                            </div>

                            {showAddAddress && (
                                <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                    <p className="text-sm font-bold text-slate-700">New Address</p>
                                    <input value={newAddress.label} onChange={(e) => setNewAddress((a) => ({ ...a, label: e.target.value }))} className={inputClass} placeholder="Label (e.g. Home, Office)" />
                                    <input value={newAddress.name} onChange={(e) => setNewAddress((a) => ({ ...a, name: e.target.value }))} className={inputClass} placeholder="Recipient name *" />
                                    <input type="tel" value={newAddress.phone} onChange={(e) => setNewAddress((a) => ({ ...a, phone: e.target.value }))} className={inputClass} placeholder="Phone number *" />
                                    <textarea value={newAddress.address} onChange={(e) => setNewAddress((a) => ({ ...a, address: e.target.value }))} className="min-h-16 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-200" placeholder="Full address *" />
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setShowAddAddress(false)} className="h-11 flex-1 rounded-xl bg-slate-200 text-sm font-bold text-slate-600 transition-all hover:bg-slate-300 active:scale-95">Cancel</button>
                                        <button type="button" onClick={addAddress} className="h-11 flex-1 rounded-xl bg-orange-600 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-700 active:scale-95">Save Address</button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 space-y-2.5">
                                {addresses.map((addr) => (
                                    <div key={addr.id} className={`rounded-2xl p-4 ring-1 transition-all duration-200 ${addr.isDefault ? 'bg-orange-50/50 ring-orange-200' : 'bg-white ring-slate-200 hover:ring-slate-300'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${addr.isDefault ? 'bg-orange-100' : 'bg-slate-100'}`}>
                                                <svg viewBox="0 0 20 20" className={`h-4 w-4 ${addr.isDefault ? 'text-orange-600' : 'text-slate-500'}`} fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-slate-900">{addr.label || 'Address'}</p>
                                                    {addr.isDefault && (
                                                        <span className="rounded-md bg-orange-600 px-1.5 py-0.5 text-[9px] font-bold text-white">DEFAULT</span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-sm font-medium text-slate-600">{addr.name}</p>
                                                <p className="text-xs text-slate-400">{addr.phone}</p>
                                                <p className="mt-1 text-xs leading-4 text-slate-500">{addr.address}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex gap-2 pl-12">
                                            {!addr.isDefault && (
                                                <button type="button" onClick={() => setDefaultAddress(addr.id)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-95">
                                                    Set as Default
                                                </button>
                                            )}
                                            <button type="button" onClick={() => removeAddress(addr.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════ SECURITY TAB ═══════════ */}
                {activeTab === 'password' && (
                    <div className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-100">
                                <svg viewBox="0 0 20 20" className="h-5 w-5 text-red-600" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900">Security</h2>
                                <p className="text-xs font-medium text-slate-400">Update your password</p>
                            </div>
                        </div>
                        <div className="mt-5 space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-500">Current Password</label>
                                <input type={showPassword ? 'text' : 'password'} value={passwordForm.current} onChange={(e) => updatePassword('current', e.target.value)} className={inputClass} placeholder="Enter current password" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-500">New Password</label>
                                <input type={showPassword ? 'text' : 'password'} value={passwordForm.newPassword} onChange={(e) => updatePassword('newPassword', e.target.value)} className={inputClass} placeholder="Minimum 6 characters" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-500">Confirm New Password</label>
                                <input type={showPassword ? 'text' : 'password'} value={passwordForm.confirm} onChange={(e) => updatePassword('confirm', e.target.value)} className={inputClass} placeholder="Repeat new password" />
                            </div>
                            <label className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200">
                                <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                                Show passwords
                            </label>
                            <button type="button" onClick={changePasswordHandler} className="h-12 w-full rounded-2xl bg-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-[0.97]">
                                Update Password
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══════════ SETTINGS TAB ═══════════ */}
                {activeTab === 'settings' && (
                    <div className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <h2 className="text-lg font-black text-slate-900">Notifications</h2>
                        <p className="mt-0.5 text-xs font-medium text-slate-400">Choose what you want to be notified about</p>
                        <div className="mt-5 space-y-2">
                            {[
                                { key: 'orderUpdates', label: 'Order Updates', desc: 'When your order status changes', icon: <svg viewBox="0 0 20 20" className="h-4 w-4 text-blue-600" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/></svg>, bg: 'bg-blue-50' },
                                { key: 'promotions', label: 'Promotions & Offers', desc: 'Discounts and special deals', icon: <svg viewBox="0 0 20 20" className="h-4 w-4 text-emerald-600" fill="currentColor"><path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd"/></svg>, bg: 'bg-emerald-50' },
                                { key: 'newArrivals', label: 'New Arrivals', desc: 'Fresh products just landed', icon: <svg viewBox="0 0 20 20" className="h-4 w-4 text-purple-600" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"/></svg>, bg: 'bg-purple-50' },
                                { key: 'priceDrops', label: 'Price Drops', desc: 'Wishlist items on sale', icon: <svg viewBox="0 0 20 20" className="h-4 w-4 text-rose-600" fill="currentColor"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>, bg: 'bg-rose-50' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between rounded-2xl bg-slate-50/50 px-3 py-3.5 ring-1 ring-slate-100 transition-all hover:ring-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.bg}`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{item.label}</p>
                                            <p className="text-[11px] font-medium text-slate-400">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }))}
                                        className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-300 ${notifications[item.key] ? 'bg-orange-600' : 'bg-slate-300'}`}
                                    >
                                        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300 ${notifications[item.key] ? 'left-[22px]' : 'left-0.5'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </section>
        </MobileShell>
    );
}
