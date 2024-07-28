import express, { Express } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import Routes from './routes/route.routes';

// Initialize Express application
const app: Express = express();

// for frontend 'link' anytime...possibly with React
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionSuccessStatus: 200,
  methods: ["POST", 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
};

// Middleware setup
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors(corsOptions));

// Use journalRoutes for the "/otu-heart" route
app.use('/users', Routes);

// Export the app
export default app;
