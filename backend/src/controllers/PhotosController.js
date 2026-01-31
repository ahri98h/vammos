/**
 * Photos Controller
 * Upload de fotos antes/depois dos serviços
 */

const db = require('../db');
const path = require('path');
const fs = require('fs');

class PhotosController {
  /**
   * Upload de fotos
   */
  async uploadPhotos(req, res) {
    try {
      const { bookingId } = req.params;
      const { photoType } = req.body; // 'before' ou 'after'
      const files = req.files || [];

      if (!files.length) {
        return res.status(400).json({ error: 'Nenhuma foto foi enviada' });
      }

      const photoUrls = [];

      for (const file of files) {
        // Renomear arquivo
        const newFilename = `${bookingId}-${photoType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
        const relativePath = `/uploads/${newFilename}`;

        // Salvar no banco
        const insertQuery = `
          INSERT INTO booking_photos (booking_id, photo_type, url, uploaded_at)
          VALUES ($1, $2, $3, NOW())
          RETURNING *
        `;

        const result = await db.query(insertQuery, [bookingId, photoType, relativePath]);
        photoUrls.push({
          id: result.rows[0].id,
          url: relativePath,
          type: photoType,
          uploadedAt: result.rows[0].uploaded_at
        });
      }

      res.json({
        success: true,
        photos: photoUrls,
        message: `${photoUrls.length} foto(s) enviada(s) com sucesso`
      });
    } catch (error) {
      console.error('Erro ao fazer upload de fotos:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obter fotos de um agendamento
   */
  async getBookingPhotos(req, res) {
    try {
      const { bookingId } = req.params;

      const query = `
        SELECT 
          id,
          booking_id,
          photo_type,
          url,
          uploaded_at
        FROM booking_photos
        WHERE booking_id = $1
        ORDER BY uploaded_at DESC
      `;

      const result = await db.query(query, [bookingId]);

      // Agrupar por tipo
      const photos = {
        before: result.rows.filter(p => p.photo_type === 'before'),
        after: result.rows.filter(p => p.photo_type === 'after')
      };

      res.json(photos);
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Galeria de trabalhos completados
   */
  async getGallery(req, res) {
    try {
      const { limit = 20, offset = 0 } = req.query;

      const query = `
        SELECT DISTINCT
          bp.id,
          bp.booking_id,
          bp.photo_type,
          bp.url,
          bp.uploaded_at,
          b.id as booking_id_ref,
          b.rating,
          b.review,
          s.name as service_name,
          u.name as customer_name
        FROM booking_photos bp
        JOIN bookings b ON bp.booking_id = b.id
        JOIN services s ON b.service_id = s.id
        JOIN users u ON b.user_id = u.id
        WHERE b.status = 'completed'
        AND b.rating >= 4
        AND bp.photo_type = 'after'
        ORDER BY bp.uploaded_at DESC
        LIMIT $1 OFFSET $2
      `;

      const result = await db.query(query, [limit, offset]);

      res.json({
        total: result.rowCount,
        photos: result.rows
      });
    } catch (error) {
      console.error('Erro ao buscar galeria:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Deletar foto
   */
  async deletePhoto(req, res) {
    try {
      const { photoId } = req.params;
      const { userId } = req.user;

      // Verificar permissão
      const checkQuery = `
        SELECT bp.id, b.user_id, b.staff_id
        FROM booking_photos bp
        JOIN bookings b ON bp.booking_id = b.id
        WHERE bp.id = $1
      `;

      const checkResult = await db.query(checkQuery, [photoId]);

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Foto não encontrada' });
      }

      const photo = checkResult.rows[0];
      if (photo.user_id !== userId && photo.staff_id !== userId) {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      // Deletar do banco
      const deleteQuery = `
        DELETE FROM booking_photos WHERE id = $1 RETURNING *
      `;

      const result = await db.query(deleteQuery, [photoId]);

      res.json({
        success: true,
        message: 'Foto deletada com sucesso',
        photo: result.rows[0]
      });
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PhotosController();
