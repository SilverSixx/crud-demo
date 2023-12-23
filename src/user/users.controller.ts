import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { EmployeeGuard } from '../authority/employee.guard';
import { AdminGuard } from '../authority/admin.guard';
import { Roles } from '../decorator/roles.decorator';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() user: Partial<User>): Promise<User> {
    return this.userService.createUser(user);
  }
}
