const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is required');
}

// Import error handler for retry logic and timeouts
import { errorHandler } from './errorHandler';

export async function apiRequest(path, options = {}) {
  const { 
    maxRetries = 3, 
    timeout = 30000,
    ...requestOptions 
  } = options;

  const url = new URL(
    `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
    API_BASE_URL.startsWith('http') ? undefined : window.location.origin
  );
  Object.entries(requestOptions.params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });

  return errorHandler.executeWithRetry(
    async () => {
      const isFormData = requestOptions.body instanceof FormData;
      const response = await fetch(url.toString(), {
        method: requestOptions.method || 'GET',
        headers: {
          Accept: 'application/json',
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...(requestOptions.headers || {}),
        },
        body: requestOptions.body === undefined 
          ? undefined 
          : isFormData 
            ? requestOptions.body 
            : JSON.stringify(requestOptions.body),
      });

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') 
        ? await response.json() 
        : await response.text();

      if (!response.ok) {
        const error = new Error(
          typeof payload === 'object'
            ? payload.message || Object.values(payload.errors || {})?.flat()?.[0]
            : payload
        );
        error.status = response.status;
        error.payload = payload;
        error.url = url.toString();
        throw error;
      }

      return payload;
    },
    { 
      maxRetries, 
      timeout, 
      context: `${requestOptions.method || 'GET'} ${path}` 
    }
  );
}

export const storefrontApi = {
  home: () => apiRequest('/storefront/home'),
  products: (params) => apiRequest('/storefront/products', { params }),
  product: (id) => apiRequest(`/storefront/products/${id}`),
  productBySlug: (slug) => apiRequest(`/storefront/products/slug/${slug}`),
  categories: () => apiRequest('/storefront/categories'),
  categoryBySlug: (slug) => apiRequest(`/storefront/categories/${slug}`),
  categorySubmenus: (slug) => apiRequest(`/storefront/categories/${slug}/submenus`),
  campaigns: () => apiRequest('/storefront/campaigns'),
  checkoutSettings: () => apiRequest('/storefront/checkout/settings'),
  orders: () => apiRequest('/storefront/orders'),
  order: (id) => apiRequest(`/storefront/orders/${id}`),
  tracking: (id) => apiRequest(`/storefront/orders/${id}/tracking`),
  createOrder: (body) => apiRequest('/storefront/orders', { method: 'POST', body }),
  createReturnRequest: (orderId, body) => apiRequest(`/storefront/orders/${orderId}/return-requests`, { method: 'POST', body }),
  banners: () => apiRequest('/banners'),
  footerSettings: () => apiRequest('/footer-settings'),
};
