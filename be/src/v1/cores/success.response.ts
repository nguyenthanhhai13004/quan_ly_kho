import StatusCode from "./constants/status-code.constant";
import ReasonStatusCode from "./constants/reason-status-code.constant";
import { Response } from "express";

interface ISuccessResponse<T = any> {
  message?: string;
  data?: T;
  statusCode?: number;
  reasonStatusCode?: string;
}

export class SuccessResponse<T = any> {
  message: string;
  data: T;
  statusCode: number;
  reasonStatusCode: string;

  constructor({
    message,
    data = {} as T,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
  }: ISuccessResponse<T>) {
    this.message = message ?? reasonStatusCode;
    this.data = data;
    this.reasonStatusCode = reasonStatusCode;
    this.statusCode = statusCode;
  }

  send(res: Response, headers: Record<string, string> = {}): Response {
    Object.entries(headers).forEach(([key, value]) =>
      res.setHeader(key, value),
    );
    return res.status(this.statusCode).json(this);
  }
}

export class OK extends SuccessResponse {
  constructor({ message, data }: ISuccessResponse) {
    super({
      message,
      data,
    });
  }
}

export class CREATED extends SuccessResponse {
  constructor({
    message,
    data,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
  }: ISuccessResponse) {
    super({ message, data, statusCode, reasonStatusCode });
  }
}
