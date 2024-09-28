const express = require('express');
const checkAuth = require('../middleware/checkAuth')
const authRoutes = require('./auth');
const userRoutes = require('./user');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger_output.json');

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const router = express.Router();
// sdas
// asagfag
// asfasf
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL,
}));

router.use('/auth', authRoutes);

router.use('/user', checkAuth, userRoutes);

module.exports = router;