import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { Layers, Plus, Edit, Trash2, Search, Image as ImageIcon } from 'lucide-react';

export default function SubmenusPage() {
  const [submenus, setSubmenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubmenu, setEditingSubmenu] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    parent_id: '',
    name: '',
    slug: '',
    order: 0,
    active: true,
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [submenusData, categoriesData] = await Promise.all([
        adminApi.submenus(),
        adminApi.categories(),
      ]);
      setSubmenus(submenusData.submenus || []);
      setCategories(categoriesData.categories || []);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this submenu?')) return;
    
    try {
      await adminApi.deleteSubmenu(id);
      setSubmenus(submenus.filter(s => s.id !== id));
    } catch (err) {
      setError('Failed to delete submenu');
    }
  };

  const handleAddSubmenu = () => {
    setEditingSubmenu(null);
    setFormData({
      category_id: '',
      parent_id: '',
      name: '',
      slug: '',
      order: 0,
      active: true,
    });
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setShowAddModal(true);
  };

  const handleEditSubmenu = (submenu) => {
    setEditingSubmenu(submenu);
    setFormData({
      category_id: submenu.category_id || '',
      parent_id: submenu.parent_id || '',
      name: submenu.name || '',
      slug: submenu.slug || '',
      order: submenu.order || 0,
      active: submenu.active ?? true,
    });
    setThumbnailFile(null);
    setThumbnailPreview(submenu.thumbnail ? `http://127.0.0.1:8001/storage/${submenu.thumbnail}` : null);
    setShowAddModal(true);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('active', formData.active);
      formDataToSend.append('order', formData.order);
      if (formData.parent_id) {
        formDataToSend.append('parent_id', formData.parent_id);
      }
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      if (editingSubmenu) {
        await adminApi.updateSubmenu(editingSubmenu.id, formDataToSend);
        setSubmenus(submenus.map(s => 
          s.id === editingSubmenu.id 
            ? { ...s, ...formData, thumbnail: thumbnailFile ? 'submenus/' + thumbnailFile.name : s.thumbnail }
            : s
        ));
      } else {
        await adminApi.createSubmenu(formDataToSend);
        await loadData();
      }
      setShowAddModal(false);
    } catch (err) {
      setError('Failed to save submenu');
    }
  };

  const filteredSubmenus = submenus.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="h-8 w-8 text-rose-600" />
          <div>
            <h1 className="text-2xl font-black text-slate-900">Submenus</h1>
            <p className="text-sm font-semibold text-slate-500">Manage category submenus</p>
          </div>
        </div>
        <button
          onClick={handleAddSubmenu}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 hover:shadow-xl active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Submenu
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
            placeholder="Search submenus..."
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
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-900">Submenu</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-900">Category</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-900">Parent</th>
                <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider text-slate-900">Order</th>
                <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider text-slate-900">Active</th>
                <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-wider text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmenus.map((submenu) => (
                <tr key={submenu.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {submenu.thumbnail && (
                        <img
                          src={`http://127.0.0.1:8001/storage/${submenu.thumbnail}`}
                          alt={submenu.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm font-black text-slate-900">{submenu.name}</p>
                        <p className="text-xs font-semibold text-slate-500">{submenu.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-600">
                    {submenu.category?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-600">
                    {submenu.parent?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-black text-slate-900">
                    {submenu.order}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${
                      submenu.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {submenu.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditSubmenu(submenu)}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(submenu.id)}
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

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-lg w-full rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                {editingSubmenu ? 'Edit Submenu' : 'Add Submenu'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold focus:border-rose-500 focus:outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900">Parent Submenu</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold focus:border-rose-500 focus:outline-none"
                >
                  <option value="">None (Top Level)</option>
                  {submenus
                    .filter(s => s.id !== editingSubmenu?.id)
                    .map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                </select>
              </div>
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
                <label className="mb-1.5 block text-sm font-bold text-slate-900">Thumbnail</label>
                <div className="flex items-center gap-4">
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-rose-500 hover:text-rose-600">
                    <ImageIcon className="h-4 w-4" />
                    <span>Upload Thumbnail</span>
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                  </label>
                </div>
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
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition-all hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 hover:shadow-xl active:scale-95"
                >
                  {editingSubmenu ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
