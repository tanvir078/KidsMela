import { useState, useEffect } from 'react';
import { Truck, Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function ShippingPage() {
  const [activeTab, setActiveTab] = useState('zones');
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingZone, setEditingZone] = useState(null);
  const [selectedZones, setSelectedZones] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    regions: [],
    base_rate: 0,
    active: true,
    sort_order: 0,
  });

  const tabs = [
    { id: 'zones', label: 'Shipping Zones' },
    { id: 'add', label: 'Add Zone' },
  ];

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/shipping-zones?${params}`);
      const data = await response.json();
      setZones(data.data?.data || []);
    } catch (err) {
      console.error('Failed to load shipping zones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddZone = () => {
    setEditingZone(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      regions: [],
      base_rate: 0,
      active: true,
      sort_order: 0,
    });
    setActiveTab('add');
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name || '',
      slug: zone.slug || '',
      description: zone.description || '',
      regions: zone.regions || [],
      base_rate: zone.base_rate || 0,
      active: zone.active ?? true,
      sort_order: zone.sort_order || 0,
    });
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this shipping zone?')) return;
    
    try {
      await fetch(`/api/admin/shipping-zones/${id}`, { method: 'DELETE' });
      setZones(zones.filter(z => z.id !== id));
    } catch (err) {
      console.error('Failed to delete zone:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingZone 
        ? `/api/admin/shipping-zones/${editingZone.id}`
        : '/api/admin/shipping-zones';
      
      const response = await fetch(url, {
        method: editingZone ? 'POST' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActiveTab('zones');
        loadZones();
      }
    } catch (err) {
      console.error('Failed to save zone:', err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBulkDelete = async () => {
    if (selectedZones.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedZones.length} zones?`)) return;
    
    try {
      await fetch('/api/admin/shipping-zones/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedZones }),
      });
      setSelectedZones([]);
      loadZones();
    } catch (err) {
      console.error('Failed to delete zones:', err);
    }
  };

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'zones' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Shipping Zones</h1>
              <p className="text-sm text-slate-600">Manage shipping regions and rates</p>
            </div>
            <button
              onClick={handleAddZone}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              Add Zone
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search zones..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {selectedZones.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <span className="text-blue-900">{selectedZones.length} zones selected</span>
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
            ) : filteredZones.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                No shipping zones found
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredZones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedZones.includes(zone.id)}
                        onChange={() => {
                          setSelectedZones(prev =>
                            prev.includes(zone.id) ? prev.filter(id => id !== zone.id) : [...prev, zone.id]
                          );
                        }}
                        className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                      />
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-rose-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{zone.name}</p>
                          <p className="text-sm text-slate-600">{zone.slug}</p>
                          {zone.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{zone.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">৳{zone.base_rate}</p>
                        <p className="text-xs text-slate-500">Base Rate</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        zone.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {zone.active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleEditZone(zone)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(zone.id)}
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
                {editingZone ? 'Edit Shipping Zone' : 'Add New Shipping Zone'}
              </h1>
              <p className="text-sm text-slate-600">
                {editingZone ? 'Update shipping zone information' : 'Create a new shipping zone'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('zones')}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Zone Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="e.g., Dhaka Metro"
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
                  placeholder="dhaka-metro"
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
                  placeholder="Zone description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Base Rate (BDT)</label>
                <input
                  type="number"
                  name="base_rate"
                  value={formData.base_rate}
                  onChange={handleFormChange}
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="0.00"
                  required
                />
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

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('zones')}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
                >
                  {editingZone ? 'Update Zone' : 'Create Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
