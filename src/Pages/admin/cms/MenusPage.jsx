import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, GripVertical, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function MenusPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    link: '',
    type: 'link',
    target: '_self',
    sort_order: 0,
    is_active: true,
  });

  const tabs = [
    { id: 'list', label: 'Menu List' },
    { id: 'add', label: 'Add Menu' },
  ];

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/navigation');
      const data = await response.json();
      setMenus(data.data || []);
    } catch (err) {
      console.error('Failed to load menus:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenu = () => {
    setEditingMenu(null);
    setFormData({
      label: '',
      link: '',
      type: 'link',
      target: '_self',
      sort_order: 0,
      is_active: true,
    });
    setActiveTab('add');
  };

  const handleEditMenu = (menu) => {
    setEditingMenu(menu);
    setFormData({
      label: menu.label || '',
      link: menu.link || '',
      type: menu.type || 'link',
      target: menu.target || '_self',
      sort_order: menu.sort_order || 0,
      is_active: menu.is_active ?? true,
    });
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      await fetch(`/api/admin/navigation/${id}`, { method: 'DELETE' });
      setMenus(menus.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete menu:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPage 
        ? `/api/admin/navigation/${editingMenu.id}`
        : '/api/admin/navigation';
      const method = editingMenu ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        setActiveTab('list');
        loadMenus();
      }
    } catch (err) {
      console.error('Failed to save menu:', err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReorder = async (dragIndex, dropIndex) => {
    const reorderedMenus = [...menus];
    const [draggedItem] = reorderedMenus.splice(dragIndex, 1);
    reorderedMenus.splice(dropIndex, 0, draggedItem);
    
    // Update sort orders
    const updatedMenus = reorderedMenus.map((menu, index) => ({
      ...menu,
      sort_order: index,
    }));

    try {
      await fetch('/api/admin/navigation/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menus: updatedMenus }),
      });
      
      setMenus(updatedMenus);
    } catch (err) {
      console.error('Failed to reorder menus:', err);
    }
  };

  const filteredMenus = menus.filter(menu =>
    menu.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.link.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Menus</h1>
              <p className="text-sm text-slate-600">Manage storefront navigation menus</p>
            </div>
            <button
              onClick={handleAddMenu}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              Add Menu
            </button>
          </div>

          {/* Info */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm font-semibold text-blue-800">
              ℹ️ These menus appear in the storefront header navigation. Changes reflect immediately on the website.
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search menus..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* Menus List */}
          <div className="rounded-xl border border-slate-200 bg-white">
            {loading ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Loading...
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                No menus found
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredMenus.map((menu, index) => (
                  <div
                    key={menu.id}
                    className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                  >
                    <GripVertical className="h-5 w-5 text-slate-400 cursor-move" />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{menu.label}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          menu.type === 'mega_menu' ? 'bg-purple-100 text-purple-700' :
                          menu.type === 'dropdown' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {menu.type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{menu.link}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        menu.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {menu.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleEditMenu(menu)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(menu.id)}
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {editingMenu ? 'Edit Menu' : 'Add New Menu'}
              </h1>
              <p className="text-sm text-slate-600">
                {editingMenu ? 'Update menu information' : 'Create a new menu item'}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                placeholder="Menu label"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                placeholder="/page-url or https://example.com"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="link">Link</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="mega_menu">Mega Menu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target</label>
                <select
                  name="target"
                  value={formData.target}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="_self">Same Window</option>
                  <option value="_blank">New Window</option>
                </select>
              </div>
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
                {editingMenu ? 'Update Menu' : 'Create Menu'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
