import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class IsUserGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
