import mongoose from 'mongoose';
import { config } from './app.config';
import logger from '../utils/Logging';

const ConnectDatabase = async () => {
  try {
    await mongoose.connect(config.MongoURL);
    logger.info('Connected to mongoDB Database');
  } catch (error) {
    logger.error('Error connecting to MongoDB database: ', error);
  }
};

export default ConnectDatabase;
