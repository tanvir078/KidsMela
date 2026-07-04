import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { BarChart3, TrendingUp, Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30days');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'sales', label: 'Sales' },
    { id: 'products', label: 'Products' },
    { id: 'customers', label: 'Customers' },
  ];

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminApi.analytics(period);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics');
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

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
            <p className="text-sm text-slate-600">Track your store performance</p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {analytics && (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-sm text-slate-600">This Period</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">৳{(analytics.sales?.period || 0).toFixed(2)}</p>
                    <p className="text-sm text-slate-600 mt-1">Revenue</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-sm text-slate-600">This Period</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{analytics.sales?.orders_count || 0}</p>
                    <p className="text-sm text-slate-600 mt-1">Orders</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <span className="text-sm text-slate-600">All Time</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">৳{(analytics.sales?.total || 0).toFixed(2)}</p>
                    <p className="text-sm text-slate-600 mt-1">Total Revenue</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Package className="w-5 h-5 text-slate-600" />
                      <h2 className="text-lg font-bold text-slate-900">Products Overview</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-slate-900">{analytics.products?.total || 0}</p>
                        <p className="text-sm text-slate-600">Total Products</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-green-600">{analytics.products?.active || 0}</p>
                        <p className="text-sm text-slate-600">Active</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-amber-600">{analytics.products?.low_stock || 0}</p>
                        <p className="text-sm text-slate-600">Low Stock</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-red-600">{analytics.products?.out_of_stock || 0}</p>
                        <p className="text-sm text-slate-600">Out of Stock</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Users className="w-5 h-5 text-slate-600" />
                      <h2 className="text-lg font-bold text-slate-900">Customers Overview</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-slate-900">{analytics.customers?.total || 0}</p>
                        <p className="text-sm text-slate-600">Total</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-blue-600">{analytics.customers?.new_this_period || 0}</p>
                        <p className="text-sm text-slate-600">New</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-green-600">{analytics.customers?.returning_customers || 0}</p>
                        <p className="text-sm text-slate-600">Returning</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sales' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-5 h-5 text-slate-600" />
                  <h2 className="text-lg font-bold text-slate-900">Sales Reports</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900">৳{(analytics.sales?.period || 0).toFixed(2)}</p>
                    <p className="text-sm text-slate-600">Period Revenue</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900">{analytics.sales?.orders_count || 0}</p>
                    <p className="text-sm text-slate-600">Orders</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900">৳{(analytics.sales?.total || 0).toFixed(2)}</p>
                    <p className="text-sm text-slate-600">Total Revenue</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                  <h2 className="text-lg font-bold text-slate-900">Top Products</h2>
                </div>
                <div className="space-y-3">
                  {analytics.top_products?.slice(0, 10).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-600">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{product.orders_count || 0}</p>
                        <p className="text-sm text-slate-600">orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-slate-600" />
                  <h2 className="text-lg font-bold text-slate-900">Top Customers</h2>
                </div>
                <div className="space-y-3">
                  {analytics.top_customers?.slice(0, 10).map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900">{customer.name || 'Unknown'}</p>
                          <p className="text-sm text-slate-600">{customer.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">৳{(customer.total_spent || 0).toFixed(2)}</p>
                        <p className="text-sm text-slate-600">{customer.orders_count || 0} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
