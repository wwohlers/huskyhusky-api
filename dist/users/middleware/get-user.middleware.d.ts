import { NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from "../users.service";
import { AuthorizedRequest } from '../interfaces/authorized-request.interface';
export declare class GetUserMiddleware implements NestMiddleware {
    private userService;
    constructor(userService: UsersService);
    use(req: AuthorizedRequest, res: Response, next: () => void): Promise<void>;
}
