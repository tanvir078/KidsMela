import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

export default function MobileFilterSheet({ isOpen, onClose, filters, onFilterChange, onApply, onReset }) {
    const { categories, priceRange, colors, tags, brands, selectedFilters } = filters;
    const [expandedSections, setExpandedSections] = useState({});

    const sheetVariants = {
        hidden: { x: '-100%' },
        visible: { x: 0 },
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleCategoryToggle = (categoryId) => {
        const newCategories = selectedFilters.categories.includes(categoryId)
            ? selectedFilters.categories.filter(id => id !== categoryId)
            : [...selectedFilters.categories, categoryId];
        onFilterChange({ ...selectedFilters, categories: newCategories });
    };

    const handleColorToggle = (color) => {
        const newColors = selectedFilters.colors.includes(color)
            ? selectedFilters.colors.filter(c => c !== color)
            : [...selectedFilters.colors, color];
        onFilterChange({ ...selectedFilters, colors: newColors });
    };

    const handleTagToggle = (tag) => {
        const newTags = selectedFilters.tags.includes(tag)
            ? selectedFilters.tags.filter(t => t !== tag)
            : [...selectedFilters.tags, tag];
        onFilterChange({ ...selectedFilters, tags: newTags });
    };

    const handleBrandToggle = (brand) => {
        const newBrands = selectedFilters.brands.includes(brand)
            ? selectedFilters.brands.filter(b => b !== brand)
            : [...selectedFilters.brands, brand];
        onFilterChange({ ...selectedFilters, brands: newBrands });
    };

    const handlePriceChange = (min, max) => {
        onFilterChange({ ...selectedFilters, priceRange: { min, max } });
    };

    const selectedCount = 
        selectedFilters.categories.length +
        selectedFilters.colors.length +
        selectedFilters.tags.length +
        selectedFilters.brands.length +
        (selectedFilters.priceRange.min !== priceRange.min || selectedFilters.priceRange.max !== priceRange.max ? 1 : 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
                        style={{ backdropFilter: 'blur(4px)' }}
                    />

                    {/* Filter Sheet */}
                    <motion.div
                        variants={sheetVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed left-0 top-0 z-50 h-screen w-[85vw] max-w-[380px] bg-white shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                            <button
                                onClick={onClose}
                                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-slate-200"
                                aria-label="Back"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <div className="text-center">
                                <h2 className="text-lg font-bold text-slate-900">Filter</h2>
                                {selectedCount > 0 && (
                                    <p className="text-sm text-slate-500">{selectedCount} selected</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-slate-200"
                                aria-label="Close filter"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Filter Content */}
                        <div className="h-[calc(100vh-180px)] overflow-y-auto px-4 py-4">
                            {/* Categories Accordion */}
                            {categories && categories.length > 0 && (
                                <div className="mb-4 border-b border-slate-100">
                                    <button
                                        onClick={() => toggleSection('categories')}
                                        className="flex w-full items-center justify-between py-3"
                                    >
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Categories</h3>
                                        <ChevronDown
                                            className={`h-5 w-5 text-slate-400 transition-transform ${
                                                expandedSections.categories ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {expandedSections.categories && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="pb-3 space-y-2"
                                            >
                                                {categories.map((category) => (
                                                    <label key={category.id} className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFilters.categories.includes(category.id)}
                                                            onChange={() => handleCategoryToggle(category.id)}
                                                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                                        />
                                                        <span className="text-sm font-medium text-slate-700">{category.name}</span>
                                                    </label>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Price Range Accordion */}
                            {priceRange && (
                                <div className="mb-4 border-b border-slate-100">
                                    <button
                                        onClick={() => toggleSection('price')}
                                        className="flex w-full items-center justify-between py-3"
                                    >
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Price</h3>
                                        <ChevronDown
                                            className={`h-5 w-5 text-slate-400 transition-transform ${
                                                expandedSections.price ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {expandedSections.price && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="pb-3 space-y-4"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <label className="mb-1 block text-xs font-medium text-slate-500">Min</label>
                                                        <input
                                                            type="number"
                                                            value={selectedFilters.priceRange.min}
                                                            onChange={(e) => handlePriceChange(Number(e.target.value), selectedFilters.priceRange.max)}
                                                            min={priceRange.min}
                                                            max={priceRange.max}
                                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                                        />
                                                    </div>
                                                    <span className="text-slate-400">—</span>
                                                    <div className="flex-1">
                                                        <label className="mb-1 block text-xs font-medium text-slate-500">Max</label>
                                                        <input
                                                            type="number"
                                                            value={selectedFilters.priceRange.max}
                                                            onChange={(e) => handlePriceChange(selectedFilters.priceRange.min, Number(e.target.value))}
                                                            min={priceRange.min}
                                                            max={priceRange.max}
                                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Colors Accordion */}
                            {colors && colors.length > 0 && (
                                <div className="mb-4 border-b border-slate-100">
                                    <button
                                        onClick={() => toggleSection('colors')}
                                        className="flex w-full items-center justify-between py-3"
                                    >
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Color</h3>
                                        <ChevronDown
                                            className={`h-5 w-5 text-slate-400 transition-transform ${
                                                expandedSections.colors ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {expandedSections.colors && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="pb-3"
                                            >
                                                <div className="flex flex-wrap gap-3">
                                                    {colors.map((color) => (
                                                        <button
                                                            key={color}
                                                            onClick={() => handleColorToggle(color)}
                                                            className={`h-8 w-8 rounded-full border-2 transition-all ${
                                                                selectedFilters.colors.includes(color)
                                                                    ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2'
                                                                    : 'border-slate-200 hover:border-slate-400'
                                                            }`}
                                                            style={{ backgroundColor: color }}
                                                            title={color}
                                                            aria-label={`Filter by ${color}`}
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Tags Accordion */}
                            {tags && tags.length > 0 && (
                                <div className="mb-4 border-b border-slate-100">
                                    <button
                                        onClick={() => toggleSection('tags')}
                                        className="flex w-full items-center justify-between py-3"
                                    >
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Tags</h3>
                                        <ChevronDown
                                            className={`h-5 w-5 text-slate-400 transition-transform ${
                                                expandedSections.tags ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {expandedSections.tags && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="pb-3"
                                            >
                                                <div className="flex flex-wrap gap-2">
                                                    {tags.map((tag) => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => handleTagToggle(tag)}
                                                            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                                                                selectedFilters.tags.includes(tag)
                                                                    ? 'bg-slate-900 text-white'
                                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Brands Accordion */}
                            {brands && brands.length > 0 && (
                                <div className="mb-4 border-b border-slate-100">
                                    <button
                                        onClick={() => toggleSection('brands')}
                                        className="flex w-full items-center justify-between py-3"
                                    >
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Brand</h3>
                                        <ChevronDown
                                            className={`h-5 w-5 text-slate-400 transition-transform ${
                                                expandedSections.brands ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {expandedSections.brands && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="pb-3"
                                            >
                                                <div className="flex flex-wrap gap-2">
                                                    {brands.map((brand) => (
                                                        <button
                                                            key={brand}
                                                            onClick={() => handleBrandToggle(brand)}
                                                            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                                                                selectedFilters.brands.includes(brand)
                                                                    ? 'bg-slate-900 text-white'
                                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            {brand}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 py-4">
                            <div className="flex gap-3">
                                <button
                                    onClick={onReset}
                                    className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={onApply}
                                    className="flex-1 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
