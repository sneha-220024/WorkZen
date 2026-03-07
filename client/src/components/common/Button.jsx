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
            disabled={disabled}
            onClick={onClick}
            className={`${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? variants.primary} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
