import { Module } from '@nestjs/common';
import { EmployeeService } from './services/employee.service';
import { EmployeeController } from './controllers/employee.controller';
import { Employee } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRepository } from './repo/employee.repo';
import { JwtService } from '@nestjs/jwt';
import { CompanyRepository } from '../company/repos/company.repo';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository, JwtService, CompanyRepository, ConfigService],
  exports: [EmployeeService],
})
export class EmployeeModule {
}
