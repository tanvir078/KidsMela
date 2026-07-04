import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function SidebarFilters({ 
    categories = [], 
    brands = [], 
    tags = [],
    selectedCategory,
    selectedBrands,
    selectedTags,
    priceRange,
    onCategoryChange,
    onBrandChange,
    onTagChange,
    onPriceChange
}) {
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        brand: true,
        price: true,
        tag: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const toggleBrand = (brandId) => {
        const newBrands = selectedBrands.includes(brandId)
            ? selectedBrands.filter(id => id !== brandId)
            : [...selectedBrands, brandId];
        onBrandChange(newBrands);
    };

    const toggleTag = (tagId) => {
        const newTags = selectedTags.includes(tagId)
            ? selectedTags.filter(id => id !== tagId)
            : [...selectedTags, tagId];
        onTagChange(newTags);
    };

    return (
        <div className="w-64 space-y-3">
            {/* Category Filter */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <button
                    onClick={() => toggleSection('category')}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-black text-slate-900 transition-colors hover:bg-slate-50"
                >
                    <span>Category</span>
                    {expandedSections.category ? <ChevronDown className="h-4 w-4 text-slate-500 transition-transform" /> : <ChevronRight className="h-4 w-4 text-slate-500 transition-transform" />}
                </button>
                {expandedSections.category && (
                    <div className="border-t border-slate-100 px-4 py-3">
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <label key={category.id} className="group flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-slate-50">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === category.id}
                                        onChange={() => onCategoryChange(category.id)}
                                        className="h-4 w-4 rounded-full border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{category.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Price Range Filter */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <button
                    onClick={() => toggleSection('price')}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-black text-slate-900 transition-colors hover:bg-slate-50"
                >
                    <span>Price Range</span>
                    {expandedSections.price ? <ChevronDown className="h-4 w-4 text-slate-500 transition-transform" /> : <ChevronRight className="h-4 w-4 text-slate-500 transition-transform" />}
                </button>
                {expandedSections.price && (
                    <div className="border-t border-slate-100 px-4 py-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
                                    className="h-10 w-full rounded-lg border-slate-200 pl-8 pr-3 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500 focus:ring-offset-0 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
                                    className="h-10 w-full rounded-lg border-slate-200 pl-8 pr-3 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500 focus:ring-offset-0 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Brand Filter */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <button
                    onClick={() => toggleSection('brand')}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-black text-slate-900 transition-colors hover:bg-slate-50"
                >
                    <span>Brand</span>
                    {expandedSections.brand ? <ChevronDown className="h-4 w-4 text-slate-500 transition-transform" /> : <ChevronRight className="h-4 w-4 text-slate-500 transition-transform" />}
                </button>
                {expandedSections.brand && (
                    <div className="border-t border-slate-100 px-4 py-3 max-h-64 overflow-y-auto custom-scrollbar">
                        <div className="space-y-1">
                            {brands.map((brand) => (
                                <label key={brand.id} className="group flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-slate-50">
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(brand.id)}
                                        onChange={() => toggleBrand(brand.id)}
                                        className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500 focus:ring-offset-0 transition-all"
                                    />
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{brand.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Tag Filter */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <button
                    onClick={() => toggleSection('tag')}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-black text-slate-900 transition-colors hover:bg-slate-50"
                >
                    <span>Tags</span>
                    {expandedSections.tag ? <ChevronDown className="h-4 w-4 text-slate-500 transition-transform" /> : <ChevronRight className="h-4 w-4 text-slate-500 transition-transform" />}
                </button>
                {expandedSections.tag && (
                    <div className="border-t border-slate-100 px-4 py-3 max-h-64 overflow-y-auto custom-scrollbar">
                        <div className="space-y-1">
                            {tags.map((tag) => (
                                <label key={tag.id} className="group flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-slate-50">
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag.id)}
                                        onChange={() => toggleTag(tag.id)}
                                        className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500 focus:ring-offset-0 transition-all"
                                    />
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{tag.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
