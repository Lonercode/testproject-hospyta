import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import Entry, { IEntry, categoryEnum } from '../models/posts.models';
import User from '../models/auth.models';

dotenv.config();

// Type definitions for request files and user
interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

// Middleware type definitions
interface CustomRequest extends Request {
    user?: any; 
}

// All entries of all users are gotten.

const getAllEntries = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const entries = await Entry.find({});
        res.status(200).json({ message: entries });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

// Entries of user presently authenticated - able to access his/her own posts.

const getEntries = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const entries = await Entry.find({
            user: req.user
        });
        res.status(200).json({ message: entries });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

const getEntry = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const entry = await Entry.findOne({ _id: req.query._id as string, user: req.user });
        res.status(200).json({ message: entry, id: entry?._id });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

const createEntry = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const image = req.file;
    
        const { title, content, category } = req.body;

       
        if (!categoryEnum.includes(category)) {
            res.status(400).json({ message: 'Invalid category' });
            return;
        }

        const entry = await Entry.create({
            image: image?.path,
            title,
            content,
            category,
            user: req.user
        });
        
        res.status(201).json({ message: "Entry created successfully :)" });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

const updateEntry = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const entry = await Entry.findOne({ _id: req.query._id as string, user: req.user });

        if (entry) {
            await Entry.findOneAndUpdate(
                { _id: req.query._id as string },
                {
                    $set: {
                        title: req.body.title,
                        content: req.body.content,
                        category: req.body.category
                    }
                },
                { new: true }
            );

            await entry.save();
            res.status(200).json({ message: "Edit successful :)" });
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

const deleteEntry = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await Entry.findOne({ user: req.user });
        const entry = await Entry.findOne({ _id: req.query._id as string, user: req.user });
        if (user) {
            await Entry.findOneAndDelete({ _id: req.query._id as string });
            res.status(200).json({ message: "Delete successful :)", id: entry?._id });
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};
//upvoting posts

const upvoteEntry = async (req: Request, res: Response): Promise<void> => {
    try {
        const entryId = req.query._id;
        const entry = await Entry.findById(entryId);

        if (!entry) {
            res.status(404).json({ message: 'Entry not found' });
            return;
        }

        entry.upvotes += 1;
        await entry.save();
        
        res.status(200).json({ message: 'Upvoted successfully', entry });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

// Downvote an entry
const downvoteEntry = async (req: Request, res: Response): Promise<void> => {
    try {
        const entryId = req.query._id;
        const entry = await Entry.findById(entryId);

        if (!entry) {
            res.status(404).json({ message: 'Entry not found' });
            return;
        }

        entry.downvotes += 1;
        await entry.save();
        
        res.status(200).json({ message: 'Downvoted successfully', entry });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

//get posts that are sorted by category, date and upvote number

const getPostsSorted = async (req: Request, res: Response): Promise<void> => {
    const { category } = req.query; 
    const filter: { category?: string } = {};
    
    if (category) {
        filter.category = category as string;
    }

    try {
        // Fetch and sort posts by category, creation time (descending), and upvote number(descending)
        const posts: IEntry[] = await Entry.find(filter).sort({ createdAt: -1, upvotes: -1 }).exec();

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};


export {
    getAllEntries,
    getEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    upvoteEntry,
    downvoteEntry,
    getPostsSorted
};
