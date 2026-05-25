import { Head, Link, router, usePage } from '@/lib/inertiaCompat';
import { useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useTheme } from '@/Contexts/ThemeContext';
import { useToast } from '@/Contexts/ToastContext';

const menuItems = [
    { label: 'উইশলিস্ট', href: '/wishlist', icon: '♥', color: 'text-rose-500' },
    { label: 'অর্ডার', href: '/orders', icon: '📦', color: 'text-blue-500' },
    { label: 'সম্প্রতি দেখা', href: '/recently-viewed', icon: '👁️', color: 'text-purple-500' },
    { label: 'তুলনা করুন', href: '/compare', icon: '⚖️', color: 'text-indigo-500' },
];

export default function ProfilePage() {
    const { props } = usePage();
    const user = props.auth?.user;
    const { theme, toggleTheme } = useTheme();
    const { addToast } = useToast();

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
        { id: 1, label: 'বাসা', name: 'মো. তানভীর', phone: '01XXXXXXXXX', address: 'মিরপুর ১০, ঢাকা ১২১৬', isDefault: true },
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
        addToast('প্রোফাইল আপডেট হয়েছে!', 'success');
    };

    const changePassword = () => {
        if (!passwordForm.current || !passwordForm.newPassword) {
            addToast('সব ফিল্ড পূরণ করুন', 'error');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirm) {
            addToast('নতুন পাসওয়ার্ড মিলছে না', 'error');
            return;
        }
        addToast('পাসওয়ার্ড পরিবর্তন হয়েছে!', 'success');
        setPasswordForm({ current: '', newPassword: '', confirm: '' });
    };

    const addAddress = () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.address) {
            addToast('সব ফিল্ড পূরণ করুন', 'error');
            return;
        }
        setAddresses((prev) => [...prev, { ...newAddress, id: Date.now(), isDefault: false }]);
        setNewAddress({ label: '', name: '', phone: '', address: '' });
        setShowAddAddress(false);
        addToast('ঠিকানা যোগ হয়েছে!', 'success');
    };

    const removeAddress = (id) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        addToast('ঠিকানা মুছে ফেলা হয়েছে', 'info');
    };

    const setDefaultAddress = (id) => {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
        addToast('ডিফল্ট ঠিকানা সেট হয়েছে', 'success');
    };

    const tabs = [
        { id: 'overview', label: 'ওভারভিউ', icon: '🏠' },
        { id: 'edit', label: 'প্রোফাইল', icon: '✏️' },
        { id: 'addresses', label: 'ঠিকানা', icon: '📍' },
        { id: 'password', label: 'পাসওয়ার্ড', icon: '🔒' },
        { id: 'notifications', label: 'নোটিফিকেশন', icon: '🔔' },
    ];

    const inputClass = "h-12 w-full rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500";

    return (
        <MobileShell title="Profile" showSearch={false}>
            <Head title="প্রোফাইল" />
            <section className="space-y-4 px-4 py-4">
                {/* Profile Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <div className="flex items-center gap-4">
                            <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-3xl font-black text-orange-600 shadow-lg">
                                {((user?.name ?? profileForm.name) || 'G').slice(0, 1).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-black">{(user?.name ?? profileForm.name) || 'গেস্ট শপার'}</h1>
                                <p className="mt-1 text-sm font-semibold text-white/90">
                                    {(user?.email ?? profileForm.email) || 'লগইন করে শপিং শুরু করুন'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auth Buttons */}
                {user ? (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setActiveTab('edit')}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95"
                        >
                            <span>⚙️</span>
                            সেটিংস
                        </button>
                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-sm font-black text-red-600 ring-1 ring-red-100 transition-all duration-200 hover:bg-red-50 active:scale-95"
                        >
                            <span>🚪</span>
                            লগআউট
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/login" className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95">
                            <span>🔐</span>
                            লগইন
                        </Link>
                        <Link href="/register" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-sm font-black text-orange-600 ring-1 ring-orange-100 transition-all duration-200 hover:bg-orange-50 active:scale-95">
                            <span>📝</span>
                            রেজিস্টার
                        </Link>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-black transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-white text-orange-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="mb-3 text-base font-black text-slate-950">দ্রুত প্রবেশ</h2>
                            <div className="space-y-1">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-slate-50 active:scale-98"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xl ${item.color}`}>{item.icon}</span>
                                            <span className="text-sm font-black text-slate-800">{item.label}</span>
                                        </div>
                                        <span className="text-lg font-black text-slate-300">›</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="mb-3 text-base font-black text-slate-950">পছন্দ</h2>
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl text-amber-500">
                                            {theme === 'dark' ? '🌙' : '☀️'}
                                        </span>
                                        <span className="text-sm font-black text-slate-800">
                                            {theme === 'dark' ? 'ডার্ক মোড' : 'লাইট মোড'}
                                        </span>
                                    </div>
                                    <span className="text-lg font-black text-slate-300">›</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('notifications')}
                                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl text-blue-500">🔔</span>
                                        <span className="text-sm font-black text-slate-800">নোটিফিকেশন সেটিংস</span>
                                    </div>
                                    <span className="text-lg font-black text-slate-300">›</span>
                                </button>
                            </div>
                        </div>

                        {user?.is_admin && (
                            <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-4 shadow-sm ring-1 ring-slate-700">
                                <Link href="/admin/products" className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">🛠️</span>
                                        <div>
                                            <span className="block text-sm font-black text-white">এডমিন প্যানেল</span>
                                            <span className="block text-xs font-semibold text-slate-400">পণ্য ম্যানেজ করুন</span>
                                        </div>
                                    </div>
                                    <span className="text-lg font-black text-slate-400">›</span>
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {/* Edit Profile Tab */}
                {activeTab === 'edit' && (
                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-lg font-black text-slate-950">প্রোফাইল সম্পাদনা</h2>
                        <div className="mt-4 space-y-4">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-orange-100 to-rose-100 text-4xl font-black text-orange-600 ring-4 ring-white shadow-lg">
                                        {(profileForm.name || 'G').slice(0, 1).toUpperCase()}
                                    </div>
                                    <button type="button" className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-orange-600 text-sm text-white shadow-md">
                                        📷
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">পুরো নাম</label>
                                <input value={profileForm.name} onChange={(e) => updateProfile('name', e.target.value)} className={inputClass} placeholder="আপনার নাম" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">ইমেইল</label>
                                <input type="email" value={profileForm.email} onChange={(e) => updateProfile('email', e.target.value)} className={inputClass} placeholder="email@example.com" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">ফোন</label>
                                <input type="tel" value={profileForm.phone} onChange={(e) => updateProfile('phone', e.target.value)} className={inputClass} placeholder="01XXXXXXXXX" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">বায়ো</label>
                                <textarea value={profileForm.bio} onChange={(e) => updateProfile('bio', e.target.value)} className="min-h-20 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="আপনার সম্পর্কে কিছু লিখুন..." />
                            </div>
                            <button type="button" onClick={saveProfile} className="h-12 w-full rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                                সেভ করুন
                            </button>
                        </div>
                    </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                    <div className="space-y-4">
                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-black text-slate-950">সেভ করা ঠিকানা</h2>
                                <button type="button" onClick={() => setShowAddAddress(!showAddAddress)} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600 transition-all duration-200 hover:bg-orange-100 active:scale-95">
                                    + নতুন
                                </button>
                            </div>

                            {showAddAddress && (
                                <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                                    <input value={newAddress.label} onChange={(e) => setNewAddress((a) => ({ ...a, label: e.target.value }))} className={inputClass} placeholder="লেবেল (বাসা/অফিস)" />
                                    <input value={newAddress.name} onChange={(e) => setNewAddress((a) => ({ ...a, name: e.target.value }))} className={inputClass} placeholder="প্রাপকের নাম" />
                                    <input type="tel" value={newAddress.phone} onChange={(e) => setNewAddress((a) => ({ ...a, phone: e.target.value }))} className={inputClass} placeholder="ফোন নম্বর" />
                                    <textarea value={newAddress.address} onChange={(e) => setNewAddress((a) => ({ ...a, address: e.target.value }))} className="min-h-16 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="পুরো ঠিকানা" />
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setShowAddAddress(false)} className="h-10 flex-1 rounded-xl bg-slate-200 text-sm font-black text-slate-600">বাতিল</button>
                                        <button type="button" onClick={addAddress} className="h-10 flex-1 rounded-xl bg-orange-600 text-sm font-black text-white">সেভ</button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 space-y-3">
                                {addresses.map((addr) => (
                                    <div key={addr.id} className={`rounded-2xl p-3 ring-1 transition-all duration-200 ${addr.isDefault ? 'bg-orange-50 ring-orange-200' : 'bg-white ring-slate-200'}`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-slate-900">{addr.label || 'ঠিকানা'}</span>
                                                    {addr.isDefault && (
                                                        <span className="rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-bold text-white">ডিফল্ট</span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm font-semibold text-slate-600">{addr.name}</p>
                                                <p className="text-xs text-slate-500">{addr.phone}</p>
                                                <p className="mt-1 text-xs text-slate-500">{addr.address}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-2">
                                            {!addr.isDefault && (
                                                <button type="button" onClick={() => setDefaultAddress(addr.id)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200">
                                                    ডিফল্ট করুন
                                                </button>
                                            )}
                                            <button type="button" onClick={() => removeAddress(addr.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100">
                                                মুছুন
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-lg font-black text-slate-950">পাসওয়ার্ড পরিবর্তন</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">বর্তমান পাসওয়ার্ড</label>
                                <input type={showPassword ? 'text' : 'password'} value={passwordForm.current} onChange={(e) => updatePassword('current', e.target.value)} className={inputClass} placeholder="বর্তমান পাসওয়ার্ড" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">নতুন পাসওয়ার্ড</label>
                                <input type={showPassword ? 'text' : 'password'} value={passwordForm.newPassword} onChange={(e) => updatePassword('newPassword', e.target.value)} className={inputClass} placeholder="নতুন পাসওয়ার্ড" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                                <input type={showPassword ? 'text' : 'password'} value={passwordForm.confirm} onChange={(e) => updatePassword('confirm', e.target.value)} className={inputClass} placeholder="আবার নতুন পাসওয়ার্ড" />
                            </div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                                পাসওয়ার্ড দেখুন
                            </label>
                            <button type="button" onClick={changePassword} className="h-12 w-full rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                                পাসওয়ার্ড পরিবর্তন করুন
                            </button>
                        </div>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-lg font-black text-slate-950">নোটিফিকেশন সেটিংস</h2>
                        <div className="mt-4 space-y-3">
                            {[
                                { key: 'orderUpdates', label: 'অর্ডার আপডেট', desc: 'অর্ডারের স্ট্যাটাস পরিবর্তনের নোটিফিকেশন' },
                                { key: 'promotions', label: 'প্রমোশন ও অফার', desc: 'নতুন ডিস্কাউন্ট ও ডিল সম্পর্কে জানুন' },
                                { key: 'newArrivals', label: 'নতুন পণ্য', desc: 'নতুন পণ্য আসলে জানুন' },
                                { key: 'priceDrops', label: 'মূল্য হ্রাস', desc: 'উইশলিস্টের পণ্যের দাম কমলে জানুন' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{item.label}</p>
                                        <p className="text-xs font-semibold text-slate-400">{item.desc}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }))}
                                        className={`relative h-7 w-12 rounded-full transition-all duration-300 ${notifications[item.key] ? 'bg-orange-600' : 'bg-slate-300'}`}
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
