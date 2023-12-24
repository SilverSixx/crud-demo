import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const userRole = await this.userService.getUserRole(username);
    const payload = { username: user.user_name, role: userRole };
    const access_token = this.jwtService.sign(payload, {
      secret: 'key',
      expiresIn: 300
    });
    return { access_token };
  }
}
