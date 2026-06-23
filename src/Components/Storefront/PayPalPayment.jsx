import { useState } from 'react';
import { useCurrency } from '@/Contexts/CurrencyContext';

export default function PayPalPayment({ amount, onPaymentSuccess, onPaymentError }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const { formatMoney } = useCurrency();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate PayPal payment processing
        setTimeout(() => {
            setIsProcessing(false);
            if (email.includes('@') && email.includes('.')) {
                onPaymentSuccess();
            } else {
                onPaymentError('Invalid PayPal email');
            }
        }, 2000);
    };

    return (
        <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-sm ring-1 ring-blue-200">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🅿️</span>
                <h2 className="text-base font-black text-slate-950">Pay with PayPal</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600">PayPal Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="h-12 w-full rounded-xl border-slate-200 px-4 text-sm font-semibold focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="mt-2 h-12 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-sm font-black text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:from-blue-700 hover:to-cyan-700 active:scale-95 disabled:opacity-50"
                >
                    {isProcessing ? 'Processing...' : `Pay ${formatMoney(amount)} with PayPal`}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                    <span>🔒</span>
                    <span>Secured by PayPal</span>
                </div>
            </form>
        </div>
    );
}
