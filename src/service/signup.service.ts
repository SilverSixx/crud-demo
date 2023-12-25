import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dto/signup.dto';

@Injectable()
export class SignupService {
  constructor(private readonly userService: UserService) {}

  async signup(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const usernameExists = await this.userService.usernameExists(
      createUserDto.username,
    );

    if (usernameExists) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userService.createUser(createUserDto);
    return { message: 'User created successfully' };
  }
}
