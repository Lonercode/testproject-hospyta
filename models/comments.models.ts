import mongoose, { Schema, Document } from 'mongoose';
import auth from '../models/auth.models'; 

export interface IComment extends Document {
    entry: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    content: string;
    replies: mongoose.Types.ObjectId[];
    date: Date;
}

const commentSchema: Schema = new Schema({
    entry: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'entry'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'auth'
    },
    content: {
        type: String,
        required: true
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const CommentModel = mongoose.model<IComment>('comment', commentSchema);

export default CommentModel;
