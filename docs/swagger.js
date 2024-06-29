const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/index.js'];

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'Express Laundry API',
    description: 'API documentation',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'https://express-laundry.vercel.app/',
    },
  ],
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Operations related to authentication',
    },
    {
      name: 'User',
      description: 'Operations related to user management',
    },
  ],
  paths: {},
};

swaggerAutogen(outputFile, endpointsFiles, doc);
