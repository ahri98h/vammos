/**
 * API Versioning Router
 * Suporta múltiplas versões de API (/v1, /v2)
 */

const express = require('express');
const router = express.Router();

/**
 * Estrutura:
 * /api/v1/* - APIs estáveis (backward compatibility)
 * /api/v2/* - APIs novas com breaking changes (DTOs, melhorado error handling)
 */

// ===== V1 ROUTES (Legacy) =====
const v1Router = require('./v1');
router.use('/v1', v1Router);

// ===== V2 ROUTES (Current) =====
const v2Router = require('./v2');
router.use('/v2', v2Router);

/**
 * Default version: /api/* maps to /api/v2/*
 */
router.use((req, res, next) => {
  // Se acessar /api/users, redirecionar para /api/v2/users
  if (!req.path.startsWith('/v1') && !req.path.startsWith('/v2')) {
    const newPath = `/v2${req.path}`;
    req.url = newPath;
    return v2Router(req, res, next);
  }
  next();
});

/**
 * Deprecation notice middleware
 */
const deprecationNotice = (req, res, next) => {
  if (req.path.includes('/v1')) {
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toUTCString());
    res.setHeader('Link', '</api/v2>; rel="successor-version"');
  }
  next();
};

router.use(deprecationNotice);

module.exports = router;
