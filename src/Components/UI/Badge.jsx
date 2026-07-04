import { forwardRef } from 'react';

const badgeVariants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-rose-100 text-rose-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
};

const badgeSizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
};

const Badge = forwardRef(({ 
    children, 
    variant = 'default', 
    size = 'md', 
    className = '',
    rounded = 'rounded-full',
    ...props 
}, ref) => {
    const baseClasses = 'inline-flex items-center font-bold uppercase tracking-wide';
    
    const variantClasses = badgeVariants[variant] || badgeVariants.default;
    const sizeClasses = badgeSizes[size] || badgeSizes.md;

    return (
        <span
            ref={ref}
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${rounded} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
});

Badge.displayName = 'Badge';

export default Badge;
