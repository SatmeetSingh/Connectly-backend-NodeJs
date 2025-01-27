import { NextFunction, Request, Response } from 'express';
import validator from 'validator';
import { BadRequestException } from '../utils/HttpErrors';

export const emailValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    throw new BadRequestException('Invalid email format');
  }

  next(); // Continue to the next middleware or route handler
};
