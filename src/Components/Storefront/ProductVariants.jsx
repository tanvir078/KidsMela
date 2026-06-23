import { useMemo, useState } from 'react';
import SizeGuide from './SizeGuide';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const DEFAULT_COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Yellow', hex: '#F59E0B' },
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Ivory', hex: '#F8F1DF' },
    { name: 'Sage', hex: '#9CAF88' },
    { name: 'Indigo', hex: '#3730A3' },
    { name: 'Washed Blue', hex: '#93C5FD' },
    { name: 'Khaki', hex: '#BDA06A' },
    { name: 'Olive', hex: '#708238' },
    { name: 'Rose', hex: '#FB7185' },
    { name: 'Maroon', hex: '#7F1D1D' },
    { name: 'Blush', hex: '#FBCFE8' },
    { name: 'Sky', hex: '#BAE6FD' },
    { name: 'Tan', hex: '#B45309' },
    { name: 'Brown', hex: '#7C2D12' },
    { name: 'Beige', hex: '#E7D8BE' },
    { name: 'Light Blue', hex: '#BFDBFE' },
    { name: 'Navy', hex: '#1E3A8A' },
    { name: 'Mint', hex: '#A7F3D0' },
];

function asArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function colorToOption(color) {
    if (typeof color === 'object') return color;
    const match = DEFAULT_COLORS.find((item) => item.name.toLowerCase() === String(color).toLowerCase());
    return match || { name: color, hex: '#64748b' };
}

export default function ProductVariants({ product, selectedVariant, onVariantChange }) {
    const sizes = asArray(product?.sizes || product?.available_sizes || product?.size);
    const colorOptions = asArray(product?.colors || product?.available_colors || product?.color || product?.colour).map(colorToOption);
    const availableSizes = useMemo(() => (sizes.length ? sizes : SIZES), [sizes]);
    const availableColors = useMemo(() => (colorOptions.length ? colorOptions : DEFAULT_COLORS), [colorOptions]);
    const selectedSize = selectedVariant?.size || '';
    const selectedColor = selectedVariant?.color || null;
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    const handleSizeChange = (size) => {
        const color = selectedColor;
        onVariantChange?.({
            size,
            color,
            key: color ? `${size}-${color.name}` : '',
        });
    };

    const handleColorChange = (color) => {
        onVariantChange?.({
            size: selectedSize,
            color,
            key: selectedSize ? `${selectedSize}-${color.name}` : '',
        });
    };

    return (
        <>
            <div className="space-y-4">
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-600">Size <span className="text-rose-600">*</span></label>
                        <button
                            type="button"
                            onClick={() => setShowSizeGuide(true)}
                            className="text-xs font-black text-rose-600 hover:text-rose-700"
                        >
                            Size Guide
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {availableSizes.map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => handleSizeChange(size)}
                                className={`min-h-10 min-w-10 rounded-xl px-3 text-sm font-black transition-all duration-200 active:scale-95 ${
                                    selectedSize === size
                                        ? 'bg-slate-950 text-white'
                                        : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600">Color <span className="text-rose-600">*</span></label>
                    <div className="flex flex-wrap gap-2">
                        {availableColors.map((color) => (
                            <button
                                key={color.name}
                                type="button"
                                onClick={() => handleColorChange(color)}
                                className={`h-10 w-10 rounded-xl transition-all duration-200 active:scale-95 ${
                                    selectedColor?.name === color.name
                                        ? 'ring-2 ring-slate-950 ring-offset-2'
                                        : 'ring-1 ring-slate-200 hover:ring-slate-300'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                        Selected: {selectedSize || 'Choose size'} / {selectedColor?.name || 'Choose color'}
                    </p>
                </div>
            </div>
            <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
        </>
    );
}
