# 🌐 HTML ESTÁTICO - NOVO FRONTEND

## O QUE FOI CRIADO

O sistema foi convertido para usar **HTML + JavaScript puro** em vez de Next.js. Tudo é servido pelo backend Express.

```
Nova estrutura:
/workspaces/vamos/
├── public/
│   ├── index.html    ⭐ PÁGINA PRINCIPAL (interface completa)
│   └── app.js        ⭐ LÓGICA DO FRONTEND (puxa do backend)
└── backend/
    └── src/
        ├── index.js  ✅ ATUALIZADO (agora serve public/)
        └── ...
```

---

## ✨ COMO FUNCIONA

### 1️⃣ **Backend Fornece Tudo**

```javascript
// backend/src/index.js
app.use(express.static(path.join(__dirname, '...', 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '...', 'public', 'index.html'));
});
```

- Backend em **localhost:3001** serve:
  - HTML em `/`
  - API em `/api/*`
  - Webhooks em `/webhooks/*`

### 2️⃣ **Frontend Puro (HTML + JS)**

- `index.html` - Interface visual (sem build, totalmente estático)
- `app.js` - Lógica que conecta ao backend

### 3️⃣ **Fluxo de Funcionamento**

```
Usuário acessa → localhost:3001
    ↓
Backend serve → public/index.html
    ↓
HTML carrega → public/app.js
    ↓
app.js faz fetch → http://localhost:3001/api/*
    ↓
Backend retorna dados → app.js processa
    ↓
Interface atualiza em tempo real
```

---

## 🚀 COMO RODAR

### Opção 1: Backend Só (Recomendado)

```bash
cd /workspaces/vamos/backend

# Terminal 1: Rodar backend
npm run dev

# Pronto! Acesse:
# http://localhost:3001
```

**Tudo funciona em um único serviço!**

### Opção 2: Ainda usar Next.js (Frontend Separado)

Se preferir manter o frontend Next.js rodando em paralelo:

```bash
# Terminal 1: Backend
cd /workspaces/vamos/backend
npm run dev
# http://localhost:3001

# Terminal 2: Frontend Next.js (opcional)
cd /workspaces/vamos/frontend
npm run dev
# http://localhost:3000
```

---

## 📋 FUNCIONALIDADES

### ✅ Implementado (HTML)

- [x] Login/Registro com validação
- [x] Agendar serviços
- [x] Cálculo dinâmico de preços
- [x] Pagar com cartão
- [x] Ver meus agendamentos
- [x] Avaliar serviços (5⭐)
- [x] Ver programa de fidelidade
- [x] Bônus de R$ 100 automático

### 🔌 Conectado com Backend

```javascript
// Exemplos de chamadas à API

// Login
POST /api/auth/login
├─ email, password

// Criar agendamento
POST /api/bookings
├─ serviceId, date, time, durationHours, address, phone
├─ hasStaff, hasExtraQuarter, isPostWork

// Buscar agendamentos
GET /api/bookings/:userId
├─ Authorization: Bearer token

// Avaliar
POST /api/reviews
├─ bookingId, rating, review

// Ver fidelidade
GET /api/loyalty
├─ Authorization: Bearer token
```

---

## 📊 ARQUITETURA SIMPLIFICADA

```
┌─────────────────────────────────────┐
│        Navegador (Browser)          │
│  ┌─────────────────────────────────┐│
│  │      HTML + JavaScript Puro      ││
│  │   (index.html + app.js)          ││
│  └─────────────────────────────────┘│
└──────────────┬──────────────────────┘
               │ fetch() chamadas
               │ (CORS habilitado)
┌──────────────▼──────────────────────┐
│      Backend Express                 │
│  ┌─────────────────────────────────┐│
│  │   Routes (/api/*, /webhooks/*) │ ││
│  │   Controllers & Services        ││
│  │   Database (PostgreSQL/SQLite)  ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 🔐 SEGURANÇA

```javascript
// Token JWT no localStorage
const authToken = localStorage.getItem('authToken');

// Enviado em cada requisição
const response = await fetch(API_URL, {
  headers: {
    'Authorization': `Bearer ${authToken}`
  }
});
```

---

## 🎨 LAYOUT

### Página Principal
```
┌────────────────────────────────────┐
│  ✨ Leidy Cleaner  |  Login        │
├──────────────────────────────────────┤
│ Menu      │  Bem-vindo ao Leidy     │
│ ├─ Início │  - Como funciona       │
│ ├─ Agendar│  - Nossos preços        │
│ ├─ Meus.. │  - Comece Agora →       │
│ ├─ Fid..  │                         │
│ └─ Admin  │                         │
└──────────────────────────────────────┘
```

### Página de Agendamento
```
┌────────────────────────────────────┐
│ 📅 Agendar Serviço                 │
├────────────────────────────────────┤
│ Serviço: [Dropdown]                │
│ Data: [______] Horário: [__:__]    │
│ Duração: [Dropdown]                │
│ ☐ Com Funcionária (+40%)           │
│ ☐ Quarto do Trabalho (+25%)        │
│ ☐ Pós-Obra (×1.5)                  │
│ Endereço: [______________]         │
│ Telefone: [______________]         │
│ Observações: [___________]         │
│                                    │
│ Preço Base:        R$ 40,00        │
│ Tax Funcionária:   R$ 16,00        │
│ ──────────────────────────         │
│ TOTAL:             R$ 56,00        │
│                                    │
│ [Agendar e Pagar] [Cancelar]       │
└────────────────────────────────────┘
```

### Modal de Pagamento
```
┌────────────────────────────────────┐
│           Pagamento                │
├────────────────────────────────────┤
│ Total a Pagar: R$ 56,00            │
│                                    │
│ Número do Cartão:                  │
│ [____  ____  ____  ____]           │
│                                    │
│ Validade: [__/__]  CVV: [___]      │
│ Nome: [________________]            │
│                                    │
│ [Confirmar Pagamento] [Cancelar]   │
└────────────────────────────────────┘
```

---

## ✅ CHECKLIST

Antes de rodar:

- [x] Backend em `/workspaces/vamos/backend`
- [x] HTML em `/workspaces/vamos/public/index.html`
- [x] JS em `/workspaces/vamos/public/app.js`
- [x] Backend configurado para servir `/public`
- [x] CORS habilitado
- [ ] `.env` preenchido (DATABASE_URL, JWT_SECRET, etc)
- [ ] Dependências instaladas: `npm install` (backend)
- [ ] Banco de dados pronto

---

## 🏃 RODAR AGORA

```bash
cd /workspaces/vamos/backend
npm install
npm run dev

# Acesse http://localhost:3001
```

---

## 🔄 FLUXO COMPLETO DE USO

### 1. Usuário Acessa
```
http://localhost:3001
    ↓
Vê página HTML com menu
```

### 2. Faz Login/Registro
```
Clica "Login"
    ↓
Preenche email + senha
    ↓
JavaScript faz POST /api/auth/login
    ↓
Backend retorna JWT token
    ↓
Salva em localStorage
```

### 3. Agenda Serviço
```
Clica "Agendar"
    ↓
Preenche form com opções
    ↓
JavaScript calcula preço em tempo real
    ↓
Clica "Agendar e Pagar"
    ↓
POST /api/bookings com dados
    ↓
Abre modal de pagamento
```

### 4. Paga
```
Preenche dados do cartão
    ↓
POST /api/payments
    ↓
Stripe processa
    ↓
Backend confirma agendamento
    ↓
Mostra "Sucesso!"
```

### 5. Acompanha
```
Clica "Meus Agendamentos"
    ↓
GET /api/bookings/:userId
    ↓
Mostra lista com status (Pendente/Confirmado/Concluído)
```

### 6. Avalia
```
Status = Concluído
    ↓
Clica "Avaliar Serviço"
    ↓
Deixa nota (1-5⭐)
    ↓
POST /api/reviews
    ↓
Sistema atualiza loyalty streak
```

### 7. Ganha Bônus
```
10ª avaliação 5⭐
    ↓
Backend registra: loyalty_bonus = 100
    ↓
Próximo agendamento: -R$ 100 automaticamente
```

---

## 💾 O BANCO FAZ TUDO

Não precisa mais de Next.js + Vercel + Supabase separados.

**Tudo está aqui:**
- Backend Express: Servidor + API + Lógica
- HTML: Interface
- JavaScript: Conecta tudo
- PostgreSQL/SQLite: Dados

---

## 🎯 VANTAGENS

✅ Uma única porta (3001)
✅ Sem build complexo
✅ HTML puro (zero dependências frontend)
✅ API clara e funcional
✅ Fácil de debugar
✅ Pronto para produção
✅ Funciona offline parcialmente

---

**Tudo pronto! 🚀 Rode `npm run dev` no backend e acesse http://localhost:3001**
