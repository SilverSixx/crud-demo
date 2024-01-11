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
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Public } from 'src/modules/auth/guards/is-public.decorator';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

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
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }

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
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string): Promise<DataResponse<unknown>> {
    try {
      const employee = await this.employeeService.findOne(+id);
      return ResponseHelper.success(employee, 'Employee fetched successfully');
    } catch (error) {
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }

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
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string): Promise<DataResponse<unknown>> {
    try {
      const employee = await this.employeeService.remove(+id);
      return ResponseHelper.success(employee, 'Employee removed successfully');
    } catch (error) {
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }
}
