// Admin API Service
const API_BASE = 'http://127.0.0.1:8000/api/admin';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const adminApi = {
  // Dashboard
  dashboard: async () => {
    const response = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return response.json();
  },

  salesChart: async (period = '7days') => {
    const response = await fetch(`${API_BASE}/sales-chart?period=${period}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch sales chart data');
    return response.json();
  },

  // Products
  products: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/products?${queryString}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },

  bulkUpdateProductStatus: async (productIds, status) => {
    const response = await fetch(`${API_BASE}/products/bulk-status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_ids: productIds, status }),
    });
    if (!response.ok) throw new Error('Failed to bulk update product status');
    return response.json();
  },

  // Orders
  orders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/orders?${queryString}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  getOrder: async (id) => {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch order details');
    return response.json();
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(statusData),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },

  orderStats: async () => {
    const response = await fetch(`${API_BASE}/orders-stats`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch order stats');
    return response.json();
  },

  // Users/Customers
  users: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/users?${queryString}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  getUser: async (id) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch user details');
    return response.json();
  },

  customerAnalytics: async (id) => {
    const response = await fetch(`${API_BASE}/customers/${id}/analytics`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch customer analytics');
    return response.json();
  },

  // Analytics
  analytics: async (period = '30days') => {
    const response = await fetch(`${API_BASE}/analytics?period=${period}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },

  // Settings
  settings: async (settingsData = null) => {
    const url = `${API_BASE}/settings`;
    const options = {
      headers: getAuthHeaders(),
    };

    if (settingsData) {
      options.method = 'PUT';
      options.body = JSON.stringify(settingsData);
    }

    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Failed to handle settings');
    return response.json();
  },

  // Reports
  reports: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/reports?${queryString}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },

  // Banners
  banners: async () => {
    const response = await fetch(`${API_BASE}/banners`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch banners');
    return response.json();
  },

  createBanner: async (bannerData) => {
    const formData = bannerData instanceof FormData ? bannerData : JSON.stringify(bannerData);
    const headers = getAuthHeaders();
    if (!(bannerData instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    } else {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE}/banners`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create banner');
    return response.json();
  },

  updateBanner: async (id, bannerData) => {
    const formData = bannerData instanceof FormData ? bannerData : JSON.stringify(bannerData);
    const headers = getAuthHeaders();
    if (!(bannerData instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    } else {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'PUT',
      headers,
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update banner');
    return response.json();
  },

  deleteBanner: async (id) => {
    const response = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete banner');
    return response.json();
  },

  // Footer Settings
  footerSettings: async () => {
    const response = await fetch(`${API_BASE}/footer-settings`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch footer settings');
    return response.json();
  },

  updateFooterSettings: async (settingsData) => {
    const formData = settingsData instanceof FormData ? settingsData : JSON.stringify(settingsData);
    const headers = getAuthHeaders();
    if (!(settingsData instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    } else {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE}/footer-settings`, {
      method: 'PUT',
      headers,
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update footer settings');
    return response.json();
  },

  exportFooterSettings: async () => {
    const response = await fetch(`${API_BASE}/footer-settings/export`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to export footer settings');
    return response.json();
  },

  importFooterSettings: async (settingsData) => {
    const response = await fetch(`${API_BASE}/footer-settings/import`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(settingsData),
    });
    if (!response.ok) throw new Error('Failed to import footer settings');
    return response.json();
  },

  footerSettingsHistory: async () => {
    const response = await fetch(`${API_BASE}/footer-settings/history`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch footer settings history');
    return response.json();
  },

  restoreFooterSettings: async (historyId) => {
    const response = await fetch(`${API_BASE}/footer-settings/restore`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ history_id: historyId }),
    });
    if (!response.ok) throw new Error('Failed to restore footer settings');
    return response.json();
  },
};
