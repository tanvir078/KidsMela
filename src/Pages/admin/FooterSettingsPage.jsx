import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/adminApi';
import { Building2, Phone, Mail, MapPin, Share2, Camera, Hash, Video, BriefcaseBusiness, Music, Pin, Link as LinkIcon, Copyright, Save, Loader2, CheckCircle, XCircle, Info, Upload, Download, Eye, EyeOff, RefreshCw, Palette, History, RotateCcw } from 'lucide-react';

export default function FooterSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await adminApi.footerSettings();
      setSettings(data.footer_settings);
    } catch (error) {
      console.error('Failed to load footer settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!settings.brand_name?.trim()) {
      newErrors.brand_name = 'Brand name is required';
    }
    
    if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (settings.phone && !/^[\d\s\+\-\(\)]+$/.test(settings.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors before saving.' });
      return;
    }
    
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      
      // Add logo file if present
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      // Add all other settings
      Object.keys(settings).forEach(key => {
        if (key !== 'logo_url' || !logoFile) {
          if (Array.isArray(settings[key])) {
            formData.append(key, JSON.stringify(settings[key]));
          } else {
            formData.append(key, settings[key]);
          }
        }
      });
      
      await adminApi.updateFooterSettings(formData);
      setMessage({ type: 'success', text: 'Footer settings updated successfully!' });
      setLogoFile(null);
      setLogoPreview(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Failed to update footer settings:', error);
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLinkChange = (section, index, field, value) => {
    const newLinks = [...settings[`${section}_links`]];
    newLinks[index][field] = value;
    setSettings({ ...settings, [`${section}_links`]: newLinks });
    // Clear error for this field if it exists
    if (errors[`${section}_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`${section}_${index}_${field}`]: '' }));
    }
  };

  const addLink = (section) => {
    const newLinks = [...settings[`${section}_links`], { label: '', href: '' }];
    setSettings({ ...settings, [`${section}_links`]: newLinks });
  };

  const removeLink = (section, index) => {
    const newLinks = settings[`${section}_links`].filter((_, i) => i !== index);
    setSettings({ ...settings, [`${section}_links`]: newLinks });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleExport = async () => {
    try {
      const data = await adminApi.exportFooterSettings();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `footer-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Footer settings exported successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Failed to export footer settings:', error);
      setMessage({ type: 'error', text: 'Failed to export settings. Please try again.' });
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.footer_settings) {
            await adminApi.importFooterSettings(data);
            await loadSettings();
            setMessage({ type: 'success', text: 'Footer settings imported successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
          } else {
            setMessage({ type: 'error', text: 'Invalid file format. Please export a valid footer settings file.' });
          }
        } catch (error) {
          console.error('Failed to import footer settings:', error);
          setMessage({ type: 'error', text: 'Failed to import settings. Please check the file format.' });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetToDefaults = async () => {
    if (window.confirm('Are you sure you want to reset all footer settings to default values? This action cannot be undone.')) {
      try {
        const defaultSettings = {
          brand_name: 'Kids Mela',
          brand_description: 'Your destination for curated fashion. Discover the latest trends in clothing, shoes, and accessories with fast delivery and easy returns.',
          phone: '+880 1XXX-XXXXXX',
          email: 'support@kidsmela.com',
          address: 'Dhaka, Bangladesh',
          company_links: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Blog', href: '/blog' },
            { label: 'Press', href: '/press' },
          ],
          customer_service_links: [
            { label: 'Help Center', href: '/help' },
            { label: 'Track Order', href: '/orders' },
            { label: 'Returns & Refunds', href: '/return-policy' },
            { label: 'Shipping Info', href: '/shipping' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact Us', href: '/contact' },
          ],
          quick_links: [
            { label: 'My Account', href: '/account' },
            { label: 'My Orders', href: '/orders' },
            { label: 'Wishlist', href: '/wishlist' },
            { label: 'Cart', href: '/cart' },
            { label: 'Recently Viewed', href: '/recently-viewed' },
            { label: 'Compare', href: '/compare' },
          ],
          legal_links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
            { label: 'Refund Policy', href: '/refund' },
          ],
          facebook_url: '#',
          instagram_url: '#',
          twitter_url: '#',
          youtube_url: '#',
          linkedin_url: '#',
          tiktok_url: '#',
          pinterest_url: '#',
          copyright_text: `© ${new Date().getFullYear()} Kids Mela. All rights reserved.`,
          primary_color: '#1f2937',
          secondary_color: '#6b7280',
          accent_color: '#f43f5e',
        };
        
        await adminApi.updateFooterSettings(defaultSettings);
        await loadSettings();
        setMessage({ type: 'success', text: 'Footer settings reset to defaults!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        console.error('Failed to reset footer settings:', error);
        setMessage({ type: 'error', text: 'Failed to reset settings. Please try again.' });
      }
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await adminApi.footerSettingsHistory();
      setHistory(data.history);
    } catch (error) {
      console.error('Failed to load history:', error);
      setMessage({ type: 'error', text: 'Failed to load version history.' });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleRestore = async (historyId) => {
    if (window.confirm('Are you sure you want to restore this version? Current settings will be replaced.')) {
      try {
        await adminApi.restoreFooterSettings(historyId);
        await loadSettings();
        await loadHistory();
        setMessage({ type: 'success', text: 'Footer settings restored successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        console.error('Failed to restore settings:', error);
        setMessage({ type: 'error', text: 'Failed to restore settings. Please try again.' });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Settings Not Found</h3>
          <p className="text-red-600">Unable to load footer settings. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Footer Settings</h1>
            <p className="text-gray-600 mt-2">Manage your footer content, contact information, and navigation links</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <label className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button
              type="button"
              onClick={() => {
                setShowHistory(!showHistory);
                if (!showHistory) loadHistory();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-900">Version History</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1 ml-8">View and restore previous versions of footer settings</p>
          </div>
          <div className="p-6">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No version history available yet.</p>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          Version #{item.id}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.change_description || 'Settings updated'}
                      </p>
                      {item.changed_by && (
                        <p className="text-xs text-gray-500 mt-1">Changed by: {item.changed_by}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRestore(item.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Brand Information</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1 ml-8">Configure your brand identity and description</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={settings.brand_name}
                onChange={(e) => {
                  setSettings({ ...settings, brand_name: e.target.value });
                  if (errors.brand_name) setErrors(prev => ({ ...prev, brand_name: '' }));
                }}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.brand_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your brand name"
              />
              {errors.brand_name && (
                <p className="text-red-600 text-sm mt-1">{errors.brand_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Logo</label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                {(logoPreview || settings.logo_url) && (
                  <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={logoPreview || settings.logo_url}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Description</label>
              <textarea
                value={settings.brand_description}
                onChange={(e) => setSettings({ ...settings, brand_description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                rows="3"
                placeholder="Describe your brand in a few sentences"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1 ml-8">Manage your contact details for customer support</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => {
                  setSettings({ ...settings, phone: e.target.value });
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="+880 1XXX-XXXXXX"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => {
                  setSettings({ ...settings, email: e.target.value });
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="support@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Physical Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Dhaka, Bangladesh"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Share2 className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Social Media Links</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1 ml-8">Connect your social media profiles</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-blue-600" />
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebook_url}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="https://facebook.com/yourbrand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Camera className="h-4 w-4 text-pink-600" />
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="https://instagram.com/yourbrand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-400" />
                Twitter URL
              </label>
              <input
                type="url"
                value={settings.twitter_url}
                onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="https://twitter.com/yourbrand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Video className="h-4 w-4 text-red-600" />
                YouTube URL
              </label>
              <input
                type="url"
                value={settings.youtube_url}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="https://youtube.com/yourbrand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-blue-700" />
                LinkedIn URL
              </label>
              <input
                type="url"
                value={settings.linkedin_url || ''}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="https://linkedin.com/company/yourbrand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Music className="h-4 w-4 text-black" />
                TikTok URL
              </label>
              <input
                type="url"
                value={settings.tiktok_url || ''}
                onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="https://tiktok.com/@yourbrand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Pin className="h-4 w-4 text-red-700" />
                Pinterest URL
              </label>
              <input
                type="url"
                value={settings.pinterest_url || ''}
                onChange={(e) => setSettings({ ...settings, pinterest_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="https://pinterest.com/yourbrand"
              />
            </div>
          </div>
        </div>

        {/* Color Customization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Color Customization</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1 ml-8">Customize footer colors to match your brand</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primary_color || '#1f2937'}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color || '#1f2937'}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="#1f2937"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.secondary_color || '#6b7280'}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color || '#6b7280'}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="#6b7280"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.accent_color || '#f43f5e'}
                    onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.accent_color || '#f43f5e'}
                    onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="#f43f5e"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        {['company', 'customer_service', 'quick', 'legal'].map((section) => (
          <div key={section} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <LinkIcon className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {section.replace('_', ' ')} Links
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1 ml-8">Manage navigation links for this section</p>
            </div>
            <div className="p-6 space-y-3">
              {settings[`${section}_links`]?.map((link, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                    <input
                      type="text"
                      placeholder="Link label"
                      value={link.label}
                      onChange={(e) => handleLinkChange(section, index, 'label', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                    <input
                      type="text"
                      placeholder="/path"
                      value={link.href}
                      onChange={(e) => handleLinkChange(section, index, 'href', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => removeLink(section, index)}
                      className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addLink(section)}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                Add Link
              </button>
            </div>
          </div>
        ))}

        {/* Copyright Text */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Copyright className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Copyright Text</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1 ml-8">Customize your copyright notice</p>
          </div>
          <div className="p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Notice</label>
              <input
                type="text"
                value={settings.copyright_text}
                onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                placeholder="© 2026 Your Brand. All rights reserved."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
