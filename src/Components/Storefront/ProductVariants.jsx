import { useState } from 'react';
import SizeGuide from './SizeGuide';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Yellow', hex: '#F59E0B' },
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Pink', hex: '#EC4899' },
];

export default function ProductVariants({ onVariantChange }) {
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        onVariantChange?.({ size, color: selectedColor });
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        onVariantChange?.({ size: selectedSize, color });
    };

    return (
        <>
            <div className="space-y-4">
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-600">Size</label>
                        <button
                            type="button"
                            onClick={() => setShowSizeGuide(true)}
                            className="text-xs font-black text-orange-600 hover:text-orange-700"
                        >
                            Size Guide
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {SIZES.map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => handleSizeChange(size)}
                                className={`h-10 w-10 rounded-xl text-sm font-black transition-all duration-200 active:scale-95 ${
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
                    <label className="mb-2 block text-xs font-bold text-slate-600">Color</label>
                    <div className="flex flex-wrap gap-2">
                        {COLORS.map((color) => (
                            <button
                                key={color.name}
                                type="button"
                                onClick={() => handleColorChange(color)}
                                className={`h-10 w-10 rounded-xl transition-all duration-200 active:scale-95 ${
                                    selectedColor.name === color.name
                                        ? 'ring-2 ring-slate-950 ring-offset-2'
                                        : 'ring-1 ring-slate-200 hover:ring-slate-300'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                        Selected: {selectedColor.name}
                    </p>
                </div>
            </div>
            <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
        </>
    );
}
