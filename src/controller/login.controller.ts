import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginService } from '../service/login.service';
import { UserDto } from 'src/dto/login.dto';

@ApiTags('login/signup')
@Controller('api')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    type: UserDto,
    description: 'User information for login',
  })
  @ApiResponse({
    status: 200,
    description: 'Return access token',
    type: String,
  })
  async login(@Body() userDto: UserDto): Promise<{ access_token: string }> {
    return this.loginService.login(userDto.username, userDto.password);
  }
}
