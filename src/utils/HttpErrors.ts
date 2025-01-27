import { HTTPSTATUS, httpStatusCodeType } from '../config/http.config';
import { ErrorCodeEnumType, errorCodeEnum } from '../enum/errrorCode.enum';

export class AppError extends Error {
  public statusCode: httpStatusCodeType;
  public errorCode?: ErrorCodeEnumType;

  constructor(
    message: string,
    StatusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCodeEnumType
  ) {
    super(message);
    this.statusCode = StatusCode;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpException extends AppError {
  constructor(
    message = 'Http Exception Error',
    StatusCode: httpStatusCodeType,
    errorCode?: ErrorCodeEnumType
  ) {
    super(message, StatusCode, errorCode);
  }
}

export class InternalServerException extends AppError {
  constructor(
    message = 'Internal Server Error',
    errorCode?: ErrorCodeEnumType
  ) {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || errorCodeEnum.INTERNAL_SERVER_ERROR
    );
  }
}

export class NotFoundException extends AppError {
  constructor(message = 'Resource not found', errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.NOT_FOUND,
      errorCode || errorCodeEnum.RESOURCE_NOT_FOUND
    );
  }
}

export class BadRequestException extends AppError {
  constructor(message = 'Bad Request', errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.BAD_REQUEST,
      errorCode || errorCodeEnum.VALIDATION_ERROR
    );
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = 'UnAuthorized Access', errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.UNAUTHORIZED,
      errorCode || errorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }
}
