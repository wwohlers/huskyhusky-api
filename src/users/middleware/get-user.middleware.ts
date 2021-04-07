import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import {UsersService} from "../users.service";
import { AuthorizedRequest } from '../interfaces/authorized-request.interface';

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
  constructor(
    private userService: UsersService
  ) {}

  /**
   * Gets the requesting User, if any, based on the bearer token.
   * @param req
   * @param res
   * @param next
   */
  async use(req: AuthorizedRequest, res: Response, next: () => void) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
      // Get token from "Bearer <token>"
      const token = bearerHeader.split(' ')[1];
      if (token) {
        try {
          req.token = token;
          req.user = await this.userService.getUserByToken(token);
        } catch (e) {
          // do nothing
        }
      }
    }
    next();
  }
}
