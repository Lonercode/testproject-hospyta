import { IAuth } from '../models/auth.models';

declare global {
    namespace Express {
        interface Request {
            user?: IAuth;
        }
    }
}