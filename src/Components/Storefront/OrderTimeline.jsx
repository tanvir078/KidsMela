const TIMELINE_STEPS = [
    { key: 'pending', label: 'Order Placed', icon: '📝' },
    { key: 'processing', label: 'Processing', icon: '⚙️' },
    { key: 'shipped', label: 'Shipped', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✅' },
];

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderTimeline({ status = 'pending' }) {
    const currentIndex = STATUS_ORDER.indexOf(status);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-950">Order Status</h2>
            <div className="space-y-4">
                {TIMELINE_STEPS.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const isPending = index > currentIndex;

                    return (
                        <div key={step.key} className="flex items-start gap-4">
                            <div className="relative">
                                <div
                                    className={`grid h-10 w-10 place-items-center rounded-full text-xl ${
                                        isCompleted
                                            ? 'bg-gradient-to-br from-orange-500 to-rose-500 text-white'
                                            : isCurrent
                                            ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-300'
                                            : 'bg-slate-100 text-slate-400'
                                    }`}
                                >
                                    {step.icon}
                                </div>
                                {index < TIMELINE_STEPS.length - 1 && (
                                    <div
                                        className={`absolute left-1/2 top-10 h-12 w-0.5 -translate-x-1/2 ${
                                            index < currentIndex ? 'bg-orange-500' : 'bg-slate-200'
                                        }`}
                                    />
                                )}
                            </div>
                            <div className="flex-1 pt-1">
                                <p
                                    className={`text-sm font-black ${
                                        isCompleted ? 'text-slate-950' : isCurrent ? 'text-orange-600' : 'text-slate-400'
                                    }`}
                                >
                                    {step.label}
                                </p>
                                {isCurrent && (
                                    <p className="mt-1 text-xs font-semibold text-slate-500">In progress</p>
                                )}
                                {isCompleted && index < currentIndex && (
                                    <p className="mt-1 text-xs font-semibold text-emerald-600">Completed</p>
                                )}
                                {isPending && (
                                    <p className="mt-1 text-xs font-semibold text-slate-400">Pending</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
