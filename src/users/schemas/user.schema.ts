import * as mongoose from 'mongoose';
import {Types} from 'mongoose';

const now = () => Math.floor(Date.now() / 1000);

/**
 * Defines a User document in the database.
 */
export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: {
    type: [String],
  },
  admin: {
    type: Boolean,
    default: false,
  },
  resetKey: {
    type: String,
  },
  removed: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
  },
  createdAt: {
    type: Number,
    required: true,
    // Default to now
    default: now
  },
})
