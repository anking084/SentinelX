'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardChart({ data }: { data: any[] }) {
  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#131A2A', borderColor: '#1E293B', color: '#fff' }}
            itemStyle={{ color: '#00F0FF' }}
          />
          <Line type="monotone" dataKey="logins" stroke="#00F0FF" strokeWidth={3} dot={{ r: 4, fill: '#0B0F19', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#00F0FF' }} />
          <Line type="monotone" dataKey="falhas" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, fill: '#0B0F19', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
