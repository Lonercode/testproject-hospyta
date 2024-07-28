import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URI: string;
    }
  }
}

if (!process.env.DB_URI) {
  throw new Error('DB_URI is not defined in the environment variables');
}

const dbURI: string = process.env.DB_URI;

mongoose.connect(dbURI)
  .then(() => console.log("Database Connected"))
  .catch((err: Error) => console.log(`An error occurred: ${err.message}`));

const db = mongoose.connection;

db.on('error', (err) => console.log(`An error occurred: ${err}`));
db.on('connected', () => console.log('Mongoose connected to DB Cluster'));
db.on('disconnected', () => console.log('Mongoose Disconnected'));

export default db;
