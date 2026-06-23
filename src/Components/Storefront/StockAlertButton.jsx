import { useState } from 'react';
import { apiRequest } from '@/lib/api';

export default function StockAlertButton({ product, stock }) {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [email, setEmail] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const data = await apiRequest('/storefront/stock-alerts/subscribe', {
                method: 'POST',
                body: {
                    product_id: product.id,
                    email: email || undefined,
                    threshold: 5,
                },
            });

            if (data.success) {
                setIsSubscribed(true);
                setShowForm(false);
                setMessage('You will be notified when this product is back in stock!');
            } else {
                setMessage('Failed to subscribe. Please try again.');
            }
        } catch (error) {
            setMessage('Failed to subscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        setLoading(true);
        setMessage('');

        try {
            // Get user's alerts to find the alert ID
            const alertsData = await apiRequest('/storefront/stock-alerts/my-alerts');
            
            const alert = alertsData.data?.find(a => a.product_id === product.id);
            
            if (alert) {
                await apiRequest(`/storefront/stock-alerts/${alert.id}`, {
                    method: 'DELETE',
                });
                setIsSubscribed(false);
                setMessage('Unsubscribed successfully.');
            }
        } catch (error) {
            setMessage('Failed to unsubscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Don't show if product is in stock
    if (stock > 0) {
        return null;
    }

    return (
        <div className="mt-4">
            {isSubscribed ? (
                <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="text-sm font-semibold text-green-700 mb-2">
                        ✓ You're subscribed to stock alerts for this product
                    </p>
                    <button
                        onClick={handleUnsubscribe}
                        disabled={loading}
                        className="text-xs font-bold text-green-600 underline hover:text-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Unsubscribe'}
                    </button>
                    {message && (
                        <p className="text-xs text-green-600 mt-2">{message}</p>
                    )}
                </div>
            ) : showForm ? (
                <form onSubmit={handleSubscribe} className="rounded-lg bg-blue-50 p-4">
                    <p className="text-sm font-semibold text-blue-700 mb-3">
                        Get notified when this product is back in stock
                    </p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email (optional)"
                        className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm mb-3 focus:border-blue-500 focus:outline-none"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                    {message && (
                        <p className={`text-xs mt-2 ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}
                </form>
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
                >
                    📧 Notify Me When Available
                </button>
            )}
        </div>
    );
}
