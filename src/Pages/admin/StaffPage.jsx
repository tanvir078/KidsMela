import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, Shield, Mail, Phone } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStaff, setEditingStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    status: 'active',
  });

  const tabs = [
    { id: 'list', label: 'Staff List' },
    { id: 'add', label: 'Add Staff' },
  ];

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setStaff(data.data || []);
    } catch (err) {
      console.error('Failed to load staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'admin',
      status: 'active',
    });
    setActiveTab('add');
  };

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name || '',
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      role: staffMember.role || 'admin',
      status: staffMember.status || 'active',
    });
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      setStaff(staff.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete staff:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingStaff 
        ? `/api/admin/users/${editingStaff.id}`
        : '/api/admin/users';
      
      const response = await fetch(url, {
        method: editingStaff ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActiveTab('list');
        loadStaff();
      }
    } catch (err) {
      console.error('Failed to save staff:', err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBulkDelete = async () => {
    if (selectedStaff.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedStaff.length} staff members?`)) return;
    
    try {
      await fetch('/api/admin/users/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedStaff }),
      });
      setSelectedStaff([]);
      loadStaff();
    } catch (err) {
      console.error('Failed to delete staff:', err);
    }
  };

  const filteredStaff = staff.filter(staffMember =>
    staffMember.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'manager': return 'Manager';
      case 'staff': return 'Staff';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-700';
      case 'admin': return 'bg-blue-100 text-blue-700';
      case 'manager': return 'bg-green-100 text-green-700';
      case 'staff': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
              <p className="text-sm text-slate-600">Manage admin team members</p>
            </div>
            <button
              onClick={handleAddStaff}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              Add Staff
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {selectedStaff.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <span className="text-blue-900">{selectedStaff.length} staff selected</span>
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
            ) : filteredStaff.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                No staff members found
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredStaff.map((staffMember) => (
                  <div key={staffMember.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(staffMember.id)}
                        onChange={() => {
                          setSelectedStaff(prev =>
                            prev.includes(staffMember.id) ? prev.filter(id => id !== staffMember.id) : [...prev, staffMember.id]
                          );
                        }}
                        className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                      />
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-rose-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{staffMember.name}</p>
                          <p className="text-sm text-slate-600">{staffMember.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(staffMember.role)}`}>
                        {getRoleLabel(staffMember.role)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        staffMember.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {staffMember.status || 'Active'}
                      </span>
                      <button
                        onClick={() => handleEditStaff(staffMember)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(staffMember.id)}
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
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff'}
              </h1>
              <p className="text-sm text-slate-600">
                {editingStaff ? 'Update staff information' : 'Create a new staff member'}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  {editingStaff ? 'Update Staff' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
