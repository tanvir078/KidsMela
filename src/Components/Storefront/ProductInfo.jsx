import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Zap, Truck, RotateCcw, Package } from 'lucide-react';

export default function ProductInfo({ product, onAddToCart, onBuyNow }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const hasDiscount = product.sale_price && product.sale_price < product.price;
    const currentPrice = hasDiscount ? product.sale_price : product.price;
    const sizes = product.sizes || [];
    const colors = product.colors || [];
    const hasVariants = sizes.length > 0 || colors.length > 0;

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        onAddToCart?.({
            product_id: product.id,
            size_id: selectedSize?.id,
            color_id: selectedColor?.id,
            quantity,
        });
    };

    const handleBuyNow = () => {
        onBuyNow?.({
            product_id: product.id,
            size_id: selectedSize?.id,
            color_id: selectedColor?.id,
            quantity,
        });
    };

    const getSizeLabel = (size) => {
        switch (size.size_type) {
            case 'baby_month':
                return size.size_name;
            case 'baby_year':
                return size.size_name;
            case 'kids':
                return size.size_name;
            case 'adult':
                return size.size_name;
            default:
                return size.size_name;
        }
    };

    const getStockStatus = () => {
        if (product.stock_status === 'out_of_stock') {
            return { label: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
        }
        if (product.stock_status === 'low_stock') {
            return { label: 'Low Stock', color: 'text-amber-600', bg: 'bg-amber-100' };
        }
        return { label: 'In Stock', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    };

    const stockStatus = getStockStatus();

    return (
        <div className="space-y-6">
            {/* Category & Subcategory */}
            <div className="space-y-1">
                {product.categoryModel && (
                    <p className="text-sm font-semibold text-slate-600">{product.categoryModel.name}</p>
                )}
                {product.subcategory && (
                    <p className="text-sm font-medium text-slate-500">{product.subcategory}</p>
                )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl font-black text-slate-900 leading-tight line-clamp-2">
                {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                    ৳{currentPrice}
                </span>
                {hasDiscount && (
                    <span className="text-lg font-medium text-slate-400 line-through">
                        ৳{product.price}
                    </span>
                )}
            </div>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                {product.sku && (
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-500">SKU:</span>
                        <span className="font-medium text-slate-900">{product.sku}</span>
                    </div>
                )}
                {product.brand && (
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-500">Brand:</span>
                        <span className="font-medium text-slate-900">{product.brand.name}</span>
                    </div>
                )}
                {product.coupon && (
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-500">Coupon:</span>
                        <span className="font-bold text-emerald-600">{product.coupon}</span>
                    </div>
                )}
            </div>

            {/* Variants Section */}
            {hasVariants && (
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Variants</h3>

                    {/* Size Variants */}
                    {sizes.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm font-semibold text-slate-700">Size</p>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size.id}
                                        onClick={() => setSelectedSize(size)}
                                        disabled={!size.is_active || size.stock <= 0}
                                        className={`px-4 py-2.5 text-sm font-semibold rounded-lg border-2 transition-all ${
                                            selectedSize?.id === size.id
                                                ? 'border-slate-900 bg-slate-900 text-white'
                                                : 'border-slate-200 text-slate-700 hover:border-slate-400'
                                        } ${
                                            !size.is_active || size.stock <= 0
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                    >
                                        {getSizeLabel(size)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color Variants */}
                    {colors.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm font-semibold text-slate-700">Color</p>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.id}
                                        onClick={() => setSelectedColor(color)}
                                        disabled={!color.is_active || color.stock <= 0}
                                        className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                                            selectedColor?.id === color.id
                                                ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2'
                                                : 'border-slate-200 hover:border-slate-400'
                                        } ${
                                            !color.is_active || color.stock <= 0
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                        style={{
                                            backgroundColor: color.color_code || '#ccc',
                                        }}
                                        title={color.color_name}
                                        aria-label={`Select ${color.color_name}`}
                                    >
                                        {color.variant_image && (
                                            <img
                                                src={color.variant_image}
                                                alt={color.color_name}
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                            {selectedColor && (
                                <p className="mt-2 text-sm font-medium text-slate-600">
                                    {selectedColor.color_name}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Quantity Selector */}
            <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">Quantity</p>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="grid h-10 w-10 place-items-center rounded-lg border-2 border-slate-200 text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-16 text-center">
                        <span className="text-lg font-bold text-slate-900">{quantity}</span>
                    </div>
                    <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 10}
                        className="grid h-10 w-10 place-items-center rounded-lg border-2 border-slate-200 text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock_status === 'out_of_stock'}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-black text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                </button>
                <button
                    onClick={handleBuyNow}
                    disabled={product.stock_status === 'out_of_stock'}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 px-6 text-sm font-black text-slate-900 transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Zap className="h-5 w-5" />
                    Buy Now
                </button>
            </div>

            {/* Delivery Summary */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-start gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-slate-600 shadow-sm">
                        <Truck className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Estimated Delivery</p>
                        <p className="text-xs font-medium text-slate-600">2-3 business days</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-slate-600 shadow-sm">
                        <Package className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Cash On Delivery</p>
                        <p className="text-xs font-medium text-slate-600">Available nationwide</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-slate-600 shadow-sm">
                        <RotateCcw className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Easy Return</p>
                        <p className="text-xs font-medium text-slate-600">7 days return policy</p>
                    </div>
                </div>
                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${stockStatus.bg} ${stockStatus.color}`}>
                    {stockStatus.label}
                </div>
            </div>
        </div>
    );
}
