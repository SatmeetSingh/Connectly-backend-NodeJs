import { Request, Response } from 'express';
import { AsyncMiddleware } from '../middlware/AsyncMiddleware';
import { loginValidate, registorValidate } from '../Validations/AuthValidation';
import { z } from 'zod';
import { HTTPSTATUS } from '../config/http.config';
import logger from '../utils/Logging';
import { loginUser, registerUser } from '../Service/authService';
import { BadRequestException } from '../utils/HttpErrors';
import jwt from 'jsonwebtoken';
import {
  AccessTokenGenertion,
  RefreshTokenGenertion,
} from '../utils/GenerateToken';
import { config } from '../config/app.config';

export const RegisterUser = AsyncMiddleware(
  async (req: Request, res: Response) => {
    try {
      const body = registorValidate.parse({
        ...req.body,
      });
      logger.info(`Request: ${body} has been Parsed`);

      const response = await registerUser(body);
      if (response === undefined) {
        throw new BadRequestException('User already Exists');
      }
      return res.status(HTTPSTATUS.CREATED).json({
        message: 'User created successfully',
        user: response,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors.map((e) => e.message);
        res.status(400).json({ errors: errorMessages });
      } else {
        res
          .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
      }
    }
  }
);

export const LoginUser = AsyncMiddleware(
  async (req: Request, res: Response) => {
    logger.info(`Login Request has been sent`);
    try {
      const body = await loginValidate.parse({
        ...req.body,
      });
      logger.info(`Request body has been Parsed`);

      const response = await loginUser(body);
      response.user.omitPassword();
      res.cookie('refreshToken', response.RefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict', // Helps prevent CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (adjust as needed)
      });
      return res.status(HTTPSTATUS.OK).json({
        message: 'Logged in successfully',
        user: response.user,
        token: response.AccessToken,
      });
    } catch (error) {
      res
        .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }
);

export const RefreshAccessToken = AsyncMiddleware(
  async (req: Request, res: Response) => {
    const RefreshSecretKey = config.JWTRefreshSecretKeyForToken.toString();

    const refreshToken = req.cookies.refreshToken; // Extract refresh token from cookie
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, RefreshSecretKey, (err: any, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: 'Invalid or expired refresh token' });
      }
      const accessToken = AccessTokenGenertion({
        email: decoded.email,
        password: decoded.password,
      });

      const newRefreshToken = RefreshTokenGenertion(decoded.email);
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
      }); // Set refresh token in cookie
      res.json({ accessToken });
    });
  }
);
