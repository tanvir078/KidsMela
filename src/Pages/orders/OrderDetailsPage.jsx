import { Head, Link } from '@/lib/inertiaCompat';
import { useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { storefrontApi } from '@/lib/api';
import { useToast } from '@/Contexts/ToastContext';

const steps = ['pending', 'processing', 'shipped', 'delivered'];

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function OrderDetailsPage({ order }) {
    const { addToast } = useToast();
    const [returnForm, setReturnForm] = useState({
        order_item_id: order.items?.[0]?.id || '',
        type: 'exchange',
        reason: 'Size issue',
        requested_size: '',
        requested_color: '',
        details: '',
    });
    const [submittingReturn, setSubmittingReturn] = useState(false);
    const status = order.fulfillment_status === 'delivered' ? 'delivered' : (order.order_status || order.status);
    const activeIndex = Math.max(0, steps.indexOf(status === 'confirmed' ? 'processing' : status));
    const hasItems = (order.items ?? []).length > 0;
    const shipping = order.shipping_snapshot || {};
    const billing = order.billing_snapshot || {};
    const canRequestReturn = ['delivered', 'completed'].includes(order.fulfillment_status || order.order_status || order.status);

    const submitReturnRequest = async (event) => {
        event.preventDefault();
        setSubmittingReturn(true);
        try {
            await storefrontApi.createReturnRequest(order.id, returnForm);
            addToast('Return/exchange request submitted.', 'success');
            setReturnForm((current) => ({ ...current, details: '', requested_size: '', requested_color: '' }));
        } catch (error) {
            addToast(error.message || 'Request could not be submitted.', 'error');
        } finally {
            setSubmittingReturn(false);
        }
    };

    return (
        <MobileShell title={`Order #${order.id}`} showSearch={false} simpleHeader={true}>
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
                                        {(item.options?.size || item.options?.color) && (
                                            <p className="mt-1 text-xs font-black text-rose-600">
                                                {[item.options?.size && `Size ${item.options.size}`, item.options?.color].filter(Boolean).join(' / ')}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm font-black text-orange-600">{money(item.line_total)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Return / Exchange</h2>
                    {order.return_requests?.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {order.return_requests.map((request) => (
                                <div key={request.id} className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-600">
                                    <p className="font-black text-slate-950">{request.type} · {request.status}</p>
                                    <p className="mt-1">{request.reason}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {!canRequestReturn ? (
                        <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
                            Return or exchange requests open after delivery.
                        </p>
                    ) : (
                        <form onSubmit={submitReturnRequest} className="mt-4 space-y-3">
                            <select
                                value={returnForm.order_item_id}
                                onChange={(event) => setReturnForm((current) => ({ ...current, order_item_id: event.target.value }))}
                                className="h-11 w-full rounded-2xl border-slate-200 px-3 text-sm font-bold"
                            >
                                {order.items?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.product_name} {item.options?.size ? `- ${item.options.size}` : ''}
                                    </option>
                                ))}
                            </select>
                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    value={returnForm.type}
                                    onChange={(event) => setReturnForm((current) => ({ ...current, type: event.target.value }))}
                                    className="h-11 rounded-2xl border-slate-200 px-3 text-sm font-bold"
                                >
                                    <option value="exchange">Exchange</option>
                                    <option value="return">Return</option>
                                    <option value="refund">Refund</option>
                                </select>
                                <select
                                    value={returnForm.reason}
                                    onChange={(event) => setReturnForm((current) => ({ ...current, reason: event.target.value }))}
                                    className="h-11 rounded-2xl border-slate-200 px-3 text-sm font-bold"
                                >
                                    <option value="Size issue">Size issue</option>
                                    <option value="Color issue">Color issue</option>
                                    <option value="Damaged item">Damaged item</option>
                                    <option value="Wrong product">Wrong product</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    value={returnForm.requested_size}
                                    onChange={(event) => setReturnForm((current) => ({ ...current, requested_size: event.target.value }))}
                                    className="h-11 rounded-2xl border-slate-200 px-3 text-sm font-bold"
                                    placeholder="Requested size"
                                />
                                <input
                                    value={returnForm.requested_color}
                                    onChange={(event) => setReturnForm((current) => ({ ...current, requested_color: event.target.value }))}
                                    className="h-11 rounded-2xl border-slate-200 px-3 text-sm font-bold"
                                    placeholder="Requested color"
                                />
                            </div>
                            <textarea
                                value={returnForm.details}
                                onChange={(event) => setReturnForm((current) => ({ ...current, details: event.target.value }))}
                                className="min-h-20 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold"
                                placeholder="Describe the issue"
                            />
                            <button
                                type="submit"
                                disabled={submittingReturn}
                                className="h-11 w-full rounded-2xl bg-rose-600 text-sm font-black text-white disabled:bg-slate-300"
                            >
                                {submittingReturn ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
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
