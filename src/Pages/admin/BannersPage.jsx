import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/adminApi';
import { Image as ImageIcon, Plus, Edit, Trash2, Search, Tag, Megaphone } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState('banners');
  const [banners, setBanners] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    gradient: 'from-orange-500 via-rose-500 to-fuchsia-600',
    bg_color: 'bg-blue-400',
    link: '',
    image_url: '',
    image_alt: '',
    device_type: 'both',
    active: true,
    sort_order: 0,
  });
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order: 0,
    max_discount: null,
    usage_limit: null,
    starts_at: '',
    ends_at: '',
    active: true,
  });
  const [campaignFormData, setCampaignFormData] = useState({
    title: '',
    slug: '',
    description: '',
    badge: '',
    image_path: '',
    link_url: '',
    product_id: null,
    category_id: null,
    starts_at: '',
    ends_at: '',
    active: true,
    priority: 0,
  });
  const [imageFile, setImageFile] = useState(null);

  const tabs = [
    { id: 'banners', label: 'Banners' },
    { id: 'coupons', label: 'Coupons' },
    { id: 'campaigns', label: 'Campaigns' },
  ];

  useEffect(() => {
    loadBanners();
    loadCoupons();
    loadCampaigns();
  }, []);

  const loadBanners = async () => {
    try {
      const data = await adminApi.banners();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Failed to load banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons');
      const data = await response.json();
      setCoupons(data.data?.data || []);
    } catch (error) {
      console.error('Failed to load coupons:', error);
    }
  };

  const loadCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/campaigns');
      const data = await response.json();
      setCampaigns(data.data?.data || []);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    }
  };

  const handleAddBanner = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      discount: '',
      gradient: 'from-orange-500 via-rose-500 to-fuchsia-600',
      bg_color: 'bg-blue-400',
      link: '',
      image_url: '',
      image_alt: '',
      device_type: 'both',
      active: true,
      sort_order: 0,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      discount: banner.discount || '',
      gradient: banner.gradient,
      bg_color: banner.bg_color,
      link: banner.link || '',
      image_url: banner.image_url || '',
      image_alt: banner.image_alt || '',
      device_type: banner.device_type,
      active: banner.active,
      sort_order: banner.sort_order,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      await adminApi.deleteBanner(bannerId);
      loadBanners();
    } catch (error) {
      console.error('Failed to delete banner:', error);
      alert('Failed to delete banner');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('discount', formData.discount);
      formDataToSend.append('gradient', formData.gradient);
      formDataToSend.append('bg_color', formData.bg_color);
      formDataToSend.append('link', formData.link);
      formDataToSend.append('image_url', formData.image_url);
      formDataToSend.append('image_alt', formData.image_alt);
      formDataToSend.append('device_type', formData.device_type);
      formDataToSend.append('active', formData.active);
      formDataToSend.append('sort_order', formData.sort_order);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingBanner) {
        await adminApi.updateBanner(editingBanner.id, formDataToSend);
      } else {
        await adminApi.createBanner(formDataToSend);
      }
      
      setShowModal(false);
      loadBanners();
    } catch (error) {
      console.error('Failed to save banner:', error);
      alert('Failed to save banner');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setCouponFormData({
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order: 0,
      max_discount: null,
      usage_limit: null,
      starts_at: '',
      ends_at: '',
      active: true,
    });
    setShowModal(true);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponFormData({
      code: coupon.code || '',
      name: coupon.name || '',
      description: coupon.description || '',
      discount_type: coupon.discount_type || 'percentage',
      discount_value: coupon.discount_value || 0,
      min_order: coupon.min_order || 0,
      max_discount: coupon.max_discount || null,
      usage_limit: coupon.usage_limit || null,
      starts_at: coupon.starts_at || '',
      ends_at: coupon.ends_at || '',
      active: coupon.active ?? true,
    });
    setShowModal(true);
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      loadCoupons();
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const handleCouponFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingCoupon 
        ? `/api/admin/coupons/${editingCoupon.id}`
        : '/api/admin/coupons';
      
      const response = await fetch(url, {
        method: editingCoupon ? 'POST' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponFormData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        loadCoupons();
      }
    } catch (error) {
      console.error('Failed to save coupon:', error);
      alert('Failed to save coupon');
    }
  };

  const handleCouponFormChange = (e) => {
    setCouponFormData({
      ...couponFormData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleAddCampaign = () => {
    setEditingCampaign(null);
    setCampaignFormData({
      title: '',
      slug: '',
      description: '',
      badge: '',
      image_path: '',
      link_url: '',
      product_id: null,
      category_id: null,
      starts_at: '',
      ends_at: '',
      active: true,
      priority: 0,
    });
    setShowModal(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setCampaignFormData({
      title: campaign.title || '',
      slug: campaign.slug || '',
      description: campaign.description || '',
      badge: campaign.badge || '',
      image_path: campaign.image_path || '',
      link_url: campaign.link_url || '',
      product_id: campaign.product_id || null,
      category_id: campaign.category_id || null,
      starts_at: campaign.starts_at || '',
      ends_at: campaign.ends_at || '',
      active: campaign.active ?? true,
      priority: campaign.priority || 0,
    });
    setShowModal(true);
  };

  const handleDeleteCampaign = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      await fetch(`/api/admin/campaigns/${id}`, { method: 'DELETE' });
      loadCampaigns();
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const handleCampaignFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingCampaign 
        ? `/api/admin/campaigns/${editingCampaign.id}`
        : '/api/admin/campaigns';
      
      const response = await fetch(url, {
        method: editingCampaign ? 'POST' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignFormData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        loadCampaigns();
      }
    } catch (error) {
      console.error('Failed to save campaign:', error);
      alert('Failed to save campaign');
    }
  };

  const handleCampaignFormChange = (e) => {
    setCampaignFormData({
      ...campaignFormData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Banners</h1>
              <p className="text-sm text-slate-600">Manage promotional banners</p>
            </div>
            <button
              onClick={handleAddBanner}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              Add Banner
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sort Order
                  </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {banner.image_url ? (
                    <img
                      src={banner.image_url}
                      alt={banner.image_alt || banner.title}
                      className="h-16 w-32 object-cover rounded"
                    />
                  ) : (
                    <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                  <div className="text-sm text-gray-500">{banner.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {banner.device_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    banner.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {banner.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {banner.sort_order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditBanner(banner)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      )}

      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Coupons</h1>
              <p className="text-sm text-slate-600">Manage discount coupons</p>
            </div>
            <button
              onClick={handleAddCoupon}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Tag className="h-4 w-4" />
              Add Coupon
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white">
            {coupons.length === 0 ? (
              <div className="p-8 text-center">
                <Tag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No coupons found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
                        <Tag className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{coupon.code}</p>
                        <p className="text-sm text-slate-600">{coupon.name || 'No name'}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% off` : `৳${coupon.discount_value} off`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
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

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
              <p className="text-sm text-slate-600">Manage marketing campaigns</p>
            </div>
            <button
              onClick={handleAddCampaign}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Megaphone className="h-4 w-4" />
              Add Campaign
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white">
            {campaigns.length === 0 ? (
              <div className="p-8 text-center">
                <Megaphone className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No campaigns found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {campaign.image_path && (
                        <img
                          src={campaign.image_path}
                          alt={campaign.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{campaign.title}</p>
                        <p className="text-sm text-slate-600">{campaign.slug}</p>
                        {campaign.badge && (
                          <span className="inline-block px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded-full mt-1">
                            {campaign.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {campaign.active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleEditCampaign(campaign)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingCampaign !== null ? (editingCampaign ? 'Edit Campaign' : 'Add Campaign') : (editingCoupon !== null ? (editingCoupon ? 'Edit Coupon' : 'Add Coupon') : (editingBanner ? 'Edit Banner' : 'Add Banner'))}
            </h3>
            
            {editingCampaign !== null ? (
              <form onSubmit={handleCampaignFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Campaign Title</label>
                    <input
                      type="text"
                      required
                      value={campaignFormData.title}
                      onChange={handleCampaignFormChange}
                      name="title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Summer Sale"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                      type="text"
                      required
                      value={campaignFormData.slug}
                      onChange={handleCampaignFormChange}
                      name="slug"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="summer-sale"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={campaignFormData.description}
                      onChange={handleCampaignFormChange}
                      name="description"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Badge</label>
                    <input
                      type="text"
                      value={campaignFormData.badge}
                      onChange={handleCampaignFormChange}
                      name="badge"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="50% OFF"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image Path</label>
                    <input
                      type="text"
                      value={campaignFormData.image_path}
                      onChange={handleCampaignFormChange}
                      name="image_path"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="/images/campaigns/summer.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Link URL</label>
                    <input
                      type="url"
                      value={campaignFormData.link_url}
                      onChange={handleCampaignFormChange}
                      name="link_url"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product ID</label>
                      <input
                        type="number"
                        value={campaignFormData.product_id || ''}
                        onChange={handleCampaignFormChange}
                        name="product_id"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category ID</label>
                      <input
                        type="number"
                        value={campaignFormData.category_id || ''}
                        onChange={handleCampaignFormChange}
                        name="category_id"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="datetime-local"
                        value={campaignFormData.starts_at}
                        onChange={handleCampaignFormChange}
                        name="starts_at"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="datetime-local"
                        value={campaignFormData.ends_at}
                        onChange={handleCampaignFormChange}
                        name="ends_at"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      <input
                        type="number"
                        value={campaignFormData.priority}
                        onChange={handleCampaignFormChange}
                        name="priority"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        checked={campaignFormData.active}
                        onChange={handleCampaignFormChange}
                        name="active"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">Active</label>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {editingCampaign ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            ) : editingCoupon !== null ? (
              <form onSubmit={handleCouponFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                    <input
                      type="text"
                      required
                      value={couponFormData.code}
                      onChange={handleCouponFormChange}
                      name="code"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SAVE10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={couponFormData.name}
                      onChange={handleCouponFormChange}
                      name="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Summer Sale"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={couponFormData.description}
                      onChange={handleCouponFormChange}
                      name="description"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                    <select
                      value={couponFormData.discount_type}
                      onChange={handleCouponFormChange}
                      name="discount_type"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={couponFormData.discount_value}
                      onChange={handleCouponFormChange}
                      name="discount_value"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={couponFormData.discount_type === 'percentage' ? '10' : '100'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Minimum Order</label>
                    <input
                      type="number"
                      value={couponFormData.min_order}
                      onChange={handleCouponFormChange}
                      name="min_order"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Discount</label>
                    <input
                      type="number"
                      value={couponFormData.max_discount || ''}
                      onChange={handleCouponFormChange}
                      name="max_discount"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Usage Limit</label>
                    <input
                      type="number"
                      value={couponFormData.usage_limit || ''}
                      onChange={handleCouponFormChange}
                      name="usage_limit"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="datetime-local"
                        value={couponFormData.starts_at}
                        onChange={handleCouponFormChange}
                        name="starts_at"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="datetime-local"
                        value={couponFormData.ends_at}
                        onChange={handleCouponFormChange}
                        name="ends_at"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={couponFormData.active}
                      onChange={handleCouponFormChange}
                      name="active"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active</label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {editingCoupon ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Text</label>
                    <input
                      type="text"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Link</label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.image_url && (
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="mt-2 h-32 w-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image Alt Text</label>
                    <input
                      type="text"
                      value={formData.image_alt}
                      onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Device Type</label>
                    <select
                      value={formData.device_type}
                      onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="mobile">Mobile Only</option>
                      <option value="desktop">Desktop Only</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active</label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {editingBanner ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
