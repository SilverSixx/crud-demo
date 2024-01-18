import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Employee } from './modules/employee/entities/employee.entity';
import { AuthModule } from './modules/auth/auth.module';
import { Company } from './modules/company/entities/company.entity';
import { CompanyModule } from './modules/company/company.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchModule } from './modules/search/search.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        type: configService.get<'postgres'>('POSTGRES_TYPE'),
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USERNAME'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        entities: [Employee, Company],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CompanyModule,
    EmployeeModule,
    SearchModule,
  ],

})
export class AppModule {}
