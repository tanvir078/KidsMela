import { forwardRef } from 'react';

const cardVariants = {
    default: 'bg-white shadow-sm ring-1 ring-slate-200',
    elevated: 'bg-white shadow-lg ring-1 ring-slate-200',
    outlined: 'bg-white ring-2 ring-slate-200',
    filled: 'bg-slate-50',
};

const Card = forwardRef(({ 
    children, 
    variant = 'default', 
    className = '', 
    padding = 'p-4',
    hoverable = false,
    ...props 
}, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-300';
    
    const variantClasses = cardVariants[variant] || cardVariants.default;
    const hoverClasses = hoverable ? 'hover:shadow-xl hover:ring-rose-200 hover:scale-[1.02] cursor-pointer' : '';

    return (
        <div
            ref={ref}
            className={`${baseClasses} ${variantClasses} ${padding} ${hoverClasses} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

export default Card;
