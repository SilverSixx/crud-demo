import { Module } from '@nestjs/common';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controllers/company.controller';
import { CompanyRepository } from './repos/company.repo';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { EmployeeRepository } from '../employee/repo/employee.repo';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    // using redis 3.x.x
    CacheModule.register({
      ttl:6000
    }),
  ],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    CompanyRepository,
    JwtService,
    EmployeeRepository,
    ConfigService,
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
