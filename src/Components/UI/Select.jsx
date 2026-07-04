import { forwardRef } from 'react';

const Select = forwardRef(({ 
    label, 
    error, 
    helperText, 
    options = [], 
    placeholder = 'Select an option',
    className = '', 
    disabled = false,
    required = false,
    ...props 
}, ref) => {
    const baseClasses = 'w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition-all duration-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-xs font-bold text-slate-600">
                    {label}
                    {required && <span className="ml-1 text-rose-600">*</span>}
                </label>
            )}
            <select
                ref={ref}
                disabled={disabled}
                className={`${baseClasses} ${errorClasses} ${className}`}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option 
                        key={option.value} 
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {helperText && !error && (
                <p className="text-xs font-semibold text-slate-500">{helperText}</p>
            )}
            {error && (
                <p className="text-xs font-bold text-red-600">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
