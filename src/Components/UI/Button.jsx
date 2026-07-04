import { forwardRef } from 'react';

const buttonVariants = {
    primary: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    outline: 'border-2 border-rose-600 text-rose-600 hover:bg-rose-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200',
};

const buttonSizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-sm',
    lg: 'h-13 px-8 text-base',
    xl: 'h-14 px-10 text-lg',
};

const Button = forwardRef(({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    disabled = false,
    loading = false,
    ...props 
}, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-2xl font-black transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';
    
    const variantClasses = buttonVariants[variant] || buttonVariants.primary;
    const sizeClasses = buttonSizes[size] || buttonSizes.md;

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
