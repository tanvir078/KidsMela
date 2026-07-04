import { useEffect, useState } from 'react';
import { Package, Plus, Edit, Trash2, Search, Upload, X, Star, Calendar } from 'lucide-react';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    gradient: '',
    bg_color: '',
    text_color: '',
    display_order: 0,
    type: 'custom',
    season: '',
    active: true,
    featured: false,
    start_date: '',
    end_date: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    auto_product_rules: null,
    manual_product_assignment: false,
    product_ids: [],
  });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (filterType) params.append('type', filterType);
      if (filterStatus) params.append('status', filterStatus);

      const data = await fetch(`http://127.0.0.1:8000/api/admin/collections?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      }).then(res => res.json());
      setCollections(data.collections || []);
      setError(null);
    } catch (err) {
      setError('Failed to load collections');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollection = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      gradient: '',
      bg_color: '',
      text_color: '',
      display_order: 0,
      type: 'custom',
      season: '',
      active: true,
      featured: false,
      start_date: '',
      end_date: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      auto_product_rules: null,
      manual_product_assignment: false,
      product_ids: [],
    });
    setImageFile(null);
    setImagePreview(null);
    setBannerImageFile(null);
    setBannerImagePreview(null);
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setShowModal(true);
  };

  const handleEditCollection = (collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name || '',
      slug: collection.slug || '',
      description: collection.description || '',
      gradient: collection.gradient || '',
      bg_color: collection.bg_color || '',
      text_color: collection.text_color || '',
      display_order: collection.display_order || 0,
      type: collection.type || 'custom',
      season: collection.season || '',
      active: collection.active ?? true,
      featured: collection.featured ?? false,
      start_date: collection.start_date ? collection.start_date.split('T')[0] : '',
      end_date: collection.end_date ? collection.end_date.split('T')[0] : '',
      meta_title: collection.meta_title || '',
      meta_description: collection.meta_description || '',
      meta_keywords: collection.meta_keywords || '',
      auto_product_rules: collection.auto_product_rules || null,
      manual_product_assignment: collection.manual_product_assignment ?? false,
      product_ids: collection.products?.map(p => p.id) || [],
    });
    setImagePreview(collection.image || null);
    setBannerImagePreview(collection.banner_image || null);
    setCoverImagePreview(collection.cover_image || null);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          if (key === 'product_ids') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });
      
      if (imageFile) formDataToSend.append('image', imageFile);
      if (bannerImageFile) formDataToSend.append('banner_image', bannerImageFile);
      if (coverImageFile) formDataToSend.append('cover_image', coverImageFile);
      
      formDataToSend.append('active', formData.active ? '1' : '0');
      formDataToSend.append('featured', formData.featured ? '1' : '0');
      formDataToSend.append('manual_product_assignment', formData.manual_product_assignment ? '1' : '0');

      const url = editingCollection 
        ? `http://127.0.0.1:8000/api/admin/collections/${editingCollection.id}`
        : 'http://127.0.0.1:8000/api/admin/collections';
      
      const method = editingCollection ? 'POST' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to save collection');

      setShowModal(false);
      loadCollections();
      setError(null);
    } catch (err) {
      setError(editingCollection ? 'Failed to update collection' : 'Failed to create collection');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/collections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });
      setCollections(collections.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete collection');
    }
  };

  const handleImageChange = (e, setter, previewSetter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        previewSetter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (setter, previewSetter) => {
    setter(null);
    previewSetter(null);
  };

  const handleStatusToggle = async (collection) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/collections/${collection.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !collection.active }),
      });
      loadCollections();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleFeaturedToggle = async (collection) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/collections/${collection.id}/featured`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !collection.featured }),
      });
      loadCollections();
    } catch (err) {
      setError('Failed to update featured status');
    }
  };

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = 
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (collection.slug && collection.slug.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !filterType || collection.type === filterType;
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && collection.active) ||
      (filterStatus === 'inactive' && !collection.active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const collectionTypes = [
    { value: 'featured', label: 'Featured' },
    { value: 'seasonal', label: 'Seasonal' },
    { value: 'landing', label: 'Landing' },
    { value: 'custom', label: 'Custom' },
  ];

  const seasons = ['Winter', 'Summer', 'Spring', 'Fall', 'Festival', 'Sale'];

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
          <h1 className="text-2xl font-bold text-slate-900">Collections</h1>
          <p className="text-sm text-slate-600">Manage product collections</p>
        </div>
        <button
          onClick={handleAddCollection}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Collection
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search collections..."
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
            {collectionTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{collection.name}</h3>
                  <p className="text-sm text-slate-500">{collection.slug}</p>
                </div>
                {collection.featured && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
              
              {collection.image && (
                <img
                  src={`http://127.0.0.1:8000/storage/${collection.image}`}
                  alt={collection.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {collectionTypes.find(t => t.value === collection.type)?.label || collection.type}
                </span>
                {collection.season && (
                  <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                    {collection.season}
                  </span>
                )}
                {collection.products && (
                  <span>{collection.products.length} products</span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  collection.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {collection.active ? 'Active' : 'Inactive'}
                </span>
                {(collection.start_date || collection.end_date) && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Scheduled
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleEditCollection(collection)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleStatusToggle(collection)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {collection.active ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDelete(collection.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCollections.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No collections found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Collection Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Auto-generated if empty"
                  />
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {collectionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Season</label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Select Season</option>
                    {seasons.map(season => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gradient</label>
                  <input
                    type="text"
                    value={formData.gradient}
                    onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="linear-gradient(...)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={formData.bg_color}
                    onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                    className="w-full h-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="w-full h-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setImageFile, setImagePreview)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  {imagePreview && (
                    <div className="mt-2 relative inline-block">
                      <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                      <button type="button" onClick={() => handleRemoveImage(setImageFile, setImagePreview)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setBannerImageFile, setBannerImagePreview)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  {bannerImagePreview && (
                    <div className="mt-2 relative inline-block">
                      <img src={bannerImagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                      <button type="button" onClick={() => handleRemoveImage(setBannerImageFile, setBannerImagePreview)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setCoverImageFile, setCoverImagePreview)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  {coverImagePreview && (
                    <div className="mt-2 relative inline-block">
                      <img src={coverImagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                      <button type="button" onClick={() => handleRemoveImage(setCoverImageFile, setCoverImagePreview)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                    <textarea
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Keywords</label>
                    <input
                      type="text"
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
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
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.manual_product_assignment}
                    onChange={(e) => setFormData({ ...formData, manual_product_assignment: e.target.checked })}
                    className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Manual Product Assignment</span>
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
                  {submitting ? 'Saving...' : (editingCollection ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
