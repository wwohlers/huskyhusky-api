import { Document } from 'mongoose';
import { Comment } from './comment.interface';
import { User } from '../../users/interfaces/user.interface';

/**
 * Represents an Article object.
 */
export interface Article extends Document {
  author: string | User;
  name: string;
  title: string;
  tags: string[];
  brief: string;
  image: string;
  attr: string;
  text: string;
  public: boolean;
  clicks: number;
  comments: Comment[];
  updatedAt: number;
  createdAt: number;
}
