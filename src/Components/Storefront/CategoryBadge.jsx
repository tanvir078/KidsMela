export default function CategoryBadge({ category }) {
    const categoryColors = {
        'Men': 'bg-cyan-100 text-cyan-700',
        'Women': 'bg-pink-100 text-pink-700',
        'Kids': 'bg-sky-100 text-sky-700',
        'Fashion': 'bg-pink-100 text-pink-700',
        'Accessories': 'bg-rose-100 text-rose-700',
        'Shoes': 'bg-emerald-100 text-emerald-700',
        'Beauty': 'bg-fuchsia-100 text-fuchsia-700',
    };

    const colorClass = categoryColors[category] || 'bg-slate-100 text-slate-700';

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-black ${colorClass}`}>
            {category}
        </span>
    );
}
