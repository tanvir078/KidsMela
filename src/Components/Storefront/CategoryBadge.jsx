export default function CategoryBadge({ category }) {
    const categoryColors = {
        'Electronics': 'bg-blue-100 text-blue-700',
        'Fashion': 'bg-pink-100 text-pink-700',
        'Gadgets': 'bg-purple-100 text-purple-700',
        'Sports': 'bg-green-100 text-green-700',
        'Home': 'bg-amber-100 text-amber-700',
        'Accessories': 'bg-rose-100 text-rose-700',
        'Books': 'bg-indigo-100 text-indigo-700',
        'Toys': 'bg-cyan-100 text-cyan-700',
        'Food': 'bg-orange-100 text-orange-700',
        'Beauty': 'bg-fuchsia-100 text-fuchsia-700',
    };

    const colorClass = categoryColors[category] || 'bg-slate-100 text-slate-700';

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-black ${colorClass}`}>
            {category}
        </span>
    );
}
