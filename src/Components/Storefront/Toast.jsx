import { useToast } from '@/Contexts/ToastContext';

const toastStyles = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-blue-500 text-white',
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
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg shadow-slate-300 transition-all duration-300 animate-in slide-in-from-right-5 ${toastStyles[toast.type] || toastStyles.info}`}
                >
                    <span className="text-lg">{toastIcons[toast.type] || toastIcons.info}</span>
                    <span className="text-sm font-black">{toast.message}</span>
                    <button
                        type="button"
                        onClick={() => removeToast(toast.id)}
                        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
