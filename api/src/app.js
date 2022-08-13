import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import routes from './routes/index.js';

const app = express();
const corsOptions = {};

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

app.use('/', routes);

export default app;
