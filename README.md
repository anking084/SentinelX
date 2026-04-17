# 🛡️ SentinelX

![SentinelX Banner](https://img.shields.io/badge/SentinelX-SOC_Dashboard-00F0FF?style=for-the-badge&logo=shield&labelColor=131A2A)

**SentinelX** é um painel de Security Operations Center (SOC) moderno e focado na detecção de tráfego de autenticação suspeito e gerenciamento de ameaças. O objetivo do sistema é fornecer uma interface "Glassmorphism Dark Mode" premium para monitorar acessos e interceptar padrões de ataque, como o Brute Force, em tempo real.

---

## 🔥 Funcionalidades Principais

- **🔒 Autenticação Robusta**: Registro e Login de usuários, senhas criptografadas (Bcrypt) e tokens de acesso (JWT).
- **🧠 Risk Score Engine**: Toda tentativa de login recebe uma "Pontuação de Risco" com base na reputação do IP, número de erros recentes e horário do acesso. 
- **🛑 Detecção de Ameaças**: O algoritmo nativo detecta ataques de _Brute Force_ bloqueando temporariamente o acesso e escalando um Alerta Crítico para análise dos administradores.
- **⚡ Simulador Nativo**: O painel de Autenticação contém um simulador de ataque integrado, disparando múltiplas requisições sequenciais para que você possa visualizar e combater ameaças geradas dinamicamente.
- **📊 Dashboard Responsivo**: Interface com métricas e gráficos usando _Recharts_, organizados por uma estética premium e minimalista.

---

## 🛠️ Stack Tecnológico

1. **Frontend**: [Next.js 15 (App Router)](https://nextjs.org/) + [React](https://react.dev/) + [TailwindCSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
2. **Backend**: API Routes (Next.js) operando na arquitetura *Server-Side* + [Prisma ORM](https://www.prisma.io/).
3. **Database**: [SQLite](https://www.sqlite.org/index.html) *(Leve, rápido e encapsulado)*.
4. **Segurança**: BcryptJS + JSONWebToken

---

## 🚀 Como instalar e executar

Siga as instruções abaixo para rodar o **SentinelX** livremente em sua máquina local.

**1. Clone o Repositório**
```bash
git clone https://github.com/anking084/SentinelX.git
cd SentinelX
```

**2. Instale as Dependências**
```bash
npm install
```

**3. Configure as Variáveis de Ambiente (Opcional)**
Crie um arquivo `.env` e declare o endereço do banco de dados e segredos JWT:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta"
REFRESH_SECRET="sua_chave_refresh"
```

**4. Sincronize o Banco de Dados (Prisma)**
```bash
npx prisma generate
npx prisma db push
```

**5. Inicie o Servidor de Desenvolvimento**
```bash
npm run dev
```

Abra `http://localhost:3000` em seu navegador para ter acesso à tela de autenticação!

---

## 📸 Overview de Uso

1. Tente realizar login com informações inválidas.
2. Na página principal, utilize o botão **Simular Ataque Brute Force**.
3. Logue corretamente, e como o Admininistrador, observe que no menu **Investigações** as ocorrências foram marcadas como *CRITICAL* prontas para serem avaliadas pela equipe do SOC! 

## 📝 Licença
Desenvolvido para fins de demonstração e estudo (Portfólio). Código aberto.
