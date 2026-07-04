import { forwardRef } from 'react';

const RadioGroup = forwardRef(({ 
    label, 
    error, 
    options = [], 
    name,
    value,
    onChange,
    className = '', 
    disabled = false,
    required = false,
    ...props 
}, ref) => {
    const baseClasses = 'h-5 w-5 rounded-full border-2 border-slate-300 bg-white transition-all duration-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-xs font-bold text-slate-600">
                    {label}
                    {required && <span className="ml-1 text-rose-600">*</span>}
                </label>
            )}
            
            <div className="space-y-2">
                {options.map((option) => (
                    <div key={option.value} className="flex items-center gap-3">
                        <div className="relative flex items-center">
                            <input
                                ref={ref}
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={onChange}
                                disabled={disabled || option.disabled}
                                className="peer sr-only"
                                {...props}
                            />
                            <div className={`${baseClasses} ${value === option.value ? 'border-rose-600 bg-rose-600' : 'border-slate-300 bg-white hover:border-slate-400'} flex items-center justify-center`}>
                                {value === option.value && (
                                    <div className="h-2 w-2 rounded-full bg-white" />
                                )}
                            </div>
                        </div>
                        
                        <label className="text-sm font-semibold text-slate-700 cursor-pointer">
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
            
            {error && (
                <p className="text-xs font-bold text-red-600">{error}</p>
            )}
        </div>
    );
});

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
