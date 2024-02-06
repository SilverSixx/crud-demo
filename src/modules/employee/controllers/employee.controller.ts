import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { DataResponse, ResponseHelper } from '../helper/data-response.helper';
import { HttpExceptionHandler } from '../helper/ex-response.handler';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Public } from 'src/modules/auth/guards/is-public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiOperation({ summary: 'Create new employee' })
  @ApiBody({
    type: CreateEmployeeDto,
    description: 'Needed infos to create a new employee',
  })
  @ApiResponse({
    status: 201,
    description:
      'Return a standard json message object that shows successful creation of the company',
    type: DataResponse<unknown>,
  })
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<DataResponse<unknown>> {
    try {
      const employee = await this.employeeService.create(createEmployeeDto);
      return ResponseHelper.success(employee, 'Employee created successfully');
    } catch (error) {
      return HttpExceptionHandler.handle(error);
    }
  }

  @ApiOperation({
    summary: 'Fetch all employees',
  })
  @ApiResponse({
    status: 200,
    description:
      'Return a standard json message object that shows successful fetch of the employees',
    type: DataResponse<unknown>,
  })
  @Get()
  @Public()
  async findAll(): Promise<DataResponse<unknown>> {
    try {
      const employees = await this.employeeService.findAll();
      return ResponseHelper.success(
        employees,
        'Employees fetched successfully',
      );
    } catch (error) {
      return HttpExceptionHandler.handle(error);
    }
  }

  @ApiOperation({
    summary: 'Fetch 1 specific employee',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the employee to fetch',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description:
      'Return a standard json message object that shows successful fetch of the employee',
    type: DataResponse<unknown>,
  })
  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string): Promise<DataResponse<unknown>> {
    try {
      const employee = await this.employeeService.findOne(+id);
      return ResponseHelper.success(employee, 'Employee fetched successfully');
    } catch (error) {
      return HttpExceptionHandler.handle(error);
    }
  }

  @ApiOperation({ summary: 'Update employee' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the employee to update',
    type: Number,
  })
  @ApiBody({
    type: UpdateEmployeeDto,
    description: 'Needed infos to update an employee',
  })
  @ApiResponse({
    status: 200,
    description:
      'Return a standard json message object that shows successful update of the employee',
    type: DataResponse<unknown>,
  })
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<DataResponse<unknown>> {
    try {
      const employee = await this.employeeService.update(
        +id,
        updateEmployeeDto,
      );
      return ResponseHelper.success(employee, 'Employee updated successfully');
    } catch (error) {
      return HttpExceptionHandler.handle(error);
    }
  }

  @ApiOperation({ summary: 'Delete employee' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the employee to delete',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description:
    'Return a standard json message object that shows successful deletion of the employee',
    type: DataResponse<unknown>,
  })
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string): Promise<DataResponse<unknown>> {
    try {
      const employee = await this.employeeService.remove(+id);
      return ResponseHelper.success(employee, 'Employee removed successfully');
    } catch (error) {
      return HttpExceptionHandler.handle(error);
    }
  }
}
