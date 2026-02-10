/**
 * API V1 Routes (Legacy)
 * Manter backward compatibility
 */

const express = require('express');
const router = express.Router();

// Redirecionar v1 routes para v2 (com deprecation warning)
const mainRoutes = require('./api');

router.use('/', (req, res, next) => {
  res.setHeader('Deprecation', 'true');
  res.setHeader('Sunset', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toUTCString());
  res.setHeader('Link', '</api/v2>; rel="successor-version"');
  next();
}, mainRoutes);

module.exports = router;
