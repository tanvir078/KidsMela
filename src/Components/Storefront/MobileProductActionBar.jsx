import { ShoppingCart, Zap } from 'lucide-react';

export default function MobileProductActionBar({ product, onAddToCart, onBuyNow, disabled }) {
    const hasDiscount = product.sale_price && product.sale_price < product.price;
    const currentPrice = hasDiscount ? product.sale_price : product.price;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-4 py-3 shadow-lg lg:hidden">
            <div className="flex items-center gap-3">
                {/* Price */}
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">
                            ৳{currentPrice}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm font-medium text-slate-400 line-through">
                                ৳{product.price}
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                        {product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={onAddToCart}
                        disabled={disabled}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-black text-white transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden sm:inline">Add</span>
                    </button>
                    <button
                        onClick={onBuyNow}
                        disabled={disabled}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-black text-white transition-all hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Zap className="h-4 w-4" />
                        <span className="hidden sm:inline">Buy</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
