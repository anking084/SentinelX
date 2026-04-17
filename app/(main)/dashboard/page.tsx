import prisma from '@/lib/prisma';
import { ShieldAlert, Fingerprint, Activity, Clock } from 'lucide-react';
import { DashboardChart } from '@/components/DashboardChart';

export const revalidate = 0; // Disable cache to always show latest info

export default async function Dashboard() {
  const [totalLogins, failedLogins, activeAlerts, recentLogs] = await Promise.all([
    prisma.loginLog.count(),
    prisma.loginLog.count({ where: { status: 'FAILED' } }),
    prisma.securityAlert.count({ where: { resolved: false } }),
    prisma.loginLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
  ]);

  // Mock data for chart if the DB is empty (just for visual purposes on a fresh portfolio project)
  const chartData = [
    { name: '00:00', logins: 12, falhas: 2 },
    { name: '04:00', logins: 8, falhas: 1 },
    { name: '08:00', logins: 45, falhas: 8 },
    { name: '12:00', logins: 78, falhas: 14 },
    { name: '16:00', logins: 56, falhas: 5 },
    { name: '20:00', logins: (totalLogins > 0 ? totalLogins : 23), falhas: (failedLogins > 0 ? failedLogins : 3) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold glow-text">Security Overview</h2>
        <div className="text-sm text-slate-400 bg-[#131A2A] px-3 py-1 rounded-full border border-[#1E293B]">
          Live Monitoring
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Fingerprint className="w-8 h-8 text-[#00F0FF]" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Logins</p>
            <p className="text-2xl font-bold text-white">{totalLogins}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl flex items-center space-x-4 border-t-2 border-t-red-500/50">
          <div className="p-3 bg-red-500/10 rounded-lg">
            <Activity className="w-8 h-8 text-[#EF4444]" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Failed Attempts</p>
            <p className="text-2xl font-bold text-white">{failedLogins}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl flex items-center space-x-4 border-t-2 border-t-yellow-500/50">
          <div className="p-3 bg-yellow-500/10 rounded-lg">
            <ShieldAlert className="w-8 h-8 text-[#F59E0B]" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Active Threats</p>
            <p className="text-2xl font-bold text-white">{activeAlerts}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-2">Activity Chart</h3>
          <DashboardChart data={chartData} />
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Access</h3>
          <div className="space-y-4">
            {recentLogs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No recent logs</p>
            ) : (
                recentLogs.map(log => (
                    <div key={log.id} className="flex items-start justify-between p-3 rounded-lg bg-[#0B0F19] border border-[#1E293B]">
                        <div>
                            <p className="text-sm font-medium text-slate-200">{log.emailAttempted}</p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center"><Clock className="w-3 h-3 mr-1"/> {new Date(log.createdAt).toLocaleTimeString()} - {log.ipAddress}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                            log.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                            log.riskLevel === 'SUSPICIOUS' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                        }`}>
                            {log.riskScore}
                        </span>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
