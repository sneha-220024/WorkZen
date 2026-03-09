import React from 'react';

/**
 * Reusable Button component.
 * @param {'primary'|'outline'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    loading = false,
    ...props
}) {
    const base =
        'inline-flex items-center justify-center gap-2 font-inter font-semibold rounded-[10px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    const variants = {
        primary:
            'bg-primary text-white hover:bg-primary-dark active:scale-95 focus:ring-primary shadow-md hover:shadow-lg',
        outline:
            'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary',
        ghost:
            'bg-transparent text-text-secondary hover:text-primary hover:bg-primary/5 focus:ring-primary',
        secondary:
            'bg-secondary text-white hover:bg-secondary-dark active:scale-95 focus:ring-secondary shadow-md',
        accent:
            'bg-accent text-white hover:bg-purple-700 active:scale-95 focus:ring-accent shadow-md',
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? variants.primary} ${className}`}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}
