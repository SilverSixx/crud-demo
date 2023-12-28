import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/signup.dto';
import { DataResponse } from '../dto/data-response.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    type: LoginDto,
    description: 'User information for login',
  })
  @ApiResponse({
    status: 200,
    description: 'Return access token',
    type: String,
  })
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<DataResponse<unknown>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.login(req.user);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({
    type: SignUpDto,
    description: 'User information for sign up',
  })
  @ApiResponse({
    status: 200,
    description: 'Sign up successfully',
    type: String,
  })
  async signup(
    @Body() signUpDto: SignUpDto,
  ): Promise<DataResponse<unknown>> {
    return this.authService.signup(signUpDto);
  }
}
