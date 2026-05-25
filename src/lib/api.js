const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  const url = new URL(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`);
  Object.entries(options.params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });

  const isFormData = options.body instanceof FormData;
  const response = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers: {
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
    body: options.body === undefined ? undefined : isFormData ? options.body : JSON.stringify(options.body),
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'object'
      ? payload.message || Object.values(payload.errors || {})?.flat()?.[0]
      : payload;
    throw new Error(message || 'Request failed.');
  }

  return payload;
}

export const storefrontApi = {
  home: () => apiRequest('/storefront/home'),
  products: (params) => apiRequest('/storefront/products', { params }),
  product: (id) => apiRequest(`/storefront/products/${id}`),
  categories: () => apiRequest('/storefront/categories'),
  checkoutSettings: () => apiRequest('/storefront/checkout/settings'),
  orders: () => apiRequest('/storefront/orders'),
  order: (id) => apiRequest(`/storefront/orders/${id}`),
  tracking: (id) => apiRequest(`/storefront/orders/${id}/tracking`),
  createOrder: (body) => apiRequest('/storefront/orders', { method: 'POST', body }),
};
