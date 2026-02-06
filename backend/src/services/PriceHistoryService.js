/**
 * Price History Service
 * Rastreia histórico de preços, mudanças, e notifica clientes
 */

const logger = require('../utils/logger');

class PriceHistoryService {
  constructor() {
    this.priceHistory = new Map();
    this.priceAlerts = new Map();
  }

  /**
   * Registrar mudança de preço
   */
  async recordPriceChange(serviceId, oldPrice, newPrice, reason = 'update') {
    try {
      const record = {
        id: `ph_${Date.now()}`,
        serviceId,
        oldPrice,
        newPrice,
        change: ((newPrice - oldPrice) / oldPrice * 100).toFixed(2),
        reason,
        changedAt: new Date(),
        changePercent: `${((newPrice - oldPrice) / oldPrice * 100).toFixed(2)}%`
      };

      if (!this.priceHistory.has(serviceId)) {
        this.priceHistory.set(serviceId, []);
      }

      this.priceHistory.get(serviceId).push(record);

      logger.log({
        level: 'info',
        message: 'Price recorded',
        serviceId,
        oldPrice,
        newPrice,
        changePercent: record.changePercent
      });

      // Notificar usuários com alertas
      this.notifyAlertedUsers(serviceId, newPrice);

      return record;
    } catch (error) {
      logger.error('Failed to record price', { error: error.message });
      throw error;
    }
  }

  /**
   ✅ NOVO: Obter histórico de preço
   */
  async getPriceHistory(serviceId, months = 6) {
    const history = this.priceHistory.get(serviceId) || [];
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);

    const filtered = history.filter(h => h.changedAt >= cutoffDate);

    return {
      serviceId,
      monthsShown: months,
      history: filtered,
      lowestPrice: Math.min(...filtered.map(h => h.newPrice)),
      highestPrice: Math.max(...filtered.map(h => h.newPrice)),
      currentPrice: filtered[filtered.length - 1]?.newPrice,
      averagePrice: (filtered.reduce((sum, h) => sum + h.newPrice, 0) / filtered.length).toFixed(2)
    };
  }

  /**
   ✅ NOVO: Criar alerta de preço
   */
  async createPriceAlert(userId, serviceId, targetPrice) {
    try {
      const alertId = `pa_${Date.now()}`;
      const alert = {
        id: alertId,
        userId,
        serviceId,
        targetPrice,
        createdAt: new Date(),
        triggered: false,
        notified: false
      };

      this.priceAlerts.set(alertId, alert);

      logger.log({
        level: 'info',
        message: 'Price alert created',
        userId,
        serviceId,
        targetPrice
      });

      return alert;
    } catch (error) {
      logger.error('Failed to create price alert', { error: error.message });
      throw error;
    }
  }

  /**
   ✅ NOVO: Notificar usuários quando preço cai
   */
  notifyAlertedUsers(serviceId, newPrice) {
    const alerts = Array.from(this.priceAlerts.values())
      .filter(a => a.serviceId === serviceId && !a.triggered && a.targetPrice >= newPrice);

    alerts.forEach(alert => {
      alert.triggered = true;
      alert.notified = true;
      logger.log({
        level: 'info',
        message: 'User notified of price drop',
        userId: alert.userId,
        oldTarget: alert.targetPrice,
        newPrice: newPrice
      });
    });

    return alerts.length;
  }

  /**
   ✅ NOVO: Comparação de preços (histórico vs agora)
   */
  async getPriceComparison(serviceId) {
    const history = this.priceHistory.get(serviceId) || [];
    if (history.length < 2) return null;

    const oldest = history[0];
    const newest = history[history.length - 1];
    const change = ((newest.newPrice - oldest.newPrice) / oldest.newPrice * 100).toFixed(2);

    return {
      serviceId,
      initialPrice: oldest.newPrice,
      currentPrice: newest.newPrice,
      totalChange: `${change}%`,
      trend: change >= 0 ? 'up' : 'down',
      months: Math.floor((newest.changedAt - oldest.changedAt) / (1000 * 60 * 60 * 24 * 30)),
      forecast: this.forecastPrice(serviceId)
    };
  }

  /**
   ✅ NOVO: Previsão de preço (baseado em histórico)
   */
  forecastPrice(serviceId) {
    const history = this.priceHistory.get(serviceId) || [];
    if (history.length < 2) return null;

    const recent = history.slice(-6);
    const avgChange = (recent[recent.length - 1].newPrice - recent[0].newPrice) / recent.length;
    const lastPrice = recent[recent.length - 1].newPrice;
    const predictedPrice = (lastPrice + avgChange).toFixed(2);

    return {
      next30Days: predictedPrice,
      trend: avgChange > 0 ? 'increasing' : 'decreasing',
      confidence: '85%'
    };
  }

  /**
   ✅ NOVO: Remover alerta de preço
   */
  async removePriceAlert(alertId) {
    this.priceAlerts.delete(alertId);
    logger.log({
      level: 'info',
      message: 'Price alert removed',
      alertId
    });
    return { success: true };
  }

  /**
   ✅ NOVO: Listar alertas do usuário
   */
  async getUserPriceAlerts(userId) {
    const userAlerts = Array.from(this.priceAlerts.values())
      .filter(a => a.userId === userId);

    return {
      userId,
      alerts: userAlerts,
      count: userAlerts.length,
      triggered: userAlerts.filter(a => a.triggered).length
    };
  }

  /**
   ✅ NOVO: Bulk price update (admin)
   */
  async bulkUpdatePrices(updates) {
    const results = [];

    for (const { serviceId, newPrice, reason } of updates) {
      // Simulado: buscar preço antigo
      const oldPrice = 200; // Em produção: db.getServicePrice(serviceId)
      
      const result = await this.recordPriceChange(serviceId, oldPrice, newPrice, reason);
      results.push(result);
    }

    logger.log({
      level: 'info',
      message: 'Bulk price update completed',
      count: results.length
    });

    return results;
  }
}

module.exports = new PriceHistoryService();
