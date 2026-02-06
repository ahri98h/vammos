/**
 * Price History Controller
 * Endpoints para histórico de preços, alertas, previsões
 */

const express = require('express');
const router = express.Router();
const PriceHistoryService = require('../services/PriceHistoryService');

// POST /api/prices/history
router.post('/history', (req, res) => {
  try {
    const { serviceId, oldPrice, newPrice, reason } = req.body;
    const record = PriceHistoryService.recordPriceChange(serviceId, oldPrice, newPrice, reason);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/prices/history/:serviceId
router.get('/history/:serviceId', (req, res) => {
  const { months = 12 } = req.query;
  const history = PriceHistoryService.getPriceHistory(req.params.serviceId, parseInt(months));
  res.json(history);
});

// POST /api/prices/alerts
router.post('/alerts', (req, res) => {
  try {
    const { userId, serviceId, targetPrice } = req.body;
    const alert = PriceHistoryService.createPriceAlert(userId, serviceId, targetPrice);
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/prices/alerts/:userId
router.get('/alerts/:userId', (req, res) => {
  const alerts = PriceHistoryService.getUserPriceAlerts(req.params.userId);
  res.json(alerts);
});

// GET /api/prices/forecast/:serviceId
router.get('/forecast/:serviceId', (req, res) => {
  const forecast = PriceHistoryService.forecastPrice(req.params.serviceId);
  res.json(forecast);
});

// GET /api/prices/comparison/:serviceId
router.get('/comparison/:serviceId', (req, res) => {
  const comparison = PriceHistoryService.getPriceComparison(req.params.serviceId);
  res.json(comparison);
});

// DELETE /api/prices/alerts/:alertId
router.delete('/alerts/:alertId', (req, res) => {
  const result = PriceHistoryService.removePriceAlert(req.params.alertId);
  res.json(result);
});

module.exports = router;
