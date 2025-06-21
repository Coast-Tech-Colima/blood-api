import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blood API',
      version: '1.0.0',
      description: 'API documentation for Blood API',
    },
    servers: [
      { url: 'http://localhost:3000' },
      { url: 'https://blood-api.vercel.app' }
    ],
  },
  apis: ['src/routes/*.ts', 'src/controllers/*.ts'], // <-- No leading ./
};


const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;