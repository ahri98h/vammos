# 🧪 TESTES RÁPIDOS - VERIFICAR TUDO

## ✅ Checklist de Funcionamento

### 1️⃣ Backend Iniciou?
```bash
cd /workspaces/vamos/backend
npm run dev

# Esperado: 🚀 Servidor rodando em http://localhost:3001
```

### 2️⃣ Frontend Carregou?
```
Acesse: http://localhost:3001

Esperado: Página Leidy Cleaner com menu e botões
```

### 3️⃣ Health Check
```bash
curl http://localhost:3001/health

Esperado: { "status": "OK", "timestamp": "..." }
```

### 4️⃣ Registro de Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "senha123",
    "name": "João Teste",
    "phone": "11987654321",
    "cpf_cnpj": "12345678901"
  }'

Esperado: { "token": "jwt_token...", "user": {...} }
```

### 5️⃣ Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "senha123"
  }'

Esperado: { "token": "jwt_token...", "user": {...} }
```

### 6️⃣ Agendar Serviço
```bash
TOKEN="seu_token_aqui"

curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "serviceId": 1,
    "date": "2025-02-10",
    "time": "14:00",
    "durationHours": 2,
    "address": "Rua das Flores, 123",
    "phone": "11987654321",
    "hasStaff": true,
    "hasExtraQuarter": false,
    "isPostWork": false
  }'

Esperado: { "success": true, "booking": {...}, "finalPrice": 84.00 }
```

### 7️⃣ Admin Dashboard
```bash
TOKEN="seu_token_admin_aqui"

curl http://localhost:3001/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"

Esperado: 
{
  "monthlyRevenue": { "total_revenue": ..., "total_bookings": ... },
  "bookingsByStatus": [...],
  "topStaff": [...],
  "topClients": [...]
}
```

### 8️⃣ Receita por Período
```bash
curl "http://localhost:3001/api/admin/revenue-chart?period=daily" \
  -H "Authorization: Bearer $TOKEN"

Esperado: Array com datas e receitas
```

### 9️⃣ Staff Dashboard
```bash
TOKEN="seu_token_staff_aqui"

curl http://localhost:3001/api/staff/dashboard \
  -H "Authorization: Bearer $TOKEN"

Esperado: { "earnings": {...}, "monthlyEarnings": {...}, "upcomingBookings": [...] }
```

### 🔟 Galeria de Fotos
```bash
curl http://localhost:3001/api/gallery

Esperado: { "total": 10, "photos": [...] }
```

### 1️⃣1️⃣ Avaliações Públicas
```bash
curl http://localhost:3001/api/public-reviews

Esperado: { "total": 5, "reviews": [...], "page": 1 }
```

### 1️⃣2️⃣ Estatísticas de Avaliações
```bash
curl http://localhost:3001/api/reviews-stats/public

Esperado:
{
  "averageRating": 4.8,
  "totalReviews": 50,
  "distribution": {
    "fiveStars": { "count": 40, "percentage": "80.0" },
    ...
  }
}
```

### 1️⃣3️⃣ Chat em Tempo Real
```javascript
// No browser console:
const socket = io('http://localhost:3001');

// Entrar em chat
socket.emit('join-booking', {
  bookingId: 123,
  userId: 1,
  userRole: 'client'
});

// Enviar mensagem
socket.emit('send-message', {
  bookingId: 123,
  userId: 1,
  userRole: 'client',
  message: 'Olá!'
});

// Receber
socket.on('new-message', (data) => {
  console.log('Mensagem:', data);
});

// Esperado: Mensagem recebida em tempo real
```

### 1️⃣4️⃣ Upload de Fotos
```bash
TOKEN="seu_token_aqui"

curl -X POST http://localhost:3001/api/bookings/123/photos \
  -H "Authorization: Bearer $TOKEN" \
  -F "photos=@foto1.jpg" \
  -F "photos=@foto2.jpg" \
  -F "photoType=before"

Esperado: { "success": true, "photos": [...] }
```

### 1️⃣5️⃣ Buscar Fotos de Agendamento
```bash
curl http://localhost:3001/api/bookings/123/photos \
  -H "Authorization: Bearer $TOKEN"

Esperado: { "before": [...], "after": [...] }
```

---

## 🔍 Validações Importantes

### Email enviado?
- Verificar INBOX do email configurado em `.env`
- Se não chegou:
  1. Verificar if `EMAIL_USER` está correto
  2. Verificar if `EMAIL_PASS` é senha de app (não senha normal)
  3. Verificar if Gmail tem 2FA ativado

### SMS enviado?
- Se não chegou:
  1. Verificar if `TWILIO_ACCOUNT_SID` está correto
  2. Verificar if `TWILIO_AUTH_TOKEN` está correto
  3. Verificar if `TWILIO_PHONE_NUMBER` é válido
  4. Verificar if telefone destino é válido

### Banco de dados?
```bash
# SQLite
file database.sqlite

# Ou verificar logs
tail -f backend/logs/app.log
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'socket.io'"
```bash
cd backend
npm install socket.io --save
npm run dev
```

### Erro: "CORS blocked"
Verificar `.env`:
```env
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
```

### Erro: "JWT verification failed"
Token expirou? Faça login novamente

### Erro: "Database connection failed"
```bash
# Verificar DATABASE_URL em .env
# Ou usar SQLite local:
DATABASE_LOCAL=./database.sqlite
```

### Erro: "Email/SMS não enviando"
1. Verificar `.env` (chaves corretas)
2. Ver logs: `cat backend/.env`
3. Testar chaves manualmente

---

## 📊 Dashboard de Teste

### Admin (Ver receita)
```
http://localhost:3001/api/admin/dashboard
```

### Staff (Ver ganhos)
```
http://localhost:3001/api/staff/dashboard
```

### Público (Ver reviews)
```
http://localhost:3001/api/public-reviews
```

---

## ✅ Tudo Pronto?

Se todos os 15 testes passarem:
✅ Sistema 100% funcional
✅ Pronto para produção
✅ Todas as features ativas

---

**Qualquer dúvida, verifique:**
1. `.env` está correto?
2. Banco rodando?
3. Porta 3001 disponível?
4. Logs em `backend/logs/app.log`

