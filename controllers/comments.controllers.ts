import { Request, Response } from 'express';
import Comment, { IComment }  from '../models/comments.models';
import Entry from '../models/posts.models';
import mongoose from 'mongoose';
import { CustomRequest } from '../types';

const addComment = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { entryId, content } = req.body;
        const userId = req.user._id;

       
        const entry = await Entry.findById(entryId);
        if (!entry) {
            res.status(404).json({ message: 'Entry not found' });
            return;
        }

        // Create a new comment
        const newComment = new Comment({
            entry: entryId,
            user: userId,
            content
        });

     
        await newComment.save();


        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};


const replyToComment = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { commentId, content } = req.body;
        const userId = req.user._id;

        // Find the parent comment
        const parentComment = await Comment.findById(commentId) as IComment | null;
        if (!parentComment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        // Create a new reply
        const reply: IComment = new Comment({
            entry: parentComment.entry,
            user: userId,
            content,
            replies: [] 
        });

       
        await reply.save();

        // Add the reply to the parent comment's replies
        if (parentComment.replies) {
            parentComment.replies.push(reply._id as mongoose.Types.ObjectId);
            await parentComment.save();
        } else {
            
            parentComment.replies = [reply._id as mongoose.Types.ObjectId];
            await parentComment.save();
        }

        res.status(201).json({ message: 'Reply added successfully', reply });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

const getPostComments = async (req: Request, res: Response): Promise<void>  => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ entry: postId })
            .populate('content') 
            .exec();

        if (!comments) {
            res.status(404).json({ message: 'No comments found for this post' });
            return;
        }

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}
export {
    addComment,
    replyToComment,
    getPostComments
}