import { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit, Trash2, Search, DollarSign } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('methods');
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMethod, setEditingMethod] = useState(null);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    code: '',
    description: '',
    config: {},
    active: true,
    sort_order: 0,
  });

  const tabs = [
    { id: 'methods', label: 'Payment Methods' },
    { id: 'add', label: 'Add Method' },
  ];

  useEffect(() => {
    loadMethods();
  }, []);

  const loadMethods = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/payment-methods?${params}`);
      const data = await response.json();
      setMethods(data.data?.data || []);
    } catch (err) {
      console.error('Failed to load payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = () => {
    setEditingMethod(null);
    setFormData({
      name: '',
      slug: '',
      code: '',
      description: '',
      config: {},
      active: true,
      sort_order: 0,
    });
    setActiveTab('add');
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    setFormData({
      name: method.name || '',
      slug: method.slug || '',
      code: method.code || '',
      description: method.description || '',
      config: method.config || {},
      active: method.active ?? true,
      sort_order: method.sort_order || 0,
    });
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    
    try {
      await fetch(`/api/admin/payment-methods/${id}`, { method: 'DELETE' });
      setMethods(methods.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete method:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMethod 
        ? `/api/admin/payment-methods/${editingMethod.id}`
        : '/api/admin/payment-methods';
      
      const response = await fetch(url, {
        method: editingMethod ? 'POST' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActiveTab('methods');
        loadMethods();
      }
    } catch (err) {
      console.error('Failed to save method:', err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBulkDelete = async () => {
    if (selectedMethods.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedMethods.length} methods?`)) return;
    
    try {
      await fetch('/api/admin/payment-methods/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedMethods }),
      });
      setSelectedMethods([]);
      loadMethods();
    } catch (err) {
      console.error('Failed to delete methods:', err);
    }
  };

  const filteredMethods = methods.filter(method =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    method.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'methods' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Payment Methods</h1>
              <p className="text-sm text-slate-600">Manage payment gateways and options</p>
            </div>
            <button
              onClick={handleAddMethod}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              Add Method
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search methods..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {selectedMethods.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <span className="text-blue-900">{selectedMethods.length} methods selected</span>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white">
            {loading ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Loading...
              </div>
            ) : filteredMethods.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                No payment methods found
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedMethods.includes(method.id)}
                        onChange={() => {
                          setSelectedMethods(prev =>
                            prev.includes(method.id) ? prev.filter(id => id !== method.id) : [...prev, method.id]
                          );
                        }}
                        className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                      />
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-rose-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{method.name}</p>
                          <p className="text-sm text-slate-600">{method.code}</p>
                          {method.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{method.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        method.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {method.active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleEditMethod(method)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'add' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
              </h1>
              <p className="text-sm text-slate-600">
                {editingMethod ? 'Update payment method information' : 'Create a new payment method'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('methods')}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Method Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="e.g., bKash"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="bkash"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="BKASH"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="Payment method description"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                  />
                  <label className="text-sm font-medium text-slate-700">Active</label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('methods')}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
                >
                  {editingMethod ? 'Update Method' : 'Create Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
