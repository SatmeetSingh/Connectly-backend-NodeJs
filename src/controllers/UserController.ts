import { Request, Response } from 'express';
import { getuserDataById, getUsersData } from '../Service/userService';
import { HTTPSTATUS } from '../config/http.config';
import { AsyncMiddleware } from '../middlware/AsyncMiddleware';
import logger from '../utils/Logging';
import { Http } from 'winston/lib/winston/transports';
import { InternalServerErrorResponse } from '../ErrorsResponse/InternalServerError';
import { BadRequestResponse } from '../ErrorsResponse/BadRequestError';
import { NotFoundErrorResponse } from '../ErrorsResponse/NotFoundError';

export const getUsers = AsyncMiddleware(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
    active = true,
  } = req.query;

  logger.info(`Received GET request to /users with 'page' param: ${page}`);
  if (
    typeof page === 'number' &&
    typeof limit === 'number' &&
    typeof sortBy === 'string' &&
    typeof order === 'string' &&
    typeof active === 'boolean'
  ) {
    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      BadRequestResponse(res, 'Invalid Pagination Parameter in ');
    }
    try {
      const { users, totalUsers, totalPages, currentPage } = await getUsersData(
        page,
        limit,
        sortBy,
        order,
        active
      );

      if (!users.length) {
        NotFoundErrorResponse(res, `Users not found in page:${page} `);
      }
      logger.http('GET /users request processed with status 200');
      logger.info(
        `Successfully fetched ${users.length} users for page ${page}`
      );
      return res.status(HTTPSTATUS.OK).json({
        message: 'Users fetched Successfully',
        data: users,
        pagination: {
          totalPages,
          currentPage,
          users: totalUsers,
          limit: limit,
        },
      });
    } catch (error: unknown) {
      InternalServerErrorResponse(
        res,
        error,
        'Error occurred while fetching users:'
      );
    }
  } else {
    BadRequestResponse(res, 'Invalid Pagination Parameter in /api/users');
  }
});

export const getuserByid = AsyncMiddleware(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const userData = await getuserDataById(id);
    logger.info(`User with username: ${userData} is fetched successfully`);

    return res.status(HTTPSTATUS.OK).json({
      message: 'User fetch successfully',
      user: userData,
    });
  }
);
