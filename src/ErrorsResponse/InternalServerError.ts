import { Response } from 'express';
import logger from '../utils/Logging';
import { HTTPSTATUS } from '../config/http.config';

export const InternalServerErrorResponse = (
  res: Response,
  error: unknown,
  Message: string
) => {
  if (error instanceof Error) {
    logger.error(`${Message}: ${error.message}`, {
      stack: error.stack,
    });
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      status: HTTPSTATUS.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error. Please try again later.',
    });
  } else {
    logger.error('Unknown error occurred', { error });
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error. Please try again later.',
    });
  }
};
