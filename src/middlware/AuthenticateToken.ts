import { NextFunction, Request, Response } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import jwt from 'jsonwebtoken';
import { config } from '../config/app.config';
import logger from '../utils/Logging';

const SECRET_KEY: string = config.JWTAccessSecretKeyForToken.toString();

export const AuthenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Access Denied' });
    } else {
      const verify = await jwt.verify(token.split(' ')[1], SECRET_KEY);
      req.body = verify;
      next();
    }
  } catch (error) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'Invalid token' });
  }
};
