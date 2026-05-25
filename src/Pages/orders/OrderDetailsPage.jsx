import { Head, Link } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';

const steps = ['pending', 'processing', 'shipped', 'delivered'];

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function OrderDetailsPage({ order }) {
    const status = order.fulfillment_status === 'delivered' ? 'delivered' : (order.order_status || order.status);
    const activeIndex = Math.max(0, steps.indexOf(status === 'confirmed' ? 'processing' : status));
    const hasItems = (order.items ?? []).length > 0;
    const shipping = order.shipping_snapshot || {};
    const billing = order.billing_snapshot || {};

    return (
        <MobileShell title={`Order #${order.id}`} showSearch={false}>
            <Head title={`Order #${order.id}`} />

            <section className="space-y-4 px-4 py-4">
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                                Tracking
                            </p>
                            <h1 className="mt-2 text-2xl font-black text-slate-950">{order.display_number || `Order #${order.id}`}</h1>
                            <p className="mt-1 text-sm font-semibold text-slate-500">
                                {new Date(order.created_at).toLocaleString()}
                            </p>
                        </div>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                            {status}
                        </span>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Delivery Timeline</h2>
                    <div className="mt-5 space-y-4">
                        {steps.map((step, index) => {
                            const active = index <= activeIndex;

                            return (
                                <div key={step} className="flex items-center gap-3">
                                    <span className={`grid h-9 w-9 place-items-center rounded-full text-xs font-black ${
                                        active ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-black capitalize text-slate-950">{step}</p>
                                        <p className="text-xs font-semibold text-slate-500">
                                            {active ? 'Step reached' : 'Waiting for update'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Purchased Items</h2>
                    {!hasItems && (
                        <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
                            Order item details unavailable for this older order.
                        </p>
                    )}
                    {hasItems && (
                        <div className="mt-4 space-y-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-slate-950">{item.product_name}</p>
                                        <p className="mt-1 text-xs font-bold text-slate-500">
                                            {money(item.unit_price)} x {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-black text-orange-600">{money(item.line_total)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Shipping & Billing</h2>
                    <div className="mt-4 space-y-3 text-sm font-bold text-slate-600">
                        <p>Ship to: {[shipping.address || order.shipping_address, shipping.area, shipping.city, shipping.postcode, shipping.country].filter(Boolean).join(', ')}</p>
                        <p>Shipping phone: {shipping.phone || order.phone}</p>
                        <p>Bill to: {[billing.address, billing.area, billing.city, billing.postcode, billing.country].filter(Boolean).join(', ') || order.shipping_address}</p>
                        <p>Payment: {order.payment_method || 'Cash on delivery'}</p>
                        {order.shipments?.[0]?.tracking_number && <p>Tracking: {order.shipments[0].tracking_number}</p>}
                        <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-lg font-black text-slate-950">
                            <span>Total</span>
                            <span>{money(order.total_amount)}</span>
                        </div>
                    </div>
                </div>

                <Link href="/orders" className="flex h-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                    Back to Orders
                </Link>
            </section>
        </MobileShell>
    );
}
