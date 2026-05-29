import express, { RequestHandler } from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const { GH_APP_ID, GH_APP_PRIVATE_KEY, GH_APP_INSTALLATION_ID } = process.env;
if (!GH_APP_ID || !GH_APP_PRIVATE_KEY || !GH_APP_INSTALLATION_ID) {
  throw new Error('Env not set correctly');
}

import { apiRoute } from './routes/api/index';
import { healthCheckRoute } from './routes/healthcheck';

const app = express();

app.use(logger('dev') as RequestHandler);
app.use(express.json() as RequestHandler);
app.use(express.urlencoded({ extended: false }) as RequestHandler);

app.use('/api', apiRoute);
app.use('/healthcheck', healthCheckRoute);

export default app;
