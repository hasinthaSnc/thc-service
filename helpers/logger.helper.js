const winston = require('winston');

// Define log file locations
const logFilePath = 'logs/app.log';
const errorLogFilePath = 'logs/error.log'; // New error log file

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
    new winston.transports.File({ filename: logFilePath }), // Log to main file
    new winston.transports.File({
      filename: errorLogFilePath,
      level: 'error' // Only log messages with level 'error' to this file
    }) // Log errors to error file
  ]
});

module.exports = {
  logger
};
