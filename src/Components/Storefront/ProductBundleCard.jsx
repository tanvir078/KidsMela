import { Link } from '@/lib/inertiaCompat';
import { useCart } from '@/Contexts/CartContext';

export default function ProductBundleCard({ bundle }) {
    const { addItem } = useCart();

    const handleAddBundleToCart = () => {
        // Add all products from bundle to cart
        bundle.products.forEach((product) => {
            addItem(product, product.pivot?.quantity || 1);
        });
    };

    const totalOriginalPrice = bundle.products.reduce((sum, product) => {
        return sum + (Number(product.price) * (product.pivot?.quantity || 1));
    }, 0);

    const savings = totalOriginalPrice - Number(bundle.bundle_price);
    const discountPercentage = bundle.discount_percentage || Math.round((savings / totalOriginalPrice) * 100);

    return (
        <div className="group relative overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-100 transition-shadow duration-200 hover:shadow-md">
            {/* Bundle Badge */}
            {discountPercentage > 0 && (
                <div className="absolute left-2 top-2 z-10 rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white shadow-sm">
                    SAVE {discountPercentage}%
                </div>
            )}

            {/* Bundle Image */}
            <Link href={`/bundles/${bundle.id}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-100 to-rose-100">
                    {bundle.image_url ? (
                        <img
                            src={bundle.image_url}
                            alt={bundle.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <div className="grid h-16 w-16 place-items-center rounded-full bg-white/80 text-orange-600">
                                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8-4m0-10L4 7m8 4v10M4 7l8-4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            {/* Bundle Info */}
            <div className="p-4">
                <Link href={`/bundles/${bundle.id}`}>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-rose-600 transition-colors">
                        {bundle.name}
                    </h3>
                </Link>

                {bundle.description && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{bundle.description}</p>
                )}

                {/* Products in Bundle */}
                <div className="mt-3 flex flex-wrap gap-1">
                    {bundle.products.slice(0, 3).map((product) => (
                        <div key={product.id} className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                            <div className="h-4 w-4 rounded-full bg-slate-200 overflow-hidden">
                                {product.image_url && (
                                    <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                                )}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-600">
                                {product.name.split(' ')[0]}
                            </span>
                        </div>
                    ))}
                    {bundle.products.length > 3 && (
                        <span className="text-[10px] font-semibold text-slate-500">
                            +{bundle.products.length - 3} more
                        </span>
                    )}
                </div>

                {/* Pricing */}
                <div className="mt-3 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-green-600">
                                ${Number(bundle.bundle_price).toFixed(2)}
                            </span>
                            {savings > 0 && (
                                <span className="text-xs font-semibold text-slate-400 line-through">
                                    ${totalOriginalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                        {savings > 0 && (
                            <p className="text-[10px] font-bold text-rose-600">
                                You save ${savings.toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddBundleToCart}
                    className="mt-3 w-full rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-black text-white transition-all duration-200 hover:bg-rose-700 active:scale-95"
                >
                    Add Bundle to Cart
                </button>
            </div>
        </div>
    );
}
