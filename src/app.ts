import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoutes';
import cors from 'cors';

// load environment variables from .env file
dotenv.config();

// create an Express application
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// add middleware to parse JSON bodies
app.use(express.json());
app.use('/api', uploadRoutes);

// health check endpoint
app.get('/health-check', (req, res) => {
  res.json({ status: 'healthy' });
});

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;