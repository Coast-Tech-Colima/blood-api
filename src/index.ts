import express from 'express';
import userRoutes from './routes/userRoutes';
import requestRoutes from './routes/requestRoutes';
import donationRoutes from './routes/donationRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger';
import 'dotenv/config'

const app = express();

// Middleware
app.use(express.json());

app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});