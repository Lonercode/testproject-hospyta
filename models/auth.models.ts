import mongoose, { Schema, Document, model } from 'mongoose';

// Define an interface for the user document
export interface IAuth extends Document {
    profileImage: string;
    name: string;
    email: string;
    password: string;
    verified: boolean;
}

// Define the schema for the user model
const authSchema: Schema<IAuth> = new Schema({
    profileImage: {
        type: String,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true,
        maxlength: 30,
        minlength: 6 
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true,
        minlength: 8 
    },
    verified: {
        type: Boolean,
        default: false
    }
});

// Create and export the model
const AuthModel = model<IAuth>('Auth', authSchema);

export default AuthModel;
