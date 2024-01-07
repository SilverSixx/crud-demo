import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmployeeService } from '../../employee/services/employee.service';
import { SignUpDto } from '../dto/signup.dto';
import { Employee } from '../../employee/entities/employee.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async login(e: Employee): Promise<{ access_token: string }> {
    const payload = {
      sub: e.id,
      email: e.employee_email,
      role: e.employee_role,
    };
    const accessToken = this.jwtService.sign(payload);
    return { access_token: accessToken };
  }

  async signup(signUpDto: SignUpDto): Promise<object> {
    const emailExists = await this.employeeService.isEmailExists(
      signUpDto.email,
    );
    if (emailExists) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    return await this.employeeService.create(signUpDto);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Employee | null> {
    const e = await this.employeeService.findByEmail(username);
    if (e && (await bcrypt.compare(password, e.employee_password))) return e;
    return null;
  }
}
