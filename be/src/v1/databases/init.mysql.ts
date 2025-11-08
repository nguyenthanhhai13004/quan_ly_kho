import dbConfig from "../configs/mysql.config";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host:dbConfig.host,
    user:dbConfig.username,
    password:dbConfig.pass,
    database:dbConfig.name,
    port:dbConfig.port
});

export default pool;