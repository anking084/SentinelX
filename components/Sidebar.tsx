'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, AlertTriangle, List, Settings, LogOut } from 'lucide-react';

export function Sidebar() {
    const pathname = usePathname();

    const menu = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Investigações', path: '/admin', icon: AlertTriangle },
        { name: 'Logs de Acesso', path: '/logs', icon: List },
        { name: 'Ataque Simulado', path: '/simulator', icon: Settings },
    ];

    return (
        <aside className="w-64 h-screen border-r border-[#1E293B] glass-panel fixed left-0 top-0 flex flex-col">
            <div className="p-6 flex items-center space-x-3 border-b border-[#1E293B]">
                <Shield className="text-[#00F0FF] w-8 h-8" />
                <h1 className="text-xl font-bold text-white tracking-wider glow-text">SentinelX</h1>
            </div>
            
            <nav className="flex-1 py-6 px-4 space-y-2">
                {menu.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link key={item.path} href={item.path} 
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                isActive ? 'bg-[#1E293B] text-[#00F0FF] border-l-4 border-[#00F0FF]' : 'text-slate-400 hover:bg-[#131A2A] hover:text-white'
                            }`}>
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-[#1E293B]">
                <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
