import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import NewUsers from '../models/auth.models';
import { CustomRequest, IUser } from '../types';

dotenv.config();

const protect = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tokenAll = req.headers.authorization;

    if (!tokenAll) {
      res.status(401).json({ message: 'Unauthorized or expired login' });
      return;
    }

    const tokenPart = tokenAll.split(' ');
    const token = tokenPart[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized or expired login' });
      return;
    }

    let decoded: any;

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decode) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized or expired login' });
        return;
      }
      decoded = decode;
    });

    if (decoded) {
      const user = await NewUsers.findById(decoded._id) as IUser;

      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: 'Unauthorized Here!' });
      }
    } else {
      res.status(401).json({ message: 'Unauthorized token!' });
    }
  } catch (err) {
    // Narrowing down `err` type using type guards or type assertions
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export default protect;
