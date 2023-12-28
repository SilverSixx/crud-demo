import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { TokenGuard } from '../../auth/guards/token.guard';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {
  }

  @Post()
  @Roles('admin')
  @UseGuards(TokenGuard)
  @UseGuards(AdminGuard)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @UseGuards(TokenGuard)
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @UseGuards(TokenGuard)
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(TokenGuard)
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(TokenGuard)
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
