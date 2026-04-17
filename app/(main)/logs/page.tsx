import prisma from '@/lib/prisma';
import { List } from 'lucide-react';

export const revalidate = 0;

export default async function LogsPage() {
    const logs = await prisma.loginLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <List className="text-[#00F0FF] w-8 h-8" />
                    <h2 className="text-2xl font-bold glow-text">System Logs</h2>
                </div>
            </div>
            
            <div className="glass-panel rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#131A2A] border-b border-[#1E293B] text-slate-400 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-medium">Data / Hora</th>
                            <th className="px-6 py-4 font-medium">Usuário</th>
                            <th className="px-6 py-4 font-medium">IP</th>
                            <th className="px-6 py-4 font-medium">Score</th>
                            <th className="px-6 py-4 font-medium">Dispositivo</th>
                            <th className="px-6 py-4 font-medium">Status do Evento</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]">
                        {logs.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Nenhum log registrado.</td></tr>
                        )}
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-[#131A2A]/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                                <td className="px-6 py-4 font-medium text-slate-200">{log.emailAttempted}</td>
                                <td className="px-6 py-4 font-mono text-sm text-[#00F0FF]">{log.ipAddress}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        log.riskLevel === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 
                                        log.riskLevel === 'SUSPICIOUS' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                                    }`}>
                                        {log.riskScore}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-300 text-xs hidden md:table-cell">{log.device?.slice(0,30) || 'Unknown'}...</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                        log.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                                        log.status === 'BLOCKED' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                                        'bg-slate-500/10 text-slate-400 border-slate-500/30'
                                    }`}>
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
