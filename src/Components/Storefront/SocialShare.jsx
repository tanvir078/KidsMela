import { useState } from 'react';

export default function SocialShare({ product }) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out ${product.name} on Progotix!`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const sharePlatforms = [
        {
            name: 'Facebook',
            icon: '📘',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: 'Twitter',
            icon: '🐦',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: 'WhatsApp',
            icon: '💬',
            url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        },
        {
            name: 'Pinterest',
            icon: '📌',
            url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`,
        },
    ];

    return (
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-base font-black text-slate-950 mb-4">Share this product</h2>
            <div className="flex flex-wrap gap-2">
                {sharePlatforms.map((platform) => (
                    <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl transition-all duration-200 hover:bg-slate-200 active:scale-95"
                        title={platform.name}
                    >
                        {platform.icon}
                    </a>
                ))}
                <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex h-12 items-center justify-center rounded-2xl bg-orange-100 px-4 text-sm font-black text-orange-700 transition-all duration-200 hover:bg-orange-200 active:scale-95"
                >
                    {copied ? '✓ Copied' : '🔗 Copy Link'}
                </button>
            </div>
        </div>
    );
}
