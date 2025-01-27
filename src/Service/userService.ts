import { InitializeUserIndex } from '../config/Indexes.config';
import User from '../Models/UserModel';
import { BadRequestException } from '../utils/HttpErrors';
import logger from '../utils/Logging';

export const getUsersData = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string,
  active: boolean
) => {
  InitializeUserIndex();

  //$facet: this is an aggregation stage that allows you to run multiple pipelines (sub-pipelines) within the same query.
  const usersData = await User.aggregate([
    { $match: { isActive: active } },
    {
      $facet: {
        users: [
          { $sort: { [sortBy as string]: order === 'asc' ? 1 : -1 } }, // sort before skip always
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $project: { password: 0, updatedAt: 0 } },
        ],
        totalUsers: [{ $count: 'count' }],
      },
    },
    { $project: { 'users.password': 0, 'users.updatedAt': 0 } },
  ]);

  const users = usersData[0]?.users || [];
  const totalUsers = usersData[0]?.totalUsers[0]?.count || 0;

  return {
    users,
    totalUsers,
    totalPages: Math.ceil(totalUsers / Number(limit)),
    currentPage: Number(page),
  };
};

export const getuserDataById = async (id: string) => {
  const userData = await User.findById(id).select('-password');
  if (!userData) {
    logger.error('Bad Request: User does not exist for this id');
    throw new BadRequestException('User does not exist for this id');
  }
  return userData;
};
