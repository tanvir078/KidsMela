import { useState } from 'react';
import { useToast } from '@/Contexts/ToastContext';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const { addToast } = useToast();

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setIsSubscribed(true);
            addToast('Successfully subscribed to Kids Mela updates!', 'success');
            setEmail('');
        }
    };

    if (isSubscribed) {
        return (
            <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white shadow-lg shadow-emerald-200">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🎉</span>
                    <div>
                        <h3 className="text-lg font-black">You're subscribed!</h3>
                        <p className="text-sm font-semibold text-white/90">
                            Check your email for new drops and exclusive fashion deals.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-slate-950 via-rose-950 to-fuchsia-900 p-6 text-white shadow-xl shadow-rose-200">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
            <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">📧</span>
                    <h3 className="text-lg font-black">Get New Drop Alerts</h3>
                </div>
                <p className="mb-4 text-sm font-semibold text-white/90">
                    Subscribe for seasonal collections, restock alerts, and member-only offers.
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-12 flex-1 rounded-2xl border-0 px-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-white/50"
                        required
                    />
                    <button
                        type="submit"
                        className="h-12 rounded-2xl bg-slate-950 px-6 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    );
}
