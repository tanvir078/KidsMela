import { Head, Link, router, usePage } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useTheme } from '@/Contexts/ThemeContext';

const menuItems = [
    { label: 'Wishlist', href: '/wishlist', icon: '♥', color: 'text-rose-500' },
    { label: 'Orders', href: '/orders', icon: '📦', color: 'text-blue-500' },
    { label: 'Recently Viewed', href: '/recently-viewed', icon: '👁️', color: 'text-purple-500' },
    { label: 'Saved addresses', href: '#', icon: '📍', color: 'text-emerald-500' },
    { label: 'Payment methods', href: '#', icon: '💳', color: 'text-amber-500' },
    { label: 'Help center', href: '#', icon: '❓', color: 'text-cyan-500' },
];

export default function ProfilePage() {
    const { props } = usePage();
    const user = props.auth?.user;
    const { theme, toggleTheme } = useTheme();

    const logout = () => {
        router.post('/logout');
    };

    return (
        <MobileShell title="Profile" showSearch={false}>
            <Head title="Profile" />
            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <div className="flex items-center gap-4">
                            <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-3xl font-black text-orange-600 shadow-lg">
                                {(user?.name ?? 'Guest').slice(0, 1)}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-black">{user?.name ?? 'Guest Shopper'}</h1>
                                <p className="mt-1 text-sm font-semibold text-white/90">
                                    {user?.email ?? 'Login to sync cart, place real orders, and view order history.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {user ? (
                    <div className="grid grid-cols-2 gap-3">
                        <Link href={route('profile.edit')} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95">
                            <span>⚙️</span>
                            Settings
                        </Link>
                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-sm font-black text-red-600 ring-1 ring-red-100 transition-all duration-200 hover:bg-red-50 active:scale-95"
                        >
                            <span>🚪</span>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/login" className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95">
                            <span>🔐</span>
                            Login
                        </Link>
                        <Link href="/register" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-sm font-black text-orange-600 ring-1 ring-orange-100 transition-all duration-200 hover:bg-orange-50 active:scale-95">
                            <span>📝</span>
                            Register
                        </Link>
                    </div>
                )}

                <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-base font-black text-slate-950">Quick Access</h2>
                    </div>
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
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-base font-black text-slate-950">Preferences</h2>
                    </div>
                    <div className="space-y-1">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex w-full items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-slate-50 active:scale-98"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl text-amber-500">
                                    {theme === 'dark' ? '🌙' : '☀️'}
                                </span>
                                <span className="text-sm font-black text-slate-800">
                                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                </span>
                            </div>
                            <span className="text-lg font-black text-slate-300">›</span>
                        </button>
                    </div>
                </div>

                {user?.is_admin && (
                    <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-4 shadow-sm ring-1 ring-slate-700">
                        <Link
                            href="/admin/products"
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">🛠️</span>
                                <div>
                                    <span className="block text-sm font-black text-white">Admin Panel</span>
                                    <span className="block text-xs font-semibold text-slate-400">Manage products</span>
                                </div>
                            </div>
                            <span className="text-lg font-black text-slate-400">›</span>
                        </Link>
                    </div>
                )}
            </section>
        </MobileShell>
    );
}
