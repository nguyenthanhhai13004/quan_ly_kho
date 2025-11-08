import StatusCode from "./constants/status-code.constant";
import ReasonStatusCode from "./constants/reason-status-code.constant";
class ErrorResponse extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BAD_REQUEST,
    status = StatusCode.BAD_REQUEST,
  ) {
    super(message, status);
  }
}

export class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZED,
    status = StatusCode.UNAUTHORIZED,
  ) {
    super(message, status);
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    status = StatusCode.FORBIDDEN,
  ) {
    super(message, status);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOT_FOUND,
    status = StatusCode.NOT_FOUND,
  ) {
    super(message, status);
  }
}

export class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.INTERNAL_SERVER_ERROR,
    status = StatusCode.INTERNAL_SERVER_ERROR,
  ) {
    super(message, status);
  }
}

export class UnsupportedMediaTypeError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNSUPPORTED_MEDIA_TYPE,
    status = StatusCode.UNSUPPORTED_MEDIA_TYPE,
  ) {
    super(message, status);
  }
}
