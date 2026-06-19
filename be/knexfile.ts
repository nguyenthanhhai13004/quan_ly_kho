import type { Knex } from "knex";
import dbConfig from "./src/v1/configs/mysql.config";

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,          
    password: dbConfig.pass,
    database: dbConfig.name,
    timezone: "+07:00"
  },
  pool: {
    afterCreate: (conn: any, cb: any) => {
      conn.query("SET time_zone = '+07:00';", (err: any) => {
        cb(err, conn);
      });
    }
  },
  migrations: {
    directory: "./dist/migrations"
  },
  seeds: {
    directory: "./dist/seeds"
  }
};

export default config;