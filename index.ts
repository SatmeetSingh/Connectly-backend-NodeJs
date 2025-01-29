import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './src/utils/Logging.js';
import limiter from './src/utils/RateLimiting.js';
import { BadRequestException } from './src/utils/HttpErrors.js';

import { errorHandler } from './src/middlware/ErrorHandlerMiddleware.js';
import { AsyncMiddleware } from './src/middlware/AsyncMiddleware.js';

import { errorCodeEnum } from './src/enum/errrorCode.enum.js';

import { config } from './src/config/app.config.js';
import { HTTPSTATUS } from './src/config/http.config.js';
import ConnectDatabase from './src/config/database.config.js';

// Routers
import userRouter from './src/routes/UserRouter.js';
import authRouter from './src/routes/AuthRouter.js';

const app = express();
const baseurl = config.BaseURL;
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // Enable CORS for all routes
app.use(limiter);

app.get(
  `/`,
  AsyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    if (Math.random() > 0.9) {
      throw new BadRequestException(
        'This is a bad request',
        errorCodeEnum.AUTH_INVALID_TOKEN
      );
    }
    logger.info('Hello to follow and share conectly page ');
    return res.status(HTTPSTATUS.OK).json({
      message:
        'Hello to follow and share conectly page , this is home route(/)',
    });
  })
);

app.use(`${baseurl}/users`, userRouter);
app.use(`${baseurl}/auth`, authRouter);

app.use(errorHandler);

app.listen(config.Port, () => {
  logger.info(`Server started carefully at http://localhost:${config.Port}`);
  ConnectDatabase();
});
