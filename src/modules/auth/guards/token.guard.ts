import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class TokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);
    return !token;
  }

  private extractTokenFromRequest(request: any): string | null {
    const token = request.headers.authorization;
    return token ? token.replace('Bearer ', '') : null;
  }
}
