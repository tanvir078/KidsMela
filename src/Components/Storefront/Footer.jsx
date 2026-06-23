import { Link } from '@/lib/inertiaCompat';
import { Mail, Phone, MapPin, Shield, Truck, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { storefrontApi } from '@/lib/api';

const SocialIcon = ({ className, children, viewBox = '0 0 24 24' }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox={viewBox}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

const Facebook = ({ className }) => (
  <SocialIcon className={className}>
    <path d="M14 8.5h2V5h-2.7C10.1 5 8 7.1 8 10.3V12H5v3.5h3V22h4v-6.5h3.2l.8-3.5h-4v-1.6c0-1.1.5-1.9 2-1.9Z" />
  </SocialIcon>
);

const Instagram = ({ className }) => (
  <SocialIcon className={className}>
    <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.9 2.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7.3a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 2a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z" />
  </SocialIcon>
);

const Twitter = ({ className }) => (
  <SocialIcon className={className}>
    <path d="M18.2 2.8h3.1l-6.8 7.8 8 10.6h-6.3l-4.9-6.4-5.6 6.4H2.6l7.3-8.4L2.2 2.8h6.4l4.4 5.9 5.2-5.9Zm-1.1 16.5h1.7L7.7 4.6H5.9l11.2 14.7Z" />
  </SocialIcon>
);

const Youtube = ({ className }) => (
  <SocialIcon className={className}>
    <path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.8 4 12 4 12 4s-3.8 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.8v1.7c0 1.8.2 3.6.2 3.6s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.7.2 6.4.2 6.4.2s3.8 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.6v-1.7c0-1.8-.2-3.6-.2-3.6ZM10.2 14.8V8.6l5.9 3.1-5.9 3.1Z" />
  </SocialIcon>
);

const footerLinks = {
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '/press' },
  ],
  'Customer Service': [
    { label: 'Help Center', href: '/help' },
    { label: 'Track Order', href: '/orders' },
    { label: 'Returns & Refunds', href: '/return-policy' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
  ],
  'Quick Links': [
    { label: 'My Account', href: '/account' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Cart', href: '/cart' },
    { label: 'Recently Viewed', href: '/recently-viewed' },
    { label: 'Compare', href: '/compare' },
  ],
  'Legal': [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refund' },
  ],
};

const paymentMethods = [
  { name: 'Visa', icon: '💳' },
  { name: 'Mastercard', icon: '💳' },
  { name: 'bKash', icon: '📱' },
  { name: 'Nagad', icon: '📱' },
  { name: 'Cash on Delivery', icon: '💵' },
];

export default function Footer() {
  const [footerSettings, setFooterSettings] = useState(null);

  useEffect(() => {
    const loadFooterSettings = async () => {
      try {
        const data = await storefrontApi.footerSettings();
        setFooterSettings(data.footer_settings);
      } catch (error) {
        console.error('Failed to load footer settings:', error);
      }
    };
    loadFooterSettings();
  }, []);

  const settings = footerSettings || {
    brand_name: 'Kids Mela',
    logo_url: null,
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

  const footerLinks = {
    'Company': settings.company_links,
    'Customer Service': settings.customer_service_links,
    'Quick Links': settings.quick_links,
    'Legal': settings.legal_links,
  };

  return (
    <footer className="hidden lg:block border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-rose-600 to-fuchsia-700 shadow-lg shadow-rose-500/30">
                {settings.logo_url ? (
                  <img
                    className="h-7 w-7"
                    alt="Logo"
                    src={settings.logo_url}
                  />
                ) : (
                  <img
                    className="h-7 w-7"
                    alt="Logo"
                    src={import.meta.env.VITE_APP_LOGO || '/favicon.svg'}
                  />
                )}
              </div>
              <span className="text-xl font-black text-white">{settings.brand_name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {settings.brand_description}
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-4 w-4 text-rose-500" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-rose-500" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="h-4 w-4 mt-0.5 text-rose-500" />
                <span>{settings.address}</span>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex gap-3 flex-wrap">
              {settings.facebook_url && settings.facebook_url !== '#' && (
                <a
                  href={settings.facebook_url}
                  aria-label="Facebook"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-slate-800 text-slate-400 transition-all hover:bg-rose-600 hover:text-white"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings.instagram_url && settings.instagram_url !== '#' && (
                <a
                  href={settings.instagram_url}
                  aria-label="Instagram"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-slate-800 text-slate-400 transition-all hover:bg-rose-600 hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.twitter_url && settings.twitter_url !== '#' && (
                <a
                  href={settings.twitter_url}
                  aria-label="Twitter"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-slate-800 text-slate-400 transition-all hover:bg-rose-600 hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {settings.youtube_url && settings.youtube_url !== '#' && (
                <a
                  href={settings.youtube_url}
                  aria-label="Youtube"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-slate-800 text-slate-400 transition-all hover:bg-rose-600 hover:text-white"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {settings.linkedin_url && settings.linkedin_url !== '#' && (
                <a
                  href={settings.linkedin_url}
                  aria-label="LinkedIn"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-slate-800 text-slate-400 transition-all hover:bg-rose-600 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {settings.tiktok_url && settings.tiktok_url !== '#' && (
                <a
                  href={settings.tiktok_url}
                  aria-label="TikTok"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-slate-800 text-slate-400 transition-all hover:bg-rose-600 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.51 1.5-.12 3.23 1.06 4.25 1.3 1.12 3.16 1.32 4.7.5.96-.54 1.57-1.57 1.6-2.68.05-2.97.01-5.95.01-8.93-2.43.02-4.86.02-7.29.02-.02-2.92-.01-5.84-.01-8.76z"/>
                  </svg>
                </a>
              )}
              {settings.pinterest_url && settings.pinterest_url !== '#' && (
                <a
                  href={settings.pinterest_url}
                  aria-label="Pinterest"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-slate-800 text-slate-400 transition-all hover:bg-rose-600 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links?.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-rose-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges & Payment methods */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Shield className="h-5 w-5 text-green-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Truck className="h-5 w-5 text-blue-500" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <RotateCcw className="h-5 w-5 text-amber-500" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-purple-500" fill="none">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Quality Guaranteed</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
              <p className="text-sm font-semibold text-slate-400">We Accept:</p>
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300"
                >
                  <span className="text-lg">{method.icon}</span>
                  <span>{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            {settings.copyright_text}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500 sm:justify-end">
            <Link href="/privacy" className="transition-colors hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-slate-300">
              Terms of Service
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-slate-300">
              Cookie Policy
            </Link>
            <Link href="/sitemap" className="transition-colors hover:text-slate-300">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
