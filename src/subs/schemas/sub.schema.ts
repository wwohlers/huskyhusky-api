import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

const now = () => Math.floor(Date.now() / 1000);

export const SubSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
    default: now
  }
})
