import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'relevant', label: 'Most Relevant' },
    { value: 'bestseller', label: 'Best Seller' },
    { value: 'newest', label: 'New Arrival' },
    { value: 'price-low', label: 'Price Low → High' },
    { value: 'price-high', label: 'Price High → Low' },
    { value: 'top-rated', label: 'Top Rated' },
];

export default function SortDropdown({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = SORT_OPTIONS.find(opt => opt.value === value) || SORT_OPTIONS[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
            >
                {selectedOption.label}
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-xl">
                    <div className="py-1">
                        {SORT_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-all ${
                                    option.value === value
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                {option.label}
                                {option.value === value && (
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
