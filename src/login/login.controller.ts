import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { UserDto } from 'src/dto/login.dto';

@Controller('api')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  async login(@Body() userDto: UserDto): Promise<{ access_token: string }> {
    return this.loginService.login(userDto.username, userDto.password);
  }
}
