/**
 * Auto-Scheduling Controller
 * Endpoints para agendamento automático, otimização de rotas
 */

const express = require('express');
const router = express.Router();
const AutoSchedulingService = require('../services/AutoSchedulingService');

// POST /api/scheduling/auto-schedule
router.post('/auto-schedule', async (req, res) => {
  try {
    const { serviceType, location, date, duration, clientId, preferredProfessional } = req.body;
    const schedule = await AutoSchedulingService.autoScheduleProfessionals({
      serviceType,
      location,
      date,
      duration,
      clientId,
      preferredProfessional
    });
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/scheduling/optimize-route
router.post('/optimize-route', async (req, res) => {
  try {
    const { professionalId, bookingIds } = req.body;
    const route = await AutoSchedulingService.optimizeRoute(professionalId, bookingIds);
    res.json(route);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/scheduling/sync-calendar
router.post('/sync-calendar', async (req, res) => {
  try {
    const { professionalId, schedule } = req.body;
    const result = await AutoSchedulingService.syncWithProfessionalCalendar(professionalId, schedule);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/scheduling/suggestions/:clientId
router.get('/suggestions/:clientId', async (req, res) => {
  try {
    const suggestions = await AutoSchedulingService.getSchedulingSuggestions(req.params.clientId);
    res.json(suggestions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/scheduling/conflicts
router.get('/conflicts', async (req, res) => {
  try {
    const conflicts = await AutoSchedulingService.detectSchedulingConflicts();
    res.json(conflicts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/scheduling/occupancy/:professionalId
router.get('/occupancy/:professionalId', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await AutoSchedulingService.getOccupancyReport(
      req.params.professionalId,
      startDate,
      endDate
    );
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
