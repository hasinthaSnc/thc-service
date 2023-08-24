const winston = require('winston');

// Define log file location
const logFilePath = 'logs/app.log';

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info', // Log level
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.printf(info => {
      return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: logFilePath }) // Log to file
  ]
});

module.exports = {
    logger
  };
