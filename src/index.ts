import express from 'express';
import morgan from 'morgan';
import weatherRouter from './routes/weatherRouter.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import { configDotenv } from 'dotenv';

// Load environment variables from .env file

configDotenv();
const port: number | string = process.env.PORT || 3000;
const app = express();

// Middleware

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Node.js!');
});
app.use('/api/v1/weather', weatherRouter);

// Global Error Handler
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
