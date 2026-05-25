import { useNotifications } from '@/Contexts/NotificationContext';

export default function NotificationSettings() {
    const { preferences, updatePreference } = useNotifications();

    const settings = [
        { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified about your order status' },
        { key: 'promotions', label: 'Promotions', description: 'Receive special offers and discounts' },
        { key: 'wishlistAlerts', label: 'Wishlist Alerts', description: 'When items in your wishlist go on sale' },
        { key: 'priceDrops', label: 'Price Drops', description: 'Get notified when prices drop' },
        { key: 'newsletter', label: 'Newsletter', description: 'Weekly updates and new arrivals' },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-950">Notification Preferences</h2>
            <div className="space-y-3">
                {settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <div>
                            <p className="text-sm font-black text-slate-950">{setting.label}</p>
                            <p className="text-xs font-semibold text-slate-500">{setting.description}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => updatePreference(setting.key, !preferences[setting.key])}
                            className={`h-12 w-20 rounded-full transition-all duration-200 ${
                                preferences[setting.key]
                                    ? 'bg-orange-600 shadow-lg shadow-orange-200'
                                    : 'bg-slate-200'
                            }`}
                        >
                            <div
                                className={`h-10 w-10 rounded-full bg-white shadow transition-transform duration-200 ${
                                    preferences[setting.key] ? 'translate-x-10' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
