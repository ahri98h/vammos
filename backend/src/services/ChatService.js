/**
 * Chat Service - Socket.io
 * Chat em tempo real entre cliente e funcionária
 */

const db = require('../db');

class ChatService {
  constructor(io) {
    this.io = io;
    this.setupListeners();
  }

  setupListeners() {
    this.io.on('connection', (socket) => {
      console.log(`👤 Usuário conectado: ${socket.id}`);

      // Entrar em sala de chat
      socket.on('join-booking', async (data) => {
        const { bookingId, userId, userRole } = data;
        const roomName = `booking-${bookingId}`;

        socket.join(roomName);
        console.log(`✅ ${userRole} entrou em ${roomName}`);

        // Enviar histórico de mensagens
        try {
          const historyQuery = `
            SELECT * FROM chat_messages
            WHERE booking_id = $1
            ORDER BY created_at ASC
            LIMIT 50
          `;
          const history = await db.query(historyQuery, [bookingId]);

          socket.emit('chat-history', {
            messages: history.rows,
            bookingId
          });
        } catch (error) {
          console.error('Erro ao buscar histórico de chat:', error);
        }

        // Notificar que alguém entrou
        this.io.to(roomName).emit('user-joined', {
          userId,
          userRole,
          message: `${userRole === 'staff' ? 'Funcionária' : 'Cliente'} entrou no chat`
        });
      });

      // Receber mensagem
      socket.on('send-message', async (data) => {
        const { bookingId, userId, userRole, message } = data;
        const roomName = `booking-${bookingId}`;

        try {
          // Salvar no banco
          const insertQuery = `
            INSERT INTO chat_messages (booking_id, user_id, user_role, message, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
          `;
          const result = await db.query(insertQuery, [bookingId, userId, userRole, message]);

          // Enviar para a sala
          this.io.to(roomName).emit('new-message', {
            id: result.rows[0].id,
            userId,
            userRole,
            message,
            createdAt: result.rows[0].created_at
          });

          console.log(`💬 Mensagem em ${roomName}: ${message.substring(0, 30)}...`);
        } catch (error) {
          console.error('Erro ao salvar mensagem:', error);
          socket.emit('message-error', { error: 'Erro ao enviar mensagem' });
        }
      });

      // Desconectar
      socket.on('disconnect', () => {
        console.log(`❌ Usuário desconectado: ${socket.id}`);
      });

      // Deixar sala
      socket.on('leave-booking', (data) => {
        const { bookingId, userRole } = data;
        const roomName = `booking-${bookingId}`;
        socket.leave(roomName);

        this.io.to(roomName).emit('user-left', {
          userRole,
          message: `${userRole === 'staff' ? 'Funcionária' : 'Cliente'} saiu do chat`
        });
      });
    });
  }
}

module.exports = ChatService;
