import { clsx } from 'clsx';
import { MemberStatus } from '@/lib/types';

interface StatusBadgeProps {
    status: MemberStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const isAlive = status === 'ALIVE';

    return (
        <span
            className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                isAlive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            )}
        >
            {isAlive ? '조원' : '탈락'}
        </span>
    );
}
