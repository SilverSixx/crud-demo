import { Module } from '@nestjs/common';
import { EmployeeService } from './services/employee.service';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeRepository } from './repo/employee.repo';
import { CompanyRepository } from '../company/repos/company.repo';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository, CompanyRepository],
  exports: [EmployeeService, EmployeeRepository],
})
export class EmployeeModule {}
