import express from 'express';
import { configDotenv } from 'dotenv';

configDotenv();
const port: number | string = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Node.js!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
