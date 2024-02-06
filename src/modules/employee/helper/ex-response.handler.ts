import { HttpException, HttpStatus } from '@nestjs/common';
import { DataResponse, ResponseHelper } from './data-response.helper';

export class HttpExceptionHandler {
  static handle(error: any): DataResponse<unknown> {
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message || 'Internal Server Error';

    return ResponseHelper.error(status, message);
  }
}
