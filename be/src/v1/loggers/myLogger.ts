import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';
import { v4 as uuidv4 } from 'uuid';

interface CommonParams {
  context?: string;
  metadata?: Record<string, any>;
  requestId?: string;
}

export class MyLogger {
  private logger: Logger;

  constructor() {
    const formatPrint = format.printf(
      ({ timestamp, message, context, requestId, metadata, level }) => {
        return `${timestamp}::${level}::${requestId ?? ''}::${context ?? ''}::${message}::${JSON.stringify(
          metadata ?? {}
        )}`;
      }
    );

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        formatPrint
      ),
      transports: [
        new transports.Console(),
        new (transports as any).DailyRotateFile({
          filename: 'logs/%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info',
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            formatPrint
          )
        }),
        new (transports as any).DailyRotateFile({
          filename: 'logs/%DATE%.error.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            formatPrint
          )
        })
      ]
    });
  }

  private commonParams(
    params: string | [string, { requestId?: string }, Record<string, any>?]
  ): CommonParams {
    let context: string | undefined;
    let req: { requestId?: string } | undefined;
    let metadata: Record<string, any> | undefined;

    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId || uuidv4();
    return { context, metadata, requestId };
  }

  log(message: string, params: string | [string, { requestId?: string }, Record<string, any>?]) {
    const paramLog = this.commonParams(params);
    const logObject = { message, ...paramLog };
    this.logger.info(logObject);
  }

  error(message: string, params: string | [string, { requestId?: string }, Record<string, any>?]) {
    const paramLog = this.commonParams(params);
    const logObject = { message, ...paramLog };
    this.logger.error(logObject);
  }
}

export default new MyLogger();
