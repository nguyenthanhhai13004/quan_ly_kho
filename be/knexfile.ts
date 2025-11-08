import type { Knex } from "knex";
import dbConfig from "./src/v1/configs/mysql.config";

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,          
    password: dbConfig.pass,
    database: dbConfig.name
  },
  migrations: {
    directory: "./migrations"
  }
};

export default config;