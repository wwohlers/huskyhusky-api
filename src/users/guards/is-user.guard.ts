import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IsUserGuard implements CanActivate {
  /**
   * Ensure that there is a requesting User.
   * @param context
   */
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user;
    return !!user; // !! converts User to boolean
  }
}
