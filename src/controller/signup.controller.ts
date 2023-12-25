import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SignupService } from '../service/signup.service';
import { CreateUserDto } from 'src/dto/signup.dto';

@ApiTags('login/signup')
@Controller('api')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User information for sign up',
  })
  @ApiResponse({
    status: 200,
    description: 'Sign up successfully',
    type: String,
  })
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    return this.signupService.signup(createUserDto);
  }
}
