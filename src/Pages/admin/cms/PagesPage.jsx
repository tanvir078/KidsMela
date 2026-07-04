import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, FileText, Eye, MoreVertical } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function PagesPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_image: '',
    status: 'draft',
    published_at: '',
    is_active: true,
  });

  const tabs = [
    { id: 'list', label: 'Pages List' },
    { id: 'add', label: 'Add Page' },
  ];

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/cms/pages');
      const data = await response.json();
      setPages(data.data?.data || []);
    } catch (err) {
      console.error('Failed to load pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPage = () => {
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_image: '',
      status: 'draft',
      published_at: '',
      is_active: true,
    });
    setActiveTab('add');
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
    setFormData({
      title: page.title || '',
      slug: page.slug || '',
      content: page.content || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      og_image: page.og_image || '',
      status: page.status || 'draft',
      published_at: page.published_at || '',
      is_active: page.is_active ?? true,
    });
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    try {
      await fetch(`/api/admin/cms/pages/${id}`, { method: 'DELETE' });
      setPages(pages.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete page:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPage 
        ? `/api/admin/cms/pages/${editingPage.id}`
        : '/api/admin/cms/pages';
      const method = editingPage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        setActiveTab('list');
        loadPages();
      }
    } catch (err) {
      console.error('Failed to save page:', err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Pages</h1>
              <p className="text-sm text-slate-600">Manage your website pages</p>
            </div>
            <button
              onClick={handleAddPage}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              Add Page
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pages..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* Pages Table */}
          <div className="rounded-xl border border-slate-200 bg-white">
            {loading ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Loading...
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                No pages found
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-sm font-medium text-slate-600">
                    <th className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedPages.length === filteredPages.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPages(filteredPages.map(p => p.id));
                          } else {
                            setSelectedPages([]);
                          }
                        }}
                      />
                    </th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Active</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedPages.includes(page.id)}
                          onChange={() => {
                            setSelectedPages(prev =>
                              prev.includes(page.id) ? prev.filter(p => p !== page.id) : [...prev, page.id]
                            );
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{page.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{page.slug}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          page.status === 'published' ? 'bg-green-100 text-green-700' :
                          page.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {page.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          page.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {page.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditPage(page)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(page.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'add' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {editingPage ? 'Edit Page' : 'Add New Page'}
              </h1>
              <p className="text-sm text-slate-600">
                {editingPage ? 'Update page information' : 'Create a new page'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('list')}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="Page title"
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
                  placeholder="page-slug"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                rows={10}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                placeholder="Page content..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Published At</label>
                <input
                  type="datetime-local"
                  name="published_at"
                  value={formData.published_at}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
              />
              <label className="text-sm font-medium text-slate-700">Active</label>
            </div>

            {/* SEO Section */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">SEO</h3>
              <div className="space-y-4">
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
                    rows={3}
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">OG Image</label>
                  <input
                    type="text"
                    name="og_image"
                    value={formData.og_image}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    placeholder="https://example.com/og-image.jpg"
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
                {editingPage ? 'Update Page' : 'Create Page'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
