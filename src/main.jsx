import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

document.documentElement.style.setProperty('--brand-color', import.meta.env.VITE_BRAND_COLOR || '#f97316');
document.documentElement.style.setProperty('--brand-color-dark', import.meta.env.VITE_BRAND_COLOR_DARK || '#c2410c');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
