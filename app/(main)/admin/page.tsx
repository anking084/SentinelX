import prisma from '@/lib/prisma';
import { AlertTriangle, CheckCircle, ShieldOff } from 'lucide-react';

export const revalidate = 0;

export default async function AdminPage() {
    const suspiciousLogs = await prisma.loginLog.findMany({
        where: {
            riskLevel: { in: ['SUSPICIOUS', 'CRITICAL'] },
        },
        orderBy: { riskScore: 'desc' },
        take: 50
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <AlertTriangle className="text-[#F59E0B] w-8 h-8" />
                <h2 className="text-2xl font-bold glow-text">Admin & Investigations</h2>
            </div>
            
            <div className="glass-panel rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#131A2A] border-b border-[#1E293B] text-slate-400 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-medium">Conta Alvo</th>
                            <th className="px-6 py-4 font-medium">IP Origem</th>
                            <th className="px-6 py-4 font-medium">Localização</th>
                            <th className="px-6 py-4 font-medium">Risk Score</th>
                            <th className="px-6 py-4 font-medium">Status / Data</th>
                            <th className="px-6 py-4 font-medium">Ações Manuais</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]">
                        {suspiciousLogs.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Nenhum alerta pendente no momento.</td></tr>
                        )}
                        {suspiciousLogs.map(log => (
                            <tr key={log.id} className="hover:bg-[#131A2A]/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200">{log.emailAttempted}</td>
                                <td className="px-6 py-4 font-mono text-sm text-[#00F0FF]">{log.ipAddress}</td>
                                <td className="px-6 py-4 text-slate-300 text-sm">{log.location || 'Unknown'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                        log.riskLevel === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                                    }`}>
                                        {log.riskScore} PTS - {log.riskLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    {log.status}<br/>
                                    <span className="text-xs">{new Date(log.createdAt).toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition" title="Aprovar Login">
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition" title="Bloquear Usuário / IP">
                                            <ShieldOff className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
