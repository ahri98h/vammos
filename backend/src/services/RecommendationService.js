/**
 * Recommendation Service
 * Recomendações personalizadas baseado em histórico e padrões
 */

const logger = require('../utils/logger');

class RecommendationService {
  constructor() {
    this.userHistory = new Map();
  }

  /**
   * Recomendações baseado em histórico do usuário
   */
  async getPersonalizedRecommendations(userId) {
    try {
      const history = this.userHistory.get(userId) || [];

      if (history.length === 0) {
        return this.getPopularServices();
      }

      // Agrupar por serviço
      const serviceFreq = {};
      history.forEach(booking => {
        serviceFreq[booking.serviceId] = (serviceFreq[booking.serviceId] || 0) + 1;
      });

      // Serviço mais frequente
      const topServices = Object.entries(serviceFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([serviceId]) => serviceId);

      return {
        userId,
        recommendations: topServices.map((id, idx) => ({
          serviceId: id,
          reason: idx === 0 ? 'Seu favorito' : 'Frequente',
          relevance: `${100 - idx * 20}%`
        })),
        explanation: 'Baseado no seu histórico'
      };
    } catch (error) {
      logger.error('Failed to get recommendations', { error: error.message });
      throw error;
    }
  }

  /**
   ✅ NOVO: Recomendações de horário idealizado
   */
  async getBestTimeToBook(userId) {
    const history = this.userHistory.get(userId) || [];

    if (history.length === 0) {
      return {
        recommendation: 'Qualquer horário funciona',
        topTimes: ['9:00', '14:00', '18:00']
      };
    }

    const times = {};
    history.forEach(booking => {
      const hour = new Date(booking.scheduledFor).getHours();
      times[hour] = (times[hour] || 0) + 1;
    });

    const topTime = Object.entries(times)
      .sort((a, b) => b[1] - a[1])[0][0];

    return {
      userId,
      recommendedTime: `${topTime}:00`,
      reason: 'Baseado no seu histórico',
      alternativesTimes: ['09:00', '14:00', '18:00'],
      conversionRate: '+15% neste horário'
    };
  }

  /**
   ✅ NOVO: Clientes em risco (not returning)
   */
  async getAtRiskCustomers() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const atRisk = [];

    this.userHistory.forEach((history, userId) => {
      if (history.length > 0) {
        const lastBooking = history[history.length - 1];
        if (lastBooking.completedAt < thirtyDaysAgo) {
          atRisk.push({
            userId,
            lastBooking: lastBooking.completedAt,
            daysSince: Math.floor(
              (new Date() - lastBooking.completedAt) / (1000 * 60 * 60 * 24)
            ),
            lifetime Value: history.reduce((s, b) => s + (b.price || 0), 0)
          });
        }
      }
    });

    return {
      count: atRisk.length,
      customers: atRisk.slice(0, 20),
      recommendedAction: 'Enviar coupon para trazer de volta'
    };
  }

  /**
   ✅ NOVO: Upsell recommendations
   */
  async getUpsellRecommendations(userId, currentServiceId) {
    const history = this.userHistory.get(userId) || [];

    const complementaryServices = {
      'limpeza-residencial': ['organização', 'higienização', 'deodoração'],
      'limpeza-comercial': ['consergieria', 'manutencao', 'higienização'],
      'organização': ['consultoria-profissional', 'mudança']
    };

    const recommended = complementaryServices[currentServiceId] || [];

    return {
      userId,
      currentService: currentServiceId,
      recommendations: recommended.map((service, idx) => ({
        serviceId: service,
        cross sell: true,
        estimatedAdditionalRevenue: `R$ ${(50 + idx * 25).toFixed(2)}`
      }))
    };
  }

  /**
   ✅ NOVO: Popular services
   */
  async getPopularServices() {
    return {
      popular: [
        { serviceId: 'limpeza-residencial', popularity: '95%' },
        { serviceId: 'higienização', popularity: '87%' },
        { serviceId: 'organização', popularity: '72%' },
        { serviceId: 'limpeza-comercial', popularity: '68%' }
      ],
      reason: 'Serviços mais populares na sua região'
    };
  }

  /**
   ✅ NOVO: Registrar booking para análise
   */
  async recordBooking(userId, bookingData) {
    if (!this.userHistory.has(userId)) {
      this.userHistory.set(userId, []);
    }

    this.userHistory.get(userId).push({
      ...bookingData,
      recordedAt: new Date()
    });
  }

  /**
   ✅ NOVO: Similar customers (encontrar clientes similares)
   */
  async findSimilarCustomers(userId) {
    const userHistory = this.userHistory.get(userId) || [];
    const similar = [];

    this.userHistory.forEach((history, otherUserId) => {
      if (otherUserId !== userId) {
        const commonServices = userHistory.filter(b =>
          history.some(h => h.serviceId === b.serviceId)
        ).length;

        if (commonServices > 0) {
          similar.push({
            userId: otherUserId,
            commonServices,
            similarity: `${(commonServices / userHistory.length * 100).toFixed(0)}%`
          });
        }
      }
    });

    return similar.sort((a, b) => b.commonServices - a.commonServices).slice(0, 10);
  }
}

module.exports = new RecommendationService();
