import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/users.repository';
import { Users } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dto/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getAllUsers(): Promise<Users[]> {
    return this.userRepository.find();
  }

  async createUser(userDto: CreateUserDto): Promise<string> {
    const newUser = new Users();
    console.log(userDto);
    newUser.user_name = userDto.username;
    newUser.user_password = await bcrypt.hash(userDto.password, 10);
    newUser.user_role = userDto.role;
    await this.userRepository.save(newUser);
    return 'Create user successfully';
  }

  async usernameExists(username: string): Promise<Boolean> {
    return this.userRepository.isUsernameExists(username);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Users | null> {
    const user = await this.userRepository.findOne({
      where: { user_name: username },
    });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.user_password);
      if (passwordMatch) {
        return user;
      }
    }
    return null;
  }

  async getUserRole(user_name: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { user_name: user_name },
    });
    return user.user_role;
  }

  async updateUser(userDto: CreateUserDto): Promise<string> {
    const { username, password, role } = userDto;

    const user = await this.userRepository.findOne({
      where: { user_name: username },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    if (password) {
      user.user_password = await bcrypt.hash(password, 10);
    }

    if (role) {
      user.user_role = role;
    }
    await this.userRepository.save(user);
    return 'User updated successfully';
  }
}
