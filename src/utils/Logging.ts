import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import winston from 'winston/lib/winston/config';
import chalk from 'chalk'; // For coloring text

const customFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const coloredDate = chalk.blue(`[${timestamp}]`); // Color the date blue
    return `${coloredDate} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    critical: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
  },
};

const logger = createLogger({
  levels: customLevels.levels,
  level: 'info',
  format: customFormat,
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new transports.File({ filename: 'logs/app.log' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

winston.addColors(customLevels.colors);

export default logger;

/**
 * levels: Define custom logging levels.
 * level: Set the minimum level of logs to capture (here it’s set to info).
 */

/**
 * error: (0) For logging errors that might need immediate attention.
 * warn: (1) For logging warnings that indicate potential issues.
 * info: (2) For logging informational messages that highlight the progress of the application.
 * http: (3) For logging HTTP requests.
 * verbose: (4) For logging detailed information useful during debugging.
 * debug: (5) For logging debugging information.
 * silly: (6) For logging the most detailed information, often more than needed.
 */

/**
 * transports.File({ filename: ‘error.log’, level: ‘error’ }): Logs error messages to a separate file.
 */

/**
 * Using the winston-daily-rotate-file transport, you can create a new log file for each day.
 */

/**
 * DailyRotateFile: Creates a new log file every day with the specified date pattern.
 * zippedArchive: Compresses older log files.
 * maxSize: Maximum size of a log file before rotating.
 * maxFiles: Maximum number of days to keep log files.
 */

/**
 * 2025-01-27T12:34:56.789Z [info] : User login successful: User ID 123
 * 2025-01-27T12:35:01.123Z [warn] : Deprecated API usage detected in /users endpoint
 * 2025-01-27T12:35:10.456Z [error] : Database connection failed, retrying...
 * 2025-01-27T12:35:15.789Z [debug] : Query params received: { userId: 123 }
 * 2025-01-27T12:35:20.012Z [http] : GET /users request processed with status 200
 */
