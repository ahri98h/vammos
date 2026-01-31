/**
 * Admin Controller - Dashboard
 * Análises, relatórios, estatísticas
 */

const db = require('../db');

class AdminController {
  /**
   * Dashboard principal - Resumo geral
   */
  async getDashboard(req, res) {
    try {
      const dashboardData = {};

      // Receita total do mês
      const revenueQuery = `
        SELECT 
          SUM(final_price) as total_revenue,
          COUNT(*) as total_bookings,
          AVG(CASE WHEN rating IS NOT NULL THEN rating ELSE NULL END) as average_rating
        FROM bookings
        WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM NOW())
        AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM NOW())
        AND status IN ('confirmed', 'completed')
      `;
      const revenueResult = await db.query(revenueQuery);
      dashboardData.monthlyRevenue = revenueResult.rows[0];

      // Agendamentos por status
      const statusQuery = `
        SELECT 
          status,
          COUNT(*) as count
        FROM bookings
        WHERE date >= DATE_TRUNC('day', NOW())
        GROUP BY status
      `;
      const statusResult = await db.query(statusQuery);
      dashboardData.bookingsByStatus = statusResult.rows;

      // Top 5 funcionárias
      const staffQuery = `
        SELECT 
          u.id,
          u.name,
          COUNT(b.id) as bookings_completed,
          SUM(b.final_price * 0.1) as total_earnings,
          AVG(b.rating) as average_rating
        FROM users u
        LEFT JOIN bookings b ON u.id = b.staff_id AND b.status = 'completed'
        WHERE u.role = 'staff'
        GROUP BY u.id, u.name
        ORDER BY total_earnings DESC
        LIMIT 5
      `;
      const staffResult = await db.query(staffQuery);
      dashboardData.topStaff = staffResult.rows;

      // Top 5 clientes
      const clientQuery = `
        SELECT 
          u.id,
          u.name,
          COUNT(b.id) as bookings,
          SUM(b.final_price) as total_spent,
          AVG(b.rating) as average_rating
        FROM users u
        LEFT JOIN bookings b ON u.id = b.user_id
        WHERE u.role = 'customer'
        GROUP BY u.id, u.name
        ORDER BY total_spent DESC
        LIMIT 5
      `;
      const clientResult = await db.query(clientQuery);
      dashboardData.topClients = clientResult.rows;

      // Taxa de cancelamento
      const cancellationQuery = `
        SELECT 
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
          COUNT(*) as total,
          ROUND((COUNT(CASE WHEN status = 'cancelled' THEN 1 END)::FLOAT / COUNT(*)) * 100, 2) as cancellation_rate
        FROM bookings
        WHERE date >= DATE_TRUNC('month', NOW())
      `;
      const cancellationResult = await db.query(cancellationQuery);
      dashboardData.cancellationStats = cancellationResult.rows[0];

      res.json(dashboardData);
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Gráfico de receita diária/semanal/mensal
   */
  async getRevenueChart(req, res) {
    try {
      const { period = 'daily' } = req.query; // daily, weekly, monthly

      let groupBy, dateFormat;
      if (period === 'daily') {
        groupBy = "DATE_TRUNC('day', date)";
        dateFormat = "TO_CHAR(date, 'DD/MM')";
      } else if (period === 'weekly') {
        groupBy = "DATE_TRUNC('week', date)";
        dateFormat = "TO_CHAR(date, 'DD/MM')";
      } else {
        groupBy = "DATE_TRUNC('month', date)";
        dateFormat = "TO_CHAR(date, 'MM/YYYY')";
      }

      const query = `
        SELECT 
          ${dateFormat} as date,
          SUM(final_price) as revenue,
          COUNT(*) as bookings
        FROM bookings
        WHERE status IN ('confirmed', 'completed')
        AND date >= NOW() - INTERVAL '3 months'
        GROUP BY ${groupBy}
        ORDER BY date DESC
      `;

      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar gráfico de receita:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Lista completa de agendamentos com filtros
   */
  async getBookingsList(req, res) {
    try {
      const { status, startDate, endDate, limit = 50, offset = 0 } = req.query;

      let query = `
        SELECT 
          b.id,
          b.date,
          b.time,
          b.status,
          b.final_price,
          b.rating,
          u.name as customer_name,
          u.phone as customer_phone,
          s.name as service_name,
          b.address
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN services s ON b.service_id = s.id
        WHERE 1=1
      `;

      const params = [];
      let paramCount = 1;

      if (status) {
        query += ` AND b.status = $${paramCount}`;
        params.push(status);
        paramCount++;
      }

      if (startDate) {
        query += ` AND b.date >= $${paramCount}`;
        params.push(startDate);
        paramCount++;
      }

      if (endDate) {
        query += ` AND b.date <= $${paramCount}`;
        params.push(endDate);
        paramCount++;
      }

      query += ` ORDER BY b.date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(limit, offset);

      const result = await db.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar lista de agendamentos:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Usuários registrados
   */
  async getUsersStats(req, res) {
    try {
      const query = `
        SELECT 
          role,
          COUNT(*) as count,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_users
        FROM users
        GROUP BY role
      `;

      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar estatísticas de usuários:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Avaliações e Reviews
   */
  async getReviewsStats(req, res) {
    try {
      const query = `
        SELECT 
          ROUND(AVG(rating), 2) as average_rating,
          COUNT(*) as total_reviews,
          COUNT(CASE WHEN rating = 5 THEN 1 END) as five_stars,
          COUNT(CASE WHEN rating = 4 THEN 1 END) as four_stars,
          COUNT(CASE WHEN rating = 3 THEN 1 END) as three_stars,
          COUNT(CASE WHEN rating = 2 THEN 1 END) as two_stars,
          COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
        FROM bookings
        WHERE rating IS NOT NULL
      `;

      const result = await db.query(query);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar estatísticas de reviews:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Próximos agendamentos (hoje + próximos 7 dias)
   */
  async getUpcomingBookings(req, res) {
    try {
      const query = `
        SELECT 
          b.id,
          b.date,
          b.time,
          b.status,
          b.final_price,
          u.name as customer_name,
          u.phone as customer_phone,
          s.name as service_name,
          b.address,
          b.durationHours
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN services s ON b.service_id = s.id
        WHERE b.date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
        AND b.status IN ('pending', 'confirmed')
        ORDER BY b.date, b.time
      `;

      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar próximos agendamentos:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Ganhos por funcionária (detalhado)
   */
  async getStaffEarnings(req, res) {
    try {
      const { staffId } = req.params;

      let query = `
        SELECT 
          b.id,
          b.date,
          b.time,
          b.final_price,
          b.status,
          u.name as customer_name,
          s.name as service_name,
          ROUND(b.final_price * 0.1, 2) as staff_commission
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN services s ON b.service_id = s.id
        WHERE b.status = 'completed'
      `;

      if (staffId) {
        query += ` AND b.staff_id = $1`;
      }

      query += ` ORDER BY b.date DESC`;

      const result = staffId ? await db.query(query, [staffId]) : await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar ganhos de funcionária:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AdminController();
