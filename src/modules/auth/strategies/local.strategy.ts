import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super();
  }
  async validate(username: string, password: string): Promise<unknown> {
    const e = await this.authService.validateUser(username, password);
    if (!e) {
      throw new UnauthorizedException();
    }
    return e;
  }
}
