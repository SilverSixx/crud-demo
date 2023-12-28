import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './modules/employee/entities/employee.entity';
import { AuthModule } from './modules/auth/auth.module';
import { Company } from './modules/company/entities/company.entity';
import { CompanyModule } from './modules/company/company.module';
import { EmployeeModule } from './modules/employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '2312',
      database: 'postgres',
      entities: [Employee, Company],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Employee, Company]),
    AuthModule,
    CompanyModule,
    EmployeeModule
  ],
})
export class AppModule {}
