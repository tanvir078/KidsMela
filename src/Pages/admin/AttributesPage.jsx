import { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, Search, Tag } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function AttributesPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'text',
    description: '',
    options: [],
    required: false,
    filterable: true,
    sort_order: 0,
  });
  const [optionInput, setOptionInput] = useState('');

  const tabs = [
    { id: 'list', label: 'Attributes List' },
    { id: 'add', label: 'Add Attribute' },
  ];

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/attributes?${params}`);
      const data = await response.json();
      setAttributes(data.data?.data || []);
    } catch (err) {
      console.error('Failed to load attributes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttribute = () => {
    setEditingAttribute(null);
    setFormData({
      name: '',
      slug: '',
      type: 'text',
      description: '',
      options: [],
      required: false,
      filterable: true,
      sort_order: 0,
    });
    setOptionInput('');
    setActiveTab('add');
  };

  const handleEditAttribute = (attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name: attribute.name || '',
      slug: attribute.slug || '',
      type: attribute.type || 'text',
      description: attribute.description || '',
      options: attribute.options || [],
      required: attribute.required ?? false,
      filterable: attribute.filterable ?? true,
      sort_order: attribute.sort_order || 0,
    });
    setOptionInput('');
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this attribute?')) return;
    
    try {
      await fetch(`/api/admin/attributes/${id}`, { method: 'DELETE' });
      setAttributes(attributes.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete attribute:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAttribute 
        ? `/api/admin/attributes/${editingAttribute.id}`
        : '/api/admin/attributes';
      
      const response = await fetch(url, {
        method: editingAttribute ? 'POST' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActiveTab('list');
        loadAttributes();
      }
    } catch (err) {
      console.error('Failed to save attribute:', err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setFormData({
        ...formData,
        options: [...formData.options, optionInput.trim()],
      });
      setOptionInput('');
    }
  };

  const handleRemoveOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    });
  };

  const handleBulkDelete = async () => {
    if (selectedAttributes.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedAttributes.length} attributes?`)) return;
    
    try {
      await fetch('/api/admin/attributes/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedAttributes }),
      });
      setSelectedAttributes([]);
      loadAttributes();
    } catch (err) {
      console.error('Failed to delete attributes:', err);
    }
  };

  const filteredAttributes = attributes.filter(attribute =>
    attribute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attribute.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeLabel = (type) => {
    switch (type) {
      case 'text': return 'Text';
      case 'number': return 'Number';
      case 'select': return 'Select';
      case 'checkbox': return 'Checkbox';
      case 'color': return 'Color';
      default: return type;
    }
  };

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Attributes</h1>
              <p className="text-sm text-slate-600">Manage product attributes</p>
            </div>
            <button
              onClick={handleAddAttribute}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              Add Attribute
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search attributes..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {selectedAttributes.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <span className="text-blue-900">{selectedAttributes.length} attributes selected</span>
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
            ) : filteredAttributes.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                No attributes found
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredAttributes.map((attribute) => (
                  <div key={attribute.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedAttributes.includes(attribute.id)}
                        onChange={() => {
                          setSelectedAttributes(prev =>
                            prev.includes(attribute.id) ? prev.filter(id => id !== attribute.id) : [...prev, attribute.id]
                          );
                        }}
                        className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                      />
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
                          <Layers className="h-5 w-5 text-rose-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{attribute.name}</p>
                          <p className="text-sm text-slate-600">{attribute.slug}</p>
                          {attribute.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{attribute.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {getTypeLabel(attribute.type)}
                      </span>
                      {attribute.required && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Required
                        </span>
                      )}
                      <button
                        onClick={() => handleEditAttribute(attribute)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(attribute.id)}
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
                {editingAttribute ? 'Edit Attribute' : 'Add New Attribute'}
              </h1>
              <p className="text-sm text-slate-600">
                {editingAttribute ? 'Update attribute information' : 'Create a new attribute'}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Attribute Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="e.g., Size"
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
                  placeholder="size"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="color">Color</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="Attribute description"
                />
              </div>

              {(formData.type === 'select' || formData.type === 'checkbox') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Options</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={optionInput}
                        onChange={(e) => setOptionInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                        className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                        placeholder="Add option..."
                      />
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {formData.options.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full"
                          >
                            <span className="text-sm">{option}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(index)}
                              className="text-slate-500 hover:text-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="required"
                      checked={formData.required}
                      onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                      className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Required</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="filterable"
                      checked={formData.filterable}
                      onChange={(e) => setFormData({ ...formData, filterable: e.target.checked })}
                      className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Filterable</span>
                  </label>
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
                  {editingAttribute ? 'Update Attribute' : 'Create Attribute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
