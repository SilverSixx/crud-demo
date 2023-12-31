import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || !roles.includes('admin')) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);
    const tokenData = this.verifyToken(token);

    if (!tokenData) {
      throw new UnauthorizedException('Token verification failed');
    }

    const { email, role } = tokenData;

    if (!email || role !== 'admin') {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }

  private extractTokenFromRequest(request: any): string | null {
    const token = request.headers.authorization;
    return token ? token.replace('Bearer ', '') : null;
  }

  private verifyToken(
    token: string,
  ): { email: string; role: string } | null {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: 'key',
      });
      return decoded as { email: string; role: string };
    } catch (error) {
      return null;
    }
  }
}
