import { HttpException, HttpStatus } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

export class DataResponse<T> {
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  statusCode: number;
  @IsNotEmpty()
  isError: boolean;
  @IsNotEmpty()
  data: T;
}

export class ResponseHelper {
  static success<T>(data: T, message: string = 'Success'): DataResponse<T> {
    return {
      statusCode: HttpStatus.OK,
      isError: false,
      message,
      data,
    };
  }

  static error<T>(statusCode: number, message: string): DataResponse<T> {
    throw new HttpException({ statusCode, message }, statusCode);
  }
}
