import NodeEnvEnum from "../cores/enums/node-env.enum";
import dotenv from "dotenv";
dotenv.config();
interface IDBConfig {
  host: string;
  port: number;
  name: string;
  username: string;
  pass: string;
}

const development: IDBConfig = {
  host: process.env.DEV_DB_HOST || "localhost",
  port: Number(process.env.DEV_DB_PORT) || 3306,
  name: process.env.DEV_DB_NAME || "devdb",
  username: process.env.DEV_DB_USERNAME || "root",
  pass: process.env.DEV_DB_PASS || "",
};

const production: IDBConfig = {
  host: process.env.PROD_DB_HOST || "localhost",
  port: Number(process.env.PROD_DB_PORT) || 3306,
  name: process.env.PROD_DB_NAME || "proddb",
  username: process.env.PROD_DB_USERNAME || "root",
  pass: process.env.PROD_DB_PASS || "",
};

const env = (process.env.NODE_ENV as NodeEnvEnum) || NodeEnvEnum.DEV;

const config: Record<NodeEnvEnum, IDBConfig> = {
  [NodeEnvEnum.DEV]: development,
  [NodeEnvEnum.PROD]: production,
};

export default config[env];
