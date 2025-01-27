import dotenv from 'dotenv';
import { GetEnv } from '../utils/GetEnv.js';
dotenv.config();

const appConfig = () => ({
  NodeENV: GetEnv('NODE_ENV', 'development'),
  Port: GetEnv('PORT', '7000'),
  BaseURL: GetEnv('BASE_URL', '/api'),
  MongoURL: GetEnv('MONGO_URI', ''),
});

export const config = appConfig();
