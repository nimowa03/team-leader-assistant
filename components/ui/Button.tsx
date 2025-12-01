import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    disabled,
    fullWidth,
    ...props
}: ButtonProps) {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
        secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
        outline: 'bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg',
        md: 'px-5 py-2.5 text-sm rounded-xl',
        lg: 'px-8 py-4 text-base rounded-2xl font-semibold',
    };

    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
}
