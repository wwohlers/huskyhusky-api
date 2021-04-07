import { Request } from 'express';
import { User } from './user.interface';

export interface AuthorizedRequest extends Request {
  user: User | null;
  token: string | null;
}
