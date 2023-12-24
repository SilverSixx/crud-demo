import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
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

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    await this.userService.createUser({
      user_name: createUserDto.username,
      user_password: hashedPassword,
      user_role: createUserDto.role
    });

    return { message: 'User created successfully' };
  }
}
