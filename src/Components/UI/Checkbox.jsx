import { forwardRef } from 'react';

const Checkbox = forwardRef(({ 
    label, 
    error, 
    checked, 
    onChange, 
    className = '', 
    disabled = false,
    required = false,
    ...props 
}, ref) => {
    const baseClasses = 'h-5 w-5 rounded border-2 border-slate-300 bg-white transition-all duration-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const checkedClasses = checked 
        ? 'border-rose-600 bg-rose-600 text-white' 
        : 'border-slate-300 bg-white hover:border-slate-400';

    return (
        <div className="flex items-start gap-3">
            <div className="relative flex items-start">
                <input
                    ref={ref}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className={`peer sr-only`}
                    {...props}
                />
                <div className={`${baseClasses} ${checkedClasses} ${className} flex items-center justify-center`}>
                    {checked && (
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>
            
            {label && (
                <label className="flex-1 text-sm font-semibold text-slate-700 cursor-pointer">
                    {label}
                    {required && <span className="ml-1 text-rose-600">*</span>}
                </label>
            )}
        </div>
    );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
