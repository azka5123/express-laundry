const express = require('express');
const checkAuth = require('../middleware/checkAuth')
const authRoutes = require('./auth');
const userRoutes = require('./user');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger_output.json');

const router = express.Router();

router.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use('/auth',authRoutes);

router.use('/user',checkAuth,userRoutes);

module.exports = router;