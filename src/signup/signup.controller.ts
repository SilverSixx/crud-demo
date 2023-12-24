import { Controller, Post, Body } from '@nestjs/common';
import { SignupService } from './signup.service';
import { CreateUserDto } from 'src/dto/signup.dto';


@Controller('api')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    return this.signupService.signup(createUserDto);
  }
}
