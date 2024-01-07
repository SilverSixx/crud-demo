import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/signup.dto';
import { DataResponse, ResponseHelper } from '../helper/data-response.helper';
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
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const access_token = await this.authService.login(req.user);
      return ResponseHelper.success(
        access_token,
        'Employee login successfully',
      );
    } catch (error) {
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error'
      );
    }
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
  @HttpCode(201)
  async signup(@Body() signUpDto: SignUpDto): Promise<DataResponse<unknown>> {
    try {
      const user = await this.authService.signup(signUpDto);
      return ResponseHelper.success(user, 'Sign up successful');
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error');
    }
  }
}
