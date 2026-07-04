import { useEffect, useState } from 'react';
import { Ticket, Plus, Edit, Trash2, Search, X, Calendar, Percent, DollarSign, Tag, Users, Package, Truck, Gift } from 'lucide-react';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order: 0,
    max_discount: '',
    usage_limit: '',
    user_limit: '',
    starts_at: '',
    ends_at: '',
    active: true,
    category_ids: [],
    product_ids: [],
    free_shipping: false,
    buy_x_get_y: null,
    first_order_only: false,
    customer_groups: [],
    minimum_quantity: 1,
    maximum_quantity: '',
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus) params.append('active', filterStatus === 'active');

      const data = await fetch(`http://127.0.0.1:8000/api/admin/coupons?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      }).then(res => res.json());
      setCoupons(data.data?.data || data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load coupons');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order: 0,
      max_discount: '',
      usage_limit: '',
      user_limit: '',
      starts_at: '',
      ends_at: '',
      active: true,
      category_ids: [],
      product_ids: [],
      free_shipping: false,
      buy_x_get_y: null,
      first_order_only: false,
      customer_groups: [],
      minimum_quantity: 1,
      maximum_quantity: '',
    });
    setShowModal(true);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      name: coupon.name || '',
      description: coupon.description || '',
      discount_type: coupon.discount_type || 'percentage',
      discount_value: coupon.discount_value || '',
      min_order: coupon.min_order || 0,
      max_discount: coupon.max_discount || '',
      usage_limit: coupon.usage_limit || '',
      user_limit: coupon.user_limit || '',
      starts_at: coupon.starts_at ? coupon.starts_at.split('T')[0] : '',
      ends_at: coupon.ends_at ? coupon.ends_at.split('T')[0] : '',
      active: coupon.active ?? true,
      category_ids: coupon.category_ids || [],
      product_ids: coupon.product_ids || [],
      free_shipping: coupon.free_shipping ?? false,
      buy_x_get_y: coupon.buy_x_get_y || null,
      first_order_only: coupon.first_order_only ?? false,
      customer_groups: coupon.customer_groups || [],
      minimum_quantity: coupon.minimum_quantity || 1,
      maximum_quantity: coupon.maximum_quantity || '',
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const url = editingCoupon 
        ? `http://127.0.0.1:8000/api/admin/coupons/${editingCoupon.id}`
        : 'http://127.0.0.1:8000/api/admin/coupons';
      
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save coupon');

      setShowModal(false);
      loadCoupons();
      setError(null);
    } catch (err) {
      setError(editingCoupon ? 'Failed to update coupon' : 'Failed to create coupon');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });
      setCoupons(coupons.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete coupon');
    }
  };

  const handleStatusToggle = async (coupon) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...coupon, active: !coupon.active }),
      });
      loadCoupons();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.name && coupon.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && coupon.active) ||
      (filterStatus === 'inactive' && !coupon.active);
    
    return matchesSearch && matchesStatus;
  });

  const discountTypes = [
    { value: 'percentage', label: 'Percentage', icon: Percent },
    { value: 'fixed', label: 'Fixed Amount', icon: DollarSign },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coupons & Promotions</h1>
          <p className="text-sm text-slate-600">Manage discount codes and promotions</p>
        </div>
        <button
          onClick={handleAddCoupon}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Code</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Discount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Usage</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Valid Period</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-rose-600" />
                      <span className="font-mono font-medium text-slate-900">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">{coupon.name || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {coupon.discount_type === 'percentage' ? (
                        <>
                          <Percent className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-slate-900">{coupon.discount_value}%</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-slate-900">${coupon.discount_value}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-slate-700">
                      {coupon.used_count} / {coupon.usage_limit || '∞'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      coupon.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">
                    {coupon.starts_at && coupon.ends_at ? (
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(coupon.starts_at).toLocaleDateString()} - {new Date(coupon.ends_at).toLocaleDateString()}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusToggle(coupon)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        {coupon.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No coupons found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                    placeholder="SUMMER2024"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Summer Sale"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Describe this coupon..."
                />
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Discount Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
                    <select
                      value={formData.discount_type}
                      onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {discountTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {formData.discount_type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'} *
                    </label>
                    <input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Order Amount</label>
                    <input
                      type="number"
                      value={formData.min_order}
                      onChange={(e) => setFormData({ ...formData, min_order: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Discount</label>
                    <input
                      type="number"
                      value={formData.max_discount}
                      onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      min="0"
                      step="0.01"
                      placeholder="No limit"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Usage Limits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Per User Limit</label>
                    <input
                      type="number"
                      value={formData.user_limit}
                      onChange={(e) => setFormData({ ...formData, user_limit: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Validity Period</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.starts_at}
                      onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.ends_at}
                      onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Quantity</label>
                    <input
                      type="number"
                      value={formData.minimum_quantity}
                      onChange={(e) => setFormData({ ...formData, minimum_quantity: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Quantity</label>
                    <input
                      type="number"
                      value={formData.maximum_quantity}
                      onChange={(e) => setFormData({ ...formData, maximum_quantity: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      min="1"
                      placeholder="No limit"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.free_shipping}
                      onChange={(e) => setFormData({ ...formData, free_shipping: e.target.checked })}
                      className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                    />
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Free Shipping
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.first_order_only}
                      onChange={(e) => setFormData({ ...formData, first_order_only: e.target.checked })}
                      className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                    />
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      First Order Only
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (editingCoupon ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
