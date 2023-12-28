import { Module } from '@nestjs/common';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controllers/company.controller';
import { CompanyRepository } from './repos/company.repo';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [EmployeeModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository],
  exports: []
})
export class CompanyModule {}
