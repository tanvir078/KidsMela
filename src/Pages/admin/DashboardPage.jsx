import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { LayoutDashboard, Package, ShoppingCart, Users, TrendingUp, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.dashboard();
      setStats(data.stats);
      setRecentOrders(data.recent_orders || []);
      setRecentProducts(data.recent_products || []);
      setLowStockProducts(data.low_stock_products || []);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Products', value: stats?.total_products || 0, icon: Package, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Total Users', value: stats?.total_users || 0, icon: Users, color: 'bg-purple-500' },
    { label: 'Total Revenue', value: `৳${(stats?.revenue_total || 0).toFixed(2)}`, icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Pending Orders</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{stats?.pending_orders || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Processing Orders</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.processing_orders || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Completed Orders</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.completed_orders || 0}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
        </div>
        <div className="p-6">
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-slate-600">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-100">
                      <td className="py-3 text-sm font-medium text-slate-900">#{order.id}</td>
                      <td className="py-3 text-sm text-slate-600">{order.user?.name || 'Guest'}</td>
                      <td className="py-3 text-sm text-slate-900">৳{(order.total_amount || 0).toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {order.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-slate-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No recent orders</p>
          )}
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-amber-900">Low Stock Alert</h2>
          </div>
          <div className="space-y-2">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600">{product.stock} left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Recent Products</h2>
        </div>
        <div className="p-6">
          {recentProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="border border-slate-200 rounded-lg p-4">
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-600 mt-1">{product.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-bold text-slate-900">৳{(product.price || 0).toFixed(2)}</p>
                    <p className="text-sm text-slate-600">Stock: {product.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No recent products</p>
          )}
        </div>
      </div>
    </div>
  );
}
