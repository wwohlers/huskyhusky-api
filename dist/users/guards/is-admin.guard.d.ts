import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class IsAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
