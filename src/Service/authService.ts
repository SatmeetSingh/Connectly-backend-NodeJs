import { BADQUERY } from 'node:dns';
import { BadRequestResponse } from '../ErrorsResponse/BadRequestError';
import User from '../Models/UserModel';
import { compareValue, hashValue } from '../utils/Bcrypt';
import { BadRequestException } from '../utils/HttpErrors';
import logger from '../utils/Logging';
import {
  AccessTokenGenertion,
  RefreshTokenGenertion,
} from '../utils/GenerateToken';

export const registerUser = async (body: {
  name: string;
  userName: string;
  email: string;
  password: string;
}) => {
  try {
    const { name, userName, email, password } = body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      logger.error(`User Already exist with Email : ${email}`);
      throw new BadRequestException('User Already Exists');
    }
    const hashedPassword = await hashValue(password, 10);
    const newUser = await User.create({
      name,
      userName,
      email: email,
      password: hashedPassword,
    });

    logger.info(`New user with name ${newUser.name} is created successfully`);

    return newUser;
  } catch (error) {
    logger.error('Error creating user:', error);
  }
};

export const loginUser = async (body: { email: string; password: string }) => {
  const { email, password } = body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new BadRequestException('User does not exist!');
  }
  const passwordMatch = await compareValue(password, user.password);
  if (!passwordMatch) {
    throw new BadRequestException('Wrong Password: Password does not match');
  }
  const payload = {
    email: user.email,
    password: user.password,
  };
  const AccessToken = AccessTokenGenertion(payload);
  const RefreshToken = RefreshTokenGenertion(user.email);
  return { user, AccessToken, RefreshToken };
};
