import { Head, Link, usePage } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: '📝' },
    { key: 'processing', label: 'Processing', icon: '⚙️' },
    { key: 'shipped', label: 'Shipped', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✅' },
];

const statusColors = {
    'pending': 'bg-amber-100 text-amber-700',
    'processing': 'bg-blue-100 text-blue-700',
    'shipped': 'bg-purple-100 text-purple-700',
    'delivered': 'bg-emerald-100 text-emerald-700',
    'cancelled': 'bg-red-100 text-red-700',
};

export default function OrderTrackingPage({ order }) {
    const { props } = usePage();
    const user = props.auth?.user;

    if (!user) {
        return (
            <MobileShell title="Order Tracking" showSearch={false} simpleHeader={true}>
                <Head title="Order Tracking" />
                <section className="space-y-4 px-4 py-4">
                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="grid h-16 w-16 place-items-center rounded-full bg-orange-100 text-3xl">
                                🔐
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-black text-slate-950">Login Required</h2>
                                <p className="mt-1 text-sm font-semibold text-slate-500">
                                    Sign in to track your order
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <Link href="/login" className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95">
                                <span>🔑</span>
                                Login
                            </Link>
                            <Link href="/register" className="flex items-center justify-center gap-2 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-black text-orange-600 ring-1 ring-orange-100 transition-all duration-200 hover:bg-orange-100 active:scale-95">
                                <span>📝</span>
                                Register
                            </Link>
                        </div>
                    </div>
                </section>
            </MobileShell>
        );
    }

    if (!order) {
        return (
            <MobileShell title="Order Tracking" showSearch={false} simpleHeader={true}>
                <Head title="Order Tracking" />
                <section className="space-y-4 px-4 py-4">
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center shadow-sm ring-1 ring-slate-200">
                        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-200">
                            <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-400" fill="none" aria-hidden="true">
                                <path d="M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className="mt-5 text-xl font-black text-slate-950">Order not found</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            The order you're looking for doesn't exist.
                        </p>
                        <Link href="/orders" className="mt-5 inline-flex rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                            View All Orders
                        </Link>
                    </div>
                </section>
            </MobileShell>
        );
    }

    const orderState = order.order_status || order.status;
    const fulfillmentState = order.fulfillment_status || 'unfulfilled';
    const displayStatus = fulfillmentState === 'delivered' ? 'delivered' : fulfillmentState === 'shipped' ? 'shipped' : orderState;
    const currentStepIndex = statusSteps.findIndex(step => step.key === displayStatus);
    const isCancelled = orderState === 'cancelled';
    const shipping = order.shipping_snapshot || {};
    const shipment = order.shipments?.[0];

    return (
        <MobileShell title="Order Tracking" showSearch={false} simpleHeader={true}>
            <Head title={`Order #${order.id}`} />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                            {order.display_number || `Order #${order.id}`}
                        </p>
                        <h1 className="mt-2 text-2xl font-black">Track Your Order</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-black text-slate-950">Order Status</h2>
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${statusColors[displayStatus] || 'bg-slate-100 text-slate-700'}`}>
                            {displayStatus}
                        </span>
                    </div>
                </div>

                {!isCancelled && (
                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-base font-black text-slate-950 mb-4">Delivery Progress</h2>
                        <div className="space-y-4">
                            {statusSteps.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                const isPending = index > currentStepIndex;

                                return (
                                    <div key={step.key} className="flex items-center gap-3">
                                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl ${
                                            isCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {step.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-black ${isCompleted ? 'text-slate-950' : isCurrent ? 'text-orange-600' : 'text-slate-400'}`}>
                                                {step.label}
                                            </p>
                                            {isCurrent && (
                                                <p className="text-xs font-semibold text-slate-500">In progress</p>
                                            )}
                                            {isCompleted && index < currentStepIndex && (
                                                <p className="text-xs font-semibold text-emerald-600">Completed</p>
                                            )}
                                        </div>
                                        {index < statusSteps.length - 1 && (
                                            <div className={`h-8 w-0.5 ${index < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-base font-black text-slate-950">Order Summary</h2>
                    <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="font-semibold text-slate-500">Total Amount</span>
                            <span className="font-black text-slate-950">{money(order.total_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold text-slate-500">Shipping Address</span>
                            <span className="font-black text-slate-950 text-right max-w-48 truncate">{[shipping.address || order.shipping_address, shipping.city].filter(Boolean).join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold text-slate-500">Phone</span>
                            <span className="font-black text-slate-950">{shipping.phone || order.phone || 'N/A'}</span>
                        </div>
                        {shipment?.tracking_number && (
                            <div className="flex justify-between">
                                <span className="font-semibold text-slate-500">Tracking</span>
                                <span className="font-black text-slate-950">{shipment.tracking_number}</span>
                            </div>
                        )}
                    </div>
                </div>

                <Link href="/orders" className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-95">
                    <span>←</span>
                    Back to Orders
                </Link>
            </section>
        </MobileShell>
    );
}
