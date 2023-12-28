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
  async login(user: Employee): Promise<DataResponse<unknown>> {
    const response = new DataResponse();
    const payload = { sub: user.id, email: user.employee_email };
    const accessToken = this.jwtService.sign(payload);
    response.statusCode = HttpStatus.OK;
    response.isError = false;
    response.message = 'Employee login successfully';
    response.data = {access_token: accessToken};
    return response;
  }

  async signup(signUpDto: SignUpDto): Promise<DataResponse<unknown>> {
    const response = new DataResponse();
    try {
      const emailExists = await this.employeeService.isEmailExists(signUpDto.email);
      if (emailExists) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
      response.statusCode = HttpStatus.CREATED;
      response.isError = false;
      response.message = 'Employee created successfully';
      response.data = await this.employeeService.create(signUpDto);

    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      response.message = error.message || 'An error occurred while signing up';
      response.data = null;
    }
    return response;
  }

  async validateUser(username: string, password:string): Promise<Employee | null> {
    const e = await this.employeeService.findByEmail(username);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    if (e && await bcrypt.compare(password, e.employee_password))
      return e;
    return null;
  }
}