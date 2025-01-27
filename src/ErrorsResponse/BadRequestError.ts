import { Response } from 'express';
import logger from '../utils/Logging';
import { HTTPSTATUS } from '../config/http.config';

export const BadRequestResponse = (res: Response, message: string) => {
  logger.error(message);
  return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: message });
};
