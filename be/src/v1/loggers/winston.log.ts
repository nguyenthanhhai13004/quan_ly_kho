
import winston from "winston"

const { combine, timestamp, json,printf,align } = winston.format
const logger = winston.createLogger({
    level:process.env.LOG_LEVEL || 'debug',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        align(),
        printf(info => {
            return `[${info.timestamp}] ${info.level}: ${info.message}`
        }),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'logs/test.log'}),
    ]
})

module.exports = logger