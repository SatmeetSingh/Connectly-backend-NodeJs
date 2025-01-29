import jwt from 'jsonwebtoken';
import { config } from '../config/app.config';
import logger from './Logging';

const AccessSecretKey: string = config.JWTAccessSecretKeyForToken.toString();
const RefreshSecretKey: string = config.JWTRefreshSecretKeyForToken.toString();
/**
 * Function to generate a JWT token
 * @param {Object} userPayload - Data to be included in the token (e.g., user ID, username)
 * @param {string} [expires='1h'] - Access token expires in (time- '1h')
 * @returns {string} - JWT token
 */
export const AccessTokenGenertion = (userPayload: Object, expires = '1h') => {
  try {
    // Generate the JWT token
    const Accesstoken = jwt.sign(userPayload, AccessSecretKey, {
      expiresIn: expires,
    } as jwt.SignOptions);
    logger.info('JWT token is generated');
    return Accesstoken;
  } catch (error) {
    logger.error('Error generating token:', error);
    throw new Error('Could not generate token');
  }
};

export const RefreshTokenGenertion = (userPayload: string, expires = '7d') => {
  try {
    // Generate the JWT token
    const Refreshtoken = jwt.sign(userPayload, RefreshSecretKey, {
      expiresIn: expires,
    } as jwt.SignOptions);
    logger.info('JWT token is generated');
    return Refreshtoken;
  } catch (error) {
    logger.error('Error generating token:', error);
    throw new Error('Could not generate token');
  }
};
