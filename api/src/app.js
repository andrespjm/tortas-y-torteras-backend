import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import routes from './routes/index.js';
import bodyParser from 'body-parser';

const app = express();
const corsOptions = {};

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}))

app.use('/', routes);

app.set('view engine', 'ejs');

export default app;
