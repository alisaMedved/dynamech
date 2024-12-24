// @ts-ignore
import winston from "winston";
// @ts-ignore
import path from "path";

const console = new winston.transports.Console();
const formatTemplate = winston.format.printf(
  ({ level, message, timestamp }) => {
    return `${timestamp} : ${level} : ${message}`;
  },
);
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    formatTemplate,
  ),
  transports: [
    // - Write all logs with importance level of `info` or less than it
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/info.log"),
      level: "info",
      options: { flags: "a" },
    }),
    //new winston.transports.Console(),
  ],
});

// Writes logs to console
//logger.add(console);
