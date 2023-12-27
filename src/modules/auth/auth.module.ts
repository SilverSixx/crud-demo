import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'key',
      signOptions: { expiresIn: '1h' },
    }),
    EmployeeModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
  exports: [AuthService],
})
export class AuthModule {
}
