import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Connected to MongoDB: ${conn.connection.name}`);
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
