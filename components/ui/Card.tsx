import { clsx } from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
    noPadding?: boolean;
    style?: React.CSSProperties;
}

export function Card({ children, className, title, action, noPadding = false, style }: CardProps) {
    return (
        <div className={clsx('bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md', className)} style={style}>
            {(title || action) && (
                <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-white">
                    {title && <h3 className="font-bold text-lg text-slate-800 tracking-tight">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={noPadding ? '' : 'p-6'}>{children}</div>
        </div>
    );
}
