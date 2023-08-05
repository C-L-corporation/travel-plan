import dotenv from 'dotenv';
import { connect } from 'mongoose';
import { accessGCSecret } from '.';

dotenv.config();

const { NODE_ENV, MONGODB_URL } = process.env;

const getDbUrl = async (): Promise<string> => {
  if (NODE_ENV === 'development') {
    if (!MONGODB_URL) throw new Error('MONGODB_URL not set');
    return MONGODB_URL;
  } else {
    const mongodbUrl = await accessGCSecret('MONGODB_URL');
    return mongodbUrl;
  }
};

// Connect to MongoDB
export const connectToDb = async () => {
  try {
    const url = await getDbUrl();
    await connect(url);
    console.info('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
};
