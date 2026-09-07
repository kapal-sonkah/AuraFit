import routes from '../routes/index.js';
import express from 'express';
import cors from 'cors';
import ErrorHandler from '../middlewares/error.js';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*'
}));
app.use(routes);
app.use(ErrorHandler);

export default app;