import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { Users } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { AdminGuard } from '../guard/admin.guard';
import { Roles } from '../decorator/roles.decorator';
import { CreateUserDto } from 'src/dto/signup.dto';
import { TokenGuard } from 'src/guard/token.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('any')
  @UseGuards(TokenGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: Users,
    isArray: true,
  })
  async getAllUsers(): Promise<Users[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  @Roles('admin')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User information for creation',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: String,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createUser(@Body() user: CreateUserDto): Promise<string> {
    return this.userService.createUser(user);
  }

  @Post('update')
  @Roles('admin')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update existing user or create' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User information for update or creation',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated or created successfully',
    type: String,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateUser(@Body() user: CreateUserDto): Promise<String> {
    return this.userService.updateUser(user);
  }
}
