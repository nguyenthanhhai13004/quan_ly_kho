import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import APIV1 from "./v1/routes";
import { DEFAULT_PORT, ROOT_UPLOADS } from "./v1/cores/constants/app.constant";
const PORT = process.env.PORT || DEFAULT_PORT;
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import NodeEnvEnum from "./v1/cores/enums/node-env.enum";
import { HttpError } from "./v1/cores/http-error";
import ReasonStatusCode from "./v1/cores/constants/reason-status-code.constant";
import StatusCode from "./v1/cores/constants/status-code.constant";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./v1/configs/swagger";
import { CreateKeyPairType } from "./v1/auths";

import path from "path";
dotenv.config();
declare global {
  namespace Express {
    interface Request {
      user: CreateKeyPairType;
    }
  }
}
const app: Application = express();
const allowedOrigins = process.env.CLIENT_URLS?.split(",") || [];
const NODE_ENV = process.env.NODE_ENV || NodeEnvEnum.DEV;

/* MIDDLEWARES START*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  }),
);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
if (NODE_ENV === NodeEnvEnum.DEV) {
  app.use(morgan("dev"));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.use(compression());
/* MIDDLEWARES END*/

/**
 * PUBLIC UPLOADS
 */
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, `../${ROOT_UPLOADS}`)),
);
app.use(
  "/api/assets",
  express.static(path.join(__dirname, `../assets`)),
);
app.use("/api/v1", APIV1);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: HttpError = new Error(ReasonStatusCode.NOT_FOUND);
  error.status = StatusCode.NOT_FOUND;
  next(error);
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || StatusCode.INTERNAL_SERVER_ERROR).json({
    message: (err.status == 500 || !err.status)  ? ReasonStatusCode.INTERNAL_SERVER_ERROR : (err.message || ReasonStatusCode.INTERNAL_SERVER_ERROR),
    status: err.status,
    stack:err.stack
  });
});
export { app, PORT };
