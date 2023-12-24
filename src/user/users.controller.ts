import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { Users } from './user.entity';
import { UserService } from './user.service';
import { EmployeeGuard } from '../guard/employee.guard';
import { AdminGuard } from '../guard/admin.guard';
import { Roles } from '../decorator/roles.decorator';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<Users[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() user: Partial<Users>): Promise<Users> {
    return this.userService.createUser(user);
  }
}
