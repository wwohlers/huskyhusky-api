import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IsAdminGuard implements CanActivate {
  /**
   * Ensure that there is a requesting User, and that they are an admin.
   * @param context
   */
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user;
    return user && user.admin === true;
  }
}
