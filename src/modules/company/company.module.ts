import { Module } from '@nestjs/common';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controllers/company.controller';
import { CompanyRepository } from './repos/company.repo';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { EmployeeRepository } from '../employee/repo/employee.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, JwtService, EmployeeRepository],
  exports: [CompanyService],
})
export class CompanyModule {
}
