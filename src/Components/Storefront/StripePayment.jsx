import { useState } from 'react';

export default function StripePayment({ amount, onPaymentSuccess, onPaymentError }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate Stripe payment processing
        setTimeout(() => {
            setIsProcessing(false);
            if (cardNumber.length === 16 && expiry.length === 5 && cvc.length === 3) {
                onPaymentSuccess();
            } else {
                onPaymentError('Invalid card details');
            }
        }, 2000);
    };

    return (
        <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 shadow-sm ring-1 ring-indigo-200">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💳</span>
                <h2 className="text-base font-black text-slate-950">Pay with Card</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600">Card Number</label>
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        placeholder="4242 4242 4242 4242"
                        className="h-12 w-full rounded-xl border-slate-200 px-4 text-sm font-semibold focus:border-indigo-500 focus:ring-indigo-500"
                        maxLength={19}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">Expiry</label>
                        <input
                            type="text"
                            value={expiry}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                if (value.length >= 2) {
                                    setExpiry(value.slice(0, 2) + '/' + value.slice(2));
                                } else {
                                    setExpiry(value);
                                }
                            }}
                            placeholder="MM/YY"
                            className="h-12 w-full rounded-xl border-slate-200 px-4 text-sm font-semibold focus:border-indigo-500 focus:ring-indigo-500"
                            maxLength={5}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">CVC</label>
                        <input
                            type="text"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="123"
                            className="h-12 w-full rounded-xl border-slate-200 px-4 text-sm font-semibold focus:border-indigo-500 focus:ring-indigo-500"
                            maxLength={3}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="mt-2 h-12 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-black text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 active:scale-95 disabled:opacity-50"
                >
                    {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                    <span>🔒</span>
                    <span>Secured by Stripe</span>
                </div>
            </form>
        </div>
    );
}
