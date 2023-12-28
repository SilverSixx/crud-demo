import {IsEmail, IsNotEmpty} from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  role: string;
}
