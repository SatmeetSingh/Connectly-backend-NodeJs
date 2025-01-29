import dotenv from 'dotenv';
import { GetEnv } from '../utils/GetEnv.js';
dotenv.config();

const appConfig = () => ({
  NodeENV: GetEnv('NODE_ENV', 'development'),
  Port: GetEnv('PORT', '7000'),
  BaseURL: GetEnv('BASE_URL', '/api'),
  MongoURL: GetEnv('MONGO_URI', ''),

  JWTAccessSecretKeyForToken: GetEnv(
    'ACCESS_USER_LOGIN_JWT_SECRETKEY',
    'WriteAccessSecretKey'
  ),
  JWTRefreshSecretKeyForToken: GetEnv(
    'REFRESH_USER_LOGIN_JWT_SECRETKEY',
    'WriteRefreshSecretKey'
  ),
});

export const config = appConfig();
