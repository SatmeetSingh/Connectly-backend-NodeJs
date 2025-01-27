import User from '../Models/UserModel';
import logger from '../utils/Logging';

export const InitializeUserIndex = async () => {
  try {
    await User.syncIndexes();
    logger.info('Indexes synced successfully');
  } catch (error) {
    logger.error('Error syncing indexes:', error);
  }
};
