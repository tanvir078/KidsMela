import { forwardRef } from 'react';

const Toggle = forwardRef(({ 
    label, 
    checked, 
    onChange, 
    className = '', 
    disabled = false,
    size = 'md',
    ...props 
}, ref) => {
    const sizes = {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-13',
    };

    const thumbSizes = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    const baseClasses = 'relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const checkedClasses = checked 
        ? 'bg-rose-600' 
        : 'bg-slate-300';

    const thumbClasses = checked 
        ? 'translate-x-full bg-white' 
        : 'translate-x-0 bg-white';

    return (
        <div className="flex items-center gap-3">
            <button
                ref={ref}
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`${baseClasses} ${sizes[size]} ${checkedClasses} ${className}`}
                {...props}
            >
                <span className={`inline-block rounded-full shadow-md transition-transform duration-300 ${thumbSizes[size]} ${thumbClasses}`} />
            </button>
            
            {label && (
                <label className="text-sm font-semibold text-slate-700 cursor-pointer">
                    {label}
                </label>
            )}
        </div>
    );
});

Toggle.displayName = 'Toggle';

export default Toggle;
