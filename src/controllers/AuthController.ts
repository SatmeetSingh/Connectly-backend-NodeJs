import { Request, Response } from 'express';
import { AsyncMiddleware } from '../middlware/AsyncMiddleware';
import { registorValidate } from '../Validations/AuthValidation';
import { z } from 'zod';
import { HTTPSTATUS } from '../config/http.config';
import logger from '../utils/Logging';
import { registerUser } from '../Service/authService';
import { BadRequestException } from '../utils/HttpErrors';

export const RegisterUser = AsyncMiddleware(
  async (req: Request, res: Response) => {
    try {
      const body = registorValidate.parse({
        ...req.body,
      });
      logger.info(`body: ${body} has been Parsed`);

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
          .send('Internal server error');
      }
    }
  }
);
