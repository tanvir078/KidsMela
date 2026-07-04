import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { FolderOpen, Plus, Edit, Trash2, Search, Star, Image as ImageIcon } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const tabs = [
    { id: 'list', label: 'Categories List' },
    { id: 'add', label: 'Add Category' },
    { id: 'submenus', label: 'Submenus' },
  ];
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    active: true,
    featured: false,
    parent_id: '',
    order: 0,
    seo_title: '',
    seo_description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminApi.categories();
      setCategories(data.categories || []);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await adminApi.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      active: true,
      featured: false,
      parent_id: '',
      order: 0,
      seo_title: '',
      seo_description: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setBannerImageFile(null);
    setBannerImagePreview(null);
    setActiveTab('add');
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      active: category.active ?? true,
      featured: category.featured ?? false,
      parent_id: category.parent_id || '',
      order: category.order || 0,
      seo_title: category.seo_title || '',
      seo_description: category.seo_description || '',
    });
    setImageFile(null);
    setImagePreview(category.image_path ? `http://127.0.0.1:8001/storage/${category.image_path}` : null);
    setCoverImageFile(null);
    setCoverImagePreview(category.cover_image ? `http://127.0.0.1:8001/storage/${category.cover_image}` : null);
    setBannerImageFile(null);
    setBannerImagePreview(category.banner_image ? `http://127.0.0.1:8001/storage/${category.banner_image}` : null);
    setActiveTab('add');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImageFile(file);
      setBannerImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('active', formData.active);
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('order', formData.order);
      formDataToSend.append('seo_title', formData.seo_title);
      formDataToSend.append('seo_description', formData.seo_description);
      if (formData.parent_id) {
        formDataToSend.append('parent_id', formData.parent_id);
      }
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (coverImageFile) {
        formDataToSend.append('cover_image', coverImageFile);
      }
      if (bannerImageFile) {
        formDataToSend.append('banner_image', bannerImageFile);
      }

      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, formDataToSend);
        setCategories(categories.map(c => 
          c.id === editingCategory.id 
            ? { ...c, ...formData, image_path: imageFile ? 'categories/' + imageFile.name : c.image_path }
            : c
        ));
      } else {
        await adminApi.createCategory(formDataToSend);
        await loadCategories();
      }
      setActiveTab('list');
    } catch (err) {
      setError('Failed to save category');
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-8 w-8 text-rose-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
                <p className="text-sm text-slate-600">Manage your product categories</p>
              </div>
            </div>
            <button
          onClick={handleAddCategory}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 hover:shadow-xl active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full rounded-xl border-2 border-slate-200 py-2.5 pl-10 pr-4 text-sm font-semibold focus:border-rose-500 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid min-h-[400px] place-items-center text-sm font-black text-slate-500">
          Loading...
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-900">Category</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-900">Parent</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-900">Products</th>
                <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider text-slate-900">Featured</th>
                <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider text-slate-900">Active</th>
                <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-wider text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {category.image_path && (
                        <img
                          src={`http://127.0.0.1:8001/storage/${category.image_path}`}
                          alt={category.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm font-black text-slate-900">{category.name}</p>
                        <p className="text-xs font-semibold text-slate-500">{category.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-600">
                    {category.parent?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm font-black text-slate-900">
                    {category.products_count || 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {category.featured ? (
                      <Star className="mx-auto h-5 w-5 fill-amber-400 text-amber-400" />
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${
                      category.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-red-100 text-red-600 transition-all hover:bg-red-200 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-8 w-8 text-rose-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h1>
                <p className="text-sm text-slate-600">
                  {editingCategory ? 'Update category information' : 'Create a new category'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('list')}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold focus:border-rose-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900">Parent Category</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold focus:border-rose-500 focus:outline-none"
                >
                  <option value="">None (Main Category)</option>
                  {categories
                    .filter(c => c.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900">Category Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-rose-500 hover:text-rose-600">
                    <ImageIcon className="h-4 w-4" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900">Cover Image (Hero)</label>
                <div className="flex items-center gap-4">
                  {coverImagePreview && (
                    <img
                      src={coverImagePreview}
                      alt="Cover Preview"
                      className="h-20 w-32 rounded-lg object-cover"
                    />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-rose-500 hover:text-rose-600">
                    <ImageIcon className="h-4 w-4" />
                    <span>Upload Cover</span>
                    <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900">Banner Image</label>
                <div className="flex items-center gap-4">
                  {bannerImagePreview && (
                    <img
                      src={bannerImagePreview}
                      alt="Banner Preview"
                      className="h-20 w-32 rounded-lg object-cover"
                    />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-rose-500 hover:text-rose-600">
                    <ImageIcon className="h-4 w-4" />
                    <span>Upload Banner</span>
                    <input type="file" accept="image/*" onChange={handleBannerImageChange} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold focus:border-rose-500 focus:outline-none"
                  min="0"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900">SEO Title</label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold focus:border-rose-500 focus:outline-none"
                  placeholder="Custom SEO title (optional)"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900">SEO Description</label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold focus:border-rose-500 focus:outline-none"
                  rows={2}
                  placeholder="Custom SEO description (optional)"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm font-bold text-slate-900">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="flex items-center gap-1 text-sm font-bold text-slate-900">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    Featured (Shop by Category)
                  </span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition-all hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 hover:shadow-xl active:scale-95"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'submenus' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Submenus</h1>
              <p className="text-sm text-slate-600">Manage category submenus</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Submenus management coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}
