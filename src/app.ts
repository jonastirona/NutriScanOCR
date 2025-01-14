import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', uploadRoutes);

app.get('/health-check', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
