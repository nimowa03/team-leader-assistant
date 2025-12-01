'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CheckSquare, Settings, LayoutGrid } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
    { href: '/', label: '대시보드', icon: LayoutGrid },
    { href: '/meeting', label: '모임 관리', icon: Users },
    { href: '/assignment', label: '과제 관리', icon: CheckSquare },
    { href: '/settings', label: '설정', icon: Settings },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 md:relative md:border-t-0 md:border-r md:w-72 md:h-screen md:flex-col z-50 transition-all">
            <div className="flex justify-around md:flex-col md:justify-start md:h-full md:p-6">
                <div className="hidden md:block mb-10 px-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Team Leader</h1>
                    </div>
                    <p className="text-xs text-slate-500 font-medium pl-1">Smart Assistant for Captains</p>
                </div>

                <div className="flex md:flex-col w-full gap-1 md:gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex flex-col items-center p-2 md:flex-row md:px-4 md:py-3.5 md:rounded-xl transition-all duration-200 group relative overflow-hidden',
                                    isActive
                                        ? 'text-indigo-600 md:bg-indigo-50/80 md:shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full hidden md:block" />
                                )}
                                <Icon className={clsx(
                                    "w-6 h-6 md:w-5 md:h-5 md:mr-3 transition-transform duration-200",
                                    isActive ? "scale-110" : "group-hover:scale-110"
                                )} />
                                <span className={clsx(
                                    "text-[10px] md:text-sm font-semibold",
                                    isActive ? "text-indigo-700" : "text-slate-500 group-hover:text-slate-700"
                                )}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="hidden md:block mt-auto px-4 py-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200">
                        <p className="text-xs font-medium opacity-80 mb-1">Pro Tip</p>
                        <p className="text-sm font-bold leading-snug">회의록은 키워드만<br />입력하세요!</p>
                    </div>
                </div>
            </div>
        </nav>
    );
}
