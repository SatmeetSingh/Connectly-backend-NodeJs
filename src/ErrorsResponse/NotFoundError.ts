import { Response } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import logger from '../utils/Logging';

export const NotFoundErrorResponse = (res: Response, message: string) => {
  logger.error(message);
  return res.status(HTTPSTATUS.NOT_FOUND).json({ message: message });
};
