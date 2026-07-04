import { useEffect, useState } from 'react';
import { Package, Plus, Edit, Trash2, Search, X } from 'lucide-react';

export default function SizesPage() {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSize, setEditingSize] = useState(null);
  const [filterType, setFilterType] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    code: '',
    type: 'custom',
    description: '',
    sort_order: 0,
    status: true,
  });

  useEffect(() => {
    loadSizes();
  }, []);

  const loadSizes = async () => {
    try {
      setLoading(true);
      const data = await fetch('http://127.0.0.1:8000/api/admin/sizes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      }).then(res => res.json());
      setSizes(data.sizes || []);
      setError(null);
    } catch (err) {
      setError('Failed to load sizes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSize = () => {
    setEditingSize(null);
    setFormData({
      name: '',
      display_name: '',
      code: '',
      type: 'custom',
      description: '',
      sort_order: 0,
      status: true,
    });
    setShowModal(true);
  };

  const handleEditSize = (size) => {
    setEditingSize(size);
    setFormData({
      name: size.name || '',
      display_name: size.display_name || '',
      code: size.code || '',
      type: size.type || 'custom',
      description: size.description || '',
      sort_order: size.sort_order || 0,
      status: size.status ?? true,
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      formDataToSend.append('status', formData.status ? '1' : '0');

      const url = editingSize 
        ? `http://127.0.0.1:8000/api/admin/sizes/${editingSize.id}`
        : 'http://127.0.0.1:8000/api/admin/sizes';
      
      const method = editingSize ? 'POST' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to save size');

      setShowModal(false);
      loadSizes();
      setError(null);
    } catch (err) {
      setError(editingSize ? 'Failed to update size' : 'Failed to create size');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this size?')) return;
    
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/sizes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });
      setSizes(sizes.filter(s => s.id !== id));
    } catch (err) {
      setError('Failed to delete size');
    }
  };

  const filteredSizes = sizes.filter(size => {
    const matchesSearch = 
      size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (size.display_name && size.display_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (size.code && size.code.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !filterType || size.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const sizeTypes = [
    { value: 'baby_month', label: 'Baby Month' },
    { value: 'baby_year', label: 'Baby Year' },
    { value: 'kids', label: 'Kids' },
    { value: 'adult', label: 'Adult' },
    { value: 'custom', label: 'Custom' },
  ];

  const getTypeLabel = (type) => {
    const found = sizeTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Sizes</h1>
          <p className="text-sm text-slate-600">Manage product sizes</p>
        </div>
        <button
          onClick={handleAddSize}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Size
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search sizes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">All Types</option>
            {sizeTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSizes.map((size) => (
            <div
              key={size.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-slate-900">{size.name}</h3>
                  {size.display_name && (
                    <p className="text-sm text-slate-600">{size.display_name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                {size.code && <span>Code: {size.code}</span>}
                {size.sort_order > 0 && <span>Order: {size.sort_order}</span>}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {getTypeLabel(size.type)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  size.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {size.status ? 'Active' : 'Inactive'}
                </span>
              </div>
              {size.description && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{size.description}</p>
              )}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleEditSize(size)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(size.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSizes.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No sizes found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingSize ? 'Edit Size' : 'Add New Size'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Size Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {sizeTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  min="0"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
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
                  {submitting ? 'Saving...' : (editingSize ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
