import * as dotenv from 'dotenv';
import app from './app';
import db from './db';

dotenv.config();

const port = process.env.PORT || 3600

db.once('open', () => {
  console.log("Database Connected");
  app.listen(port, () => {
    console.log(`Server connected at port ${port}`);
  });
});

db.on('error', (err) => console.error(`Database connection error: ${err}`));
