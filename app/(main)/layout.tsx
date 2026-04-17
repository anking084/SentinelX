import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-[var(--color-dark-bg)] min-h-screen text-slate-200">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0">
        <Topbar />
        <main className="p-8 ml-64 mt-0 min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
