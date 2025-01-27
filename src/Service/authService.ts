import { BadRequestResponse } from '../ErrorsResponse/BadRequestError';
import User from '../Models/UserModel';
import { hashValue } from '../utils/Bcrypt';
import { BadRequestException } from '../utils/HttpErrors';
import logger from '../utils/Logging';

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

    const newUser = await User.create({
      name,
      userName,
      email: email.toLowerCase(),
      password: hashValue(password, 10),
    });

    logger.info(`New user created : ${newUser}`);

    return newUser;
  } catch (error) {
    logger.error('Error creating user:', error);
  }
};
