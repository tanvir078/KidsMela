import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { Package, Plus, Edit, Trash2, Search, Upload, X } from 'lucide-react';

export default function ColorsPage() {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    hex_code: '',
    rgb: '',
    sort_order: 0,
    status: true,
    featured: false,
  });

  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    try {
      setLoading(true);
      const data = await fetch('http://127.0.0.1:8000/api/admin/colors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      }).then(res => res.json());
      setColors(data.colors || []);
      setError(null);
    } catch (err) {
      setError('Failed to load colors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddColor = () => {
    setEditingColor(null);
    setFormData({
      name: '',
      display_name: '',
      hex_code: '',
      rgb: '',
      sort_order: 0,
      status: true,
      featured: false,
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEditColor = (color) => {
    setEditingColor(color);
    setFormData({
      name: color.name || '',
      display_name: color.display_name || '',
      hex_code: color.hex_code || '',
      rgb: color.rgb || '',
      sort_order: color.sort_order || 0,
      status: color.status ?? true,
      featured: color.featured ?? false,
    });
    setImagePreview(color.thumbnail || null);
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
      
      if (imageFile) {
        formDataToSend.append('thumbnail', imageFile);
      }
      
      formDataToSend.append('status', formData.status ? '1' : '0');
      formDataToSend.append('featured', formData.featured ? '1' : '0');

      const url = editingColor 
        ? `http://127.0.0.1:8000/api/admin/colors/${editingColor.id}`
        : 'http://127.0.0.1:8000/api/admin/colors';
      
      const method = editingColor ? 'POST' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to save color');

      setShowModal(false);
      loadColors();
      setError(null);
    } catch (err) {
      setError(editingColor ? 'Failed to update color' : 'Failed to create color');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this color?')) return;
    
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/colors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });
      setColors(colors.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete color');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const filteredColors = colors.filter(color =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (color.display_name && color.display_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <h1 className="text-2xl font-bold text-slate-900">Colors</h1>
          <p className="text-sm text-slate-600">Manage product colors</p>
        </div>
        <button
          onClick={handleAddColor}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Color
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search colors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredColors.map((color) => (
            <div
              key={color.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {color.hex_code && (
                    <div
                      className="w-12 h-12 rounded-lg border border-slate-200"
                      style={{ backgroundColor: color.hex_code }}
                    />
                  )}
                  {color.thumbnail && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${color.thumbnail}`}
                      alt={color.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-slate-900">{color.name}</h3>
                    {color.display_name && (
                      <p className="text-sm text-slate-600">{color.display_name}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                {color.hex_code && <span>HEX: {color.hex_code}</span>}
                {color.sort_order > 0 && <span>Order: {color.sort_order}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  color.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {color.status ? 'Active' : 'Inactive'}
                </span>
                {color.featured && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleEditColor(color)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(color.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredColors.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No colors found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingColor ? 'Edit Color' : 'Add New Color'}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Color Name *</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">HEX Code</label>
                  <input
                    type="text"
                    value={formData.hex_code}
                    onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="#000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">RGB</label>
                  <input
                    type="text"
                    value={formData.rgb}
                    onChange={(e) => setFormData({ ...formData, rgb: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="rgb(0,0,0)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                {imagePreview && (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div></div>
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
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Featured</span>
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
                  {submitting ? 'Saving...' : (editingColor ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
