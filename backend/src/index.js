/**
 * Main Server Entry Point
 * Express app configuration
 */

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const webhookRoutes = require('./routes/webhooks');
const adminRoutes = require('./routes/admin');
const Scheduler = require('./utils/scheduler');
const ChatService = require('./services/ChatService');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ===== CHAT SERVICE =====
const chatService = new ChatService(io);

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// ===== ROUTES =====
app.use('/api', apiRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/admin', adminRoutes);

// Servir uploads estáticos
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ===== SERVE SPA =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ===== INICIALIZAÇÃO =====
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  
  // Inicializar scheduler automático
  Scheduler.init();
});

module.exports = app;
