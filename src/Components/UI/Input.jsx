import { forwardRef } from 'react';

const inputVariants = {
    default: 'border-slate-200 focus:border-rose-500 focus:ring-rose-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500',
};

const inputSizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-13 px-5 text-base',
};

const Input = forwardRef(({ 
    label, 
    error, 
    helperText, 
    variant = 'default', 
    size = 'md', 
    className = '', 
    disabled = false,
    required = false,
    ...props 
}, ref) => {
    const baseClasses = 'w-full rounded-2xl border-2 bg-white px-4 py-3 text-sm font-semibold outline-none transition-all duration-300 focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = inputVariants[variant] || inputVariants.default;
    const sizeClasses = inputSizes[size] || inputSizes.md;
    const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-xs font-bold text-slate-600">
                    {label}
                    {required && <span className="ml-1 text-rose-600">*</span>}
                </label>
            )}
            <input
                ref={ref}
                disabled={disabled}
                className={`${baseClasses} ${variantClasses} ${sizeClasses} ${errorClasses} ${className}`}
                {...props}
            />
            {helperText && !error && (
                <p className="text-xs font-semibold text-slate-500">{helperText}</p>
            )}
            {error && (
                <p className="text-xs font-bold text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
