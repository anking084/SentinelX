'use client';
import { useState } from 'react';
import { Shield, Lock, Mail, AlertCircle, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login' ? { email, password } : { name: 'Admin User', email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Autenticação falhou');
      } else {
        if(mode === 'login') {
             router.push('/dashboard');
        } else {
            setMode('login');
            setError('Conta criada! Faça login.');
        }
      }
    } catch (err) {
      setError('Erro de conexão com o servidor de segurança.');
    } finally {
      setLoading(false);
    }
  };

  const runBruteForceSimulator = async () => {
    if (!email) {
        setError('Preencha um email alvo para o simulador.');
        return;
    }
    setError('Iniciando ataque simulado de Brute Force...');
    for (let i = 0; i < 6; i++) {
        await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'random_wrong_password_' + i })
        });
        await new Promise(r => setTimeout(r, 600));
    }
    setError('Simulação de Brute Force concluída. Verifique o dashboard.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)] bg-[url('/bg-pattern.svg')] relative overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#9D00FF] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-[#00F0FF] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md p-8 glass-panel rounded-2xl relative z-10 border border-[#1E293B]">
        <div className="flex flex-col items-center mb-8">
            <Shield className="w-12 h-12 text-[#00F0FF] mb-4 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
            <h1 className="text-3xl font-bold text-white tracking-widest glow-text">SentinelX</h1>
            <p className="text-slate-400 mt-2 text-sm text-center">Security Operations Center Authentication</p>
        </div>

        {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email / Identifier</label>
                <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#1E293B] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all"
                        placeholder="admin@sentinelx.io"
                    />
                </div>
            </div>

            <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Access Token (Password)</label>
                <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#1E293B] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#00F0FF] to-[#9D00FF] hover:from-[#00F0FF] hover:to-[#00F0FF] text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]"
            >
                {loading ? 'AUTHENTICATING...' : mode === 'login' ? 'SECURE LOGIN' : 'CREATE ACCOUNT'}
            </button>
        </form>

        <div className="mt-6 flex flex-col space-y-4">
           <button 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-xs text-slate-400 hover:text-white transition-colors text-center"
            >
                {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
            <div className="h-px w-full bg-[#1E293B]"></div>
             <button 
                onClick={runBruteForceSimulator}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 text-sm text-yellow-500 hover:text-yellow-400 py-2 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/10 transition-colors"
                title="Apenas para testes internos do SOC"
            >
                <Zap className="w-4 h-4" />
                <span>Simular Ataque Brute Force</span>
            </button>
        </div>
      </div>
    </div>
  )
}
