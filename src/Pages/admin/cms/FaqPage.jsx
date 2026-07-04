import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, HelpCircle, Folder, ChevronDown, ChevronUp } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category_id: '',
    sort_order: 0,
    is_active: true,
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });

  const tabs = [
    { id: 'list', label: 'FAQ List' },
    { id: 'add', label: 'Add FAQ' },
    { id: 'categories', label: 'Categories' },
  ];

  useEffect(() => {
    loadFaqs();
    loadCategories();
  }, [selectedCategory]);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/cms/faqs?${params}`);
      const data = await response.json();
      setFaqs(data.data?.data || []);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/cms/faq-categories');
      const data = await response.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleAddFaq = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category_id: selectedCategory || '',
      sort_order: 0,
      is_active: true,
    });
    setActiveTab('add');
  };

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category_id: faq.category_id || '',
      sort_order: faq.sort_order || 0,
      is_active: faq.is_active ?? true,
    });
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      await fetch(`/api/admin/cms/faqs/${id}`, { method: 'DELETE' });
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingFaq 
        ? `/api/admin/cms/faqs/${editingFaq.id}`
        : '/api/admin/cms/faqs';
      const method = editingFaq ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        setActiveTab('list');
        loadFaqs();
      }
    } catch (err) {
      console.error('Failed to save FAQ:', err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/cms/faq-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...categoryForm,
          slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        }),
      });
      
      if (response.ok) {
        setShowCategoryModal(false);
        setCategoryForm({
          name: '',
          slug: '',
          description: '',
          sort_order: 0,
          is_active: true,
        });
        loadCategories();
      }
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await fetch(`/api/admin/cms/faq-categories/${id}`, { method: 'DELETE' });
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">FAQs</h1>
              <p className="text-sm text-slate-600">Manage frequently asked questions</p>
            </div>
            <button
              onClick={handleAddFaq}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              Add FAQ
            </button>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* FAQs List */}
          <div className="rounded-xl border border-slate-200 bg-white">
            {loading ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Loading...
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                No FAQs found
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <HelpCircle className="h-5 w-5 text-rose-600" />
                          <p className="font-semibold text-slate-900">{faq.question}</p>
                        </div>
                        <p className="text-sm text-slate-600 ml-7">{faq.answer}</p>
                        {faq.category && (
                          <span className="inline-block mt-2 ml-7 px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                            {faq.category.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          faq.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleEditFaq(faq)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h1>
              <p className="text-sm text-slate-600">
                {editingFaq ? 'Update FAQ information' : 'Create a new FAQ'}
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                placeholder="Your question here..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Answer</label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleFormChange}
                rows={4}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                placeholder="Your answer here..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="">No Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
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
                {editingFaq ? 'Update FAQ' : 'Create FAQ'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">FAQ Categories</h1>
              <p className="text-sm text-slate-600">Manage FAQ categories</p>
            </div>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Folder className="h-4 w-4" />
              Add Category
            </button>
          </div>

          {/* Categories List */}
          <div className="rounded-xl border border-slate-200 bg-white">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                No categories found
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Folder className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">{category.name}</p>
                        <p className="text-sm text-slate-600">{category.faqs?.length || 0} FAQs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
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

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">New Category</h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>
            
            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="My Category"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="Category description"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
