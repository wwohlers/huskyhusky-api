import { Document } from 'mongoose';
export interface Sub extends Document {
    email: string;
    createdAt: number;
}
