import { createContext, useContext } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { storefrontApi } from './api';

const PageContext = createContext({ props: {}, url: '/' });

export function PageProvider({ value, children }) {
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export function usePage() {
  return useContext(PageContext);
}

export function Head({ title }) {
  if (title) document.title = `${title} - ${import.meta.env.VITE_STORE_NAME || 'Kids Mela'}`;
  return null;
}

export function Link({ href = '/', to, children, ...props }) {
  return (
    <RouterLink to={to || href} {...props}>
      {children}
    </RouterLink>
  );
}

export function RouterBridge() {
  const navigate = useNavigate();
  window.__progotixNavigate = navigate;
  return null;
}

export const router = {
  get(path, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.set(key, value);
    });
    window.__progotixNavigate?.(`${path}${query.toString() ? `?${query}` : ''}`);
  },
  post(path, data, options = {}) {
    const request = path === '/checkout'
      ? storefrontApi.createOrder({ ...data, items: data.items || [] })
      : Promise.resolve({});
    return request
      .then(options.onSuccess)
      .catch((error) => options.onError?.({ request: error.message }))
      .finally(() => options.onFinish?.());
  },
  delete(_path, options = {}) {
    options.onSuccess?.();
  },
};

export function useLocationUrl() {
  const location = useLocation();
  return `${location.pathname}${location.search}`;
}
