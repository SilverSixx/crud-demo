import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmployeeService } from '../../employee/services/employee.service';
import { SignUpDto } from '../dto/signup.dto';
import { DataResponse } from '../dto/data-response.dto';
import { Employee } from '../../employee/entities/employee.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly employeeService: EmployeeService,
              private readonly jwtService: JwtService) {
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async login(e: Employee): Promise<DataResponse<unknown>> {
    const response = new DataResponse();
    const payload = { sub: e.id, email: e.employee_email, role:e.employee_role };
    const accessToken = this.jwtService.sign(payload);
    response.statusCode = HttpStatus.OK;
    response.isError = false;
    response.message = 'Employee login successfully';
    response.data = { access_token: accessToken };
    return response;
  }

  async signup(signUpDto: SignUpDto): Promise<DataResponse<unknown>> {
    const response = new DataResponse();
    try {
      const emailExists = await this.employeeService.isEmailExists(signUpDto.email);
      if (emailExists) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
      return await this.employeeService.create(signUpDto);
    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      response.message = error.message || 'An error occurred while signing up';
      response.data = null;
    }
    return response;
  }

  async validateUser(username: string, password: string): Promise<Employee | null> {
    const e = await this.employeeService.findByEmail(username);
    if (e && await bcrypt.compare(password, e.employee_password))
      return e;
    return null;
  }
}