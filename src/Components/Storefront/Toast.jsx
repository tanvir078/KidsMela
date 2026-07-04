import { useToast } from '@/Contexts/ToastContext';

const toastStyles = {
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200',
    error: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200',
    warning: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-200',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200',
};

const toastIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
};

export default function Toast() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl transition-all duration-300 animate-in slide-in-from-right-5 hover:scale-105 ${toastStyles[toast.type] || toastStyles.info}`}
                >
                    <span className="text-xl">{toastIcons[toast.type] || toastIcons.info}</span>
                    <span className="text-sm font-black">{toast.message}</span>
                    <button
                        type="button"
                        onClick={() => removeToast(toast.id)}
                        className="ml-2 rounded-full bg-white/20 px-2 py-1 text-xs font-bold text-white opacity-70 hover:opacity-100 hover:bg-white/30 transition-all"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
