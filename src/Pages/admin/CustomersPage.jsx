import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { Users, Search, Eye, TrendingUp } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerAnalytics, setCustomerAnalytics] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      
      const data = await adminApi.users(params);
      setCustomers(data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewCustomer = async (customer) => {
    try {
      setSelectedCustomer(customer);
      const analytics = await adminApi.customerAnalytics(customer.id);
      setCustomerAnalytics(analytics);
    } catch (err) {
      setError('Failed to load customer details');
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
        <p className="text-slate-600 mt-1">Manage your customer base</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <button
            onClick={loadCustomers}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-slate-600 border-b border-slate-200">
                <th className="p-4">Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-rose-600 font-medium">
                          {customer.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{customer.name || 'Unknown'}</p>
                        {customer.is_admin && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Admin</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{customer.email || 'N/A'}</td>
                  <td className="p-4 text-sm text-slate-900">{customer.total_orders || 0}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">
                    ৳{(customer.total_spent || 0).toFixed(2)}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleViewCustomer(customer)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-slate-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No customers found</p>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Customer Details</h2>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setCustomerAnalytics(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                  <span className="text-rose-600 text-2xl font-bold">
                    {selectedCustomer.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCustomer.name || 'Unknown'}</h3>
                  <p className="text-sm text-slate-600">{selectedCustomer.email || 'N/A'}</p>
                  {selectedCustomer.is_admin && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1 inline-block">Admin</span>
                  )}
                </div>
              </div>

              {customerAnalytics && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">Total Orders</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{customerAnalytics.total_orders || 0}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">Total Spent</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">৳{(customerAnalytics.total_spent || 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">Avg Order</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">৳{(customerAnalytics.average_order_value || 0).toFixed(2)}</p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-medium text-slate-900 mb-2">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Member Since:</span>
                    <span className="text-slate-900">{new Date(selectedCustomer.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email Verified:</span>
                    <span className="text-slate-900">{selectedCustomer.email_verified_at ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {customerAnalytics?.last_order && (
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Last Order</h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Order ID:</span>
                      <span className="text-slate-900">#{customerAnalytics.last_order.id}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-slate-600">Amount:</span>
                      <span className="text-slate-900">৳{(customerAnalytics.last_order.total_amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-slate-600">Date:</span>
                      <span className="text-slate-900">{new Date(customerAnalytics.last_order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
