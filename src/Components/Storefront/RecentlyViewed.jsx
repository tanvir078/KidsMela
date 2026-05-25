import { useRecentlyViewed } from '@/Contexts/RecentlyViewedContext';
import ProductCard from './ProductCard';

export default function RecentlyViewed() {
    const { items, clearItems } = useRecentlyViewed();

    if (items.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-950">Recently Viewed</h2>
                <button
                    type="button"
                    onClick={clearItems}
                    className="text-xs font-black text-slate-500 hover:text-slate-700"
                >
                    Clear
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
