import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Image as ImageIcon, X } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function BrandsPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    active: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    sort_order: 0,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const tabs = [
    { id: 'list', label: 'Brands List' },
    { id: 'add', label: 'Add Brand' },
  ];

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/brands?${params}`);
      const data = await response.json();
      setBrands(data.data?.data || []);
    } catch (err) {
      console.error('Failed to load brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      active: true,
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      sort_order: 0,
    });
    setLogoFile(null);
    setLogoPreview(null);
    setActiveTab('add');
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      slug: brand.slug || '',
      description: brand.description || '',
      active: brand.active ?? true,
      meta_title: brand.meta_title || '',
      meta_description: brand.meta_description || '',
      meta_keywords: brand.meta_keywords || '',
      sort_order: brand.sort_order || 0,
    });
    setLogoFile(null);
    setLogoPreview(brand.logo_url || null);
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    try {
      await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' });
      setBrands(brands.filter(b => b.id !== id));
    } catch (err) {
      console.error('Failed to delete brand:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('active', formData.active);
      formDataToSend.append('meta_title', formData.meta_title);
      formDataToSend.append('meta_description', formData.meta_description);
      formDataToSend.append('meta_keywords', formData.meta_keywords);
      formDataToSend.append('sort_order', formData.sort_order);
      
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }

      const url = editingBrand 
        ? `/api/admin/brands/${editingBrand.id}`
        : '/api/admin/brands';
      const method = editingBrand ? 'POST' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {},
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActiveTab('list');
        loadBrands();
      }
    } catch (err) {
      console.error('Failed to save brand:', err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBrands.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedBrands.length} brands?`)) return;
    
    try {
      await fetch('/api/admin/brands/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedBrands }),
      });
      setSelectedBrands([]);
      loadBrands();
    } catch (err) {
      console.error('Failed to delete brands:', err);
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Brands</h1>
              <p className="text-sm text-slate-600">Manage product brands</p>
            </div>
            <button
              onClick={handleAddBrand}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              Add Brand
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search brands..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {selectedBrands.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <span className="text-blue-900">{selectedBrands.length} brands selected</span>
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
            ) : filteredBrands.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                No brands found
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredBrands.map((brand) => (
                  <div key={brand.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => {
                          setSelectedBrands(prev =>
                            prev.includes(brand.id) ? prev.filter(id => id !== brand.id) : [...prev, brand.id]
                          );
                        }}
                        className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                      />
                      {brand.logo_url && (
                        <img
                          src={brand.logo_url}
                          alt={brand.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{brand.name}</p>
                        <p className="text-sm text-slate-600">{brand.slug}</p>
                        {brand.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{brand.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        brand.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {brand.active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleEditBrand(brand)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
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
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </h1>
              <p className="text-sm text-slate-600">
                {editingBrand ? 'Update brand information' : 'Create a new brand'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('list')}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="Brand name"
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
                  placeholder="brand-slug"
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
                  placeholder="Brand description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand Logo</label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-rose-500 hover:text-rose-600">
                    <ImageIcon className="h-4 w-4" />
                    <span>Upload Logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                </div>
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

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">SEO</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      placeholder="SEO title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleFormChange}
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      placeholder="SEO description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Keywords</label>
                    <input
                      type="text"
                      name="meta_keywords"
                      value={formData.meta_keywords}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
                >
                  {editingBrand ? 'Update Brand' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
