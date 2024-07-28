import auth from '../models/auth.models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendMail from '../utils/sendMail';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types';

interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

// Define the shape of the user object
interface User {
    _id: string;
    profileImage: string;
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    verified?: boolean;
}

// Create token for registration
const createRegToken = (user: User): string => {
    const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );
    return token;
};

// Create token for other routes
const createToken = (user: User): string => {
    const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );
    return token;
};

// Register new users
const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const exists = await auth.findOne({ email: req.body.email }) as User;
        if (exists && exists.verified) {
            res.status(400).json({ message: "You already have an account with us. Please login :)" });
        } else {
            if (!req.file) {
                res.status(400).json({ message: "No file uploaded" });
                return;
            }
            const image = req.file;
        
            const newUser = {
                profileImage: image?.path,
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                confirmPassword: req.body.confirmPassword
            } as User;
            const equalPassword = await bcrypt.compare(newUser.confirmPassword || '', newUser.password);
            if (!equalPassword) {
                res.status(401).json({ message: "Both passwords must be the same" });
            } else {
                const person = await auth.create(newUser) as User;
                const userToken = createRegToken(person);
                const link = `http://localhost:3600/users/verifyAccount?id=${person._id}&token=${userToken}`;
                
                await sendMail(
                    person.email,
                    "Welcome to this App",
                    { name: person.name, link: link },
                    './templates/confirmUser.hbs'
                );

                res.status(201).json({
                    message: `Registration successful! Please note that you have 1 hour until the link expires :), ${person}`,
                    token: userToken,
                    id: person._id
                });
            }
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

// For when the registration link is expired; so a new token is obtained for registration
const expiredRegLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const regUser = await auth.findOne({ email: req.body.email }) as User;
        if (regUser && !regUser.verified) {
            const userToken = createRegToken(regUser);

            res.cookie("token", userToken, {
                httpOnly: false
            });


            const link = `http://localhost:3600/verifyAccount?id=${regUser._id}&token=${userToken}`;
            
            await sendMail(
                regUser.email,
                "Welcome to this App",
                { name: regUser.name, link: link },
                './templates/confirmUser.hbs'
            );

            res.status(201).json({
                message: "Registration successful! Check your email. Please note that you have 1 hour until the link expires :)"
            });
        } else {
            res.status(401).json({ message: "Register or Login" });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

// Confirm user signup with email verification link
const confirm = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user; 
        if (user) {
            await auth.findOneAndUpdate(  { _id: user._id }, { verified: true });
            await user.save();
            res.json({ message: "Account is confirmed" });
        } else {
            res.json({ message: "Please check your email or register" });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

// User login
const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await auth.findOne({ email: req.body.email }) as User;
        if (user) {
            const pass = await bcrypt.compare(req.body.password, user.password);
            if (pass && user.verified) {
                const userToken = createToken(user);
                res.status(200).json({
                    message: "You have successfully logged in",
                    token: userToken,
                    name: user.name
                });
            } else {
                res.status(401).json({ message: "You must register first or verify your account" });
            }
        } else {
            res.status(401).json({ message: "You must register first or verify your account" });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

// Forgot password link
const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await auth.findOne({ email: req.body.email }) as User;
        if (!user) {
            res.status(401).json({ message: "Please sign up for an account" });
        } else {
            const userToken = createToken(user);
            const link = `http://localhost:3600/users/resetPassword?id=${user._id}&token=${userToken}`;
            
            await sendMail(
                user.email,
                "Reset your password",
                { name: user.name, link: link },
                './templates/resetPassword.hbs'
            );

            res.status(201).json({
                message: "Check your email for the reset link :)",
                token: userToken
            });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

// Confirm reset link
const confirmReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.status(200).json({ message: "Valid link" });
};

// Reset password route
const resetPassword = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user; 
        if (user) {
            await auth.findOneAndUpdate(
                { _id: user._id },
                { password: await bcrypt.hash(req.body.password, 10) }
            );
            await user.save();
            res.json({ message: "Your password is reset. You can login now." });
        } else {
            res.json({ message: "Please check your email or register" });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};


// Export functions
export {
    signUp,
    confirm,
    expiredRegLink,
    login,
    forgotPassword,
    confirmReset,
    resetPassword
};
