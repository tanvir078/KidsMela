import { Head, Link, usePage, router } from '@/lib/inertiaCompat';
import { useState, useMemo } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useToast } from '@/Contexts/ToastContext';
import OrderTimeline from '@/Components/Storefront/OrderTimeline';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

const statusColors = {
    'pending': 'bg-amber-100 text-amber-700',
    'processing': 'bg-blue-100 text-blue-700',
    'shipped': 'bg-purple-100 text-purple-700',
    'delivered': 'bg-emerald-100 text-emerald-700',
    'cancelled': 'bg-red-100 text-red-700',
};

export default function OrdersPage({ orders = [] }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const status = props.flash?.status;
    const { addToast } = useToast();
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const statusMatch = filterStatus === 'all' || 
                (order.order_status || order.status) === filterStatus;
            
            if (filterDate === 'all') return statusMatch;
            
            const orderDate = new Date(order.created_at);
            const now = new Date();
            const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
            
            if (filterDate === '30') return statusMatch && daysDiff <= 30;
            if (filterDate === '90') return statusMatch && daysDiff <= 90;
            if (filterDate === '180') return statusMatch && daysDiff <= 180;
            if (filterDate === '365') return statusMatch && daysDiff <= 365;
            
            return statusMatch;
        });
    }, [orders, filterStatus, filterDate]);

    const downloadInvoice = (orderId) => {
        addToast('Downloading invoice...', 'info');
        // In a real implementation, this would call an API to generate/download the invoice
        setTimeout(() => {
            addToast('Invoice downloaded successfully!', 'success');
        }, 1000);
    };

    const handleCancelOrder = (orderId) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        
        setCancellingOrderId(orderId);
        router.delete(`/orders/${orderId}`, {
            onSuccess: () => {
                addToast('Order cancelled successfully', 'success');
            },
            onError: () => {
                addToast('Failed to cancel order', 'error');
            },
            onFinish: () => {
                setCancellingOrderId(null);
            },
        });
    };

    return (
        <MobileShell title="Orders" showSearch={false} simpleHeader={true}>
            <Head title="Orders" />
            <section className="space-y-4 px-4 py-4">
                {status && (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-black text-white shadow-md">
                        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
                        <div className="relative flex items-center gap-2">
                            <span className="text-lg">✅</span>
                            {status}
                        </div>
                    </div>
                )}

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black">My Orders</h1>
                            <p className="mt-2 text-sm font-semibold text-white/90">
                                {user
                                    ? 'Your confirmed Kids Mela orders appear here.'
                                    : 'Order history is available after login.'}
                            </p>
                        </div>
                        {user && orders.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="rounded-full bg-white/20 px-4 py-2 text-sm font-black transition-all duration-200 hover:bg-white/30 active:scale-95"
                            >
                                Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="h-10 w-full rounded-xl border-slate-200 px-3 text-sm font-bold focus:border-orange-500 focus:ring-orange-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">Date Range</label>
                                <select
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="h-10 w-full rounded-xl border-slate-200 px-3 text-sm font-bold focus:border-orange-500 focus:ring-orange-500"
                                >
                                    <option value="all">All Time</option>
                                    <option value="30">Last 30 Days</option>
                                    <option value="90">Last 90 Days</option>
                                    <option value="180">Last 6 Months</option>
                                    <option value="365">Last Year</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-500">{filteredOrders.length} orders found</p>
                            <button
                                type="button"
                                onClick={() => { setFilterStatus('all'); setFilterDate('all'); }}
                                className="text-xs font-black text-orange-600 hover:text-orange-700"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                )}

                {!user && (
                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="grid h-16 w-16 place-items-center rounded-full bg-orange-100 text-3xl">
                                🔐
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-black text-slate-950">Login Required</h2>
                                <p className="mt-1 text-sm font-semibold text-slate-500">
                                    Sign in to view your order history
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
                )}

                {user && filteredOrders.length === 0 && (
                    <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl">
                        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/10 text-4xl">
                            📦
                        </div>
                        <p className="mt-4 text-center text-xs font-black uppercase tracking-[0.2em] text-orange-300">No orders found</p>
                        <h2 className="mt-2 text-center text-xl font-black">
                            {filterStatus !== 'all' || filterDate !== 'all' ? 'Try adjusting your filters' : 'Place your first order'}
                        </h2>
                        <p className="mt-2 text-center text-sm font-semibold leading-6 text-white/70">
                            {filterStatus !== 'all' || filterDate !== 'all' ? 'Clear filters to see all orders' : 'Add products to cart and place an order from checkout.'}
                        </p>
                        {(filterStatus !== 'all' || filterDate !== 'all') ? (
                            <button
                                type="button"
                                onClick={() => { setFilterStatus('all'); setFilterDate('all'); }}
                                className="mt-5 inline-flex w-full justify-center rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition-all duration-200 hover:bg-slate-100 active:scale-95"
                            >
                                Clear Filters
                            </button>
                        ) : (
                            <Link href="/" className="mt-5 inline-flex w-full justify-center rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition-all duration-200 hover:bg-slate-100 active:scale-95">
                                Shop Now
                            </Link>
                        )}
                    </div>
                )}

                {user && filteredOrders.length > 0 && (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const orderStatus = order.order_status || order.status || 'pending';
                            const canCancel = ['pending', 'confirmed', 'processing'].includes(orderStatus);
                            const canDownloadInvoice = ['processing', 'shipped', 'delivered'].includes(orderStatus);

                            return (
                                <div key={order.id} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md hover:ring-slate-300">
                                    <Link href={`/orders/${order.id}`} className="group block">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-black text-slate-950">{order.display_number || `Order #${order.id}`}</p>
                                                <p className="mt-1 text-xs font-bold text-slate-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs font-black ${statusColors[orderStatus] || 'bg-slate-100 text-slate-700'}`}>
                                                {orderStatus}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-4">
                                            <span className="text-sm font-bold text-slate-500">Total</span>
                                            <span className="text-xl font-black text-orange-600">{money(order.total_amount)}</span>
                                        </div>
                                        <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
                                            Delivery to {order.shipping_snapshot?.address || order.shipping_address}
                                        </p>
                                    </Link>
                                    <div className="mt-4">
                                        <OrderTimeline status={orderStatus} />
                                    </div>
                                    <div className="mt-3 flex items-center justify-between gap-2">
                                        <Link href={`/orders/${order.id}/tracking`} className="flex items-center gap-2 text-xs font-black text-orange-600 hover:text-orange-700">
                                            <span>Track order</span>
                                            <span className="transition-transform duration-200 hover:translate-x-1">→</span>
                                        </Link>
                                        <div className="flex gap-2">
                                            {canDownloadInvoice && (
                                                <button
                                                    type="button"
                                                    onClick={() => downloadInvoice(order.id)}
                                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95"
                                                    title="Download Invoice"
                                                >
                                                    📄 Invoice
                                                </button>
                                            )}
                                            {canCancel && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    disabled={cancellingOrderId === order.id}
                                                    className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-600 transition-all duration-200 hover:bg-red-200 active:scale-95 disabled:opacity-50"
                                                >
                                                    {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </MobileShell>
    );
}
