import mongoose, { Schema, Document } from 'mongoose';
import auth from '../models/auth.models';

export const categoryEnum = ['kidney', 'headache', 'stomacheache', 'leg pain', 'malaria'] as const;

export interface IEntry extends Document {
    image: string;
    title: string;
    content: string;
    category: typeof categoryEnum[number];
    user: mongoose.Types.ObjectId;
    date: Date;
    upvotes: number;
    downvotes: number;
}

// Entry schema
const entrySchema: Schema = new Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: categoryEnum
      },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'auth'
    },
    date: {
        type: Date,
        default: Date.now
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Create and export the model
const EntryModel = mongoose.model<IEntry>('entry', entrySchema);

export default EntryModel;
