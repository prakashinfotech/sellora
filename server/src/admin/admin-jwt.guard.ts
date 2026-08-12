import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const { user } = context.switchToHttp().getRequest();
    if (user?.role !== 'admin') throw new ForbiddenException('Admins only');
    return true;
  }
}
