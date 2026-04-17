import { Bell, Search, User } from 'lucide-react';

export function Topbar() {
    return (
        <header className="h-20 ml-64 border-b border-[#1E293B] glass-panel flex items-center justify-between px-8 sticky top-0 z-10 w-[calc(100%-16rem)]">
            <div className="flex items-center w-96 bg-[#131A2A] rounded-lg border border-[#1E293B] px-4 py-2 opacity-60 hover:opacity-100 transition-opacity">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search logs, IPs or users..." 
                    className="bg-transparent border-none outline-none w-full ml-3 text-sm text-white placeholder-slate-500"
                />
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                
                <div className="flex items-center space-x-3 pl-6 border-l border-[#1E293B]">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9D00FF] to-[#00F0FF] flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-slate-400">Security Officer</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
