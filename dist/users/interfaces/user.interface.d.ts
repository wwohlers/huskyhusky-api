import { Document } from 'mongoose';
export interface User extends Document {
    name: string;
    email: string;
    password: string;
    tokens: string[];
    admin: boolean;
    resetKey: string;
    removed: boolean;
    bio: string;
    createdAt: number;
}
