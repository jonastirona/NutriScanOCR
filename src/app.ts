import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoutes';

// load environment variables from .env file
dotenv.config();

// create an Express application
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// add middleware to parse JSON bodies
app.use(express.json());
app.use('/', uploadRoutes);

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;