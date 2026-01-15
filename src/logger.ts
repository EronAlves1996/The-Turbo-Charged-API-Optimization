import { createLogger, format, transports } from "winston";
import { LOG_LEVEL } from "./config";

const l = createLogger({
  level: LOG_LEVEL,
  format: format.json(),
  defaultMeta: { service: "planet-service" },
  transports: [new transports.Console()],
});

export function logger(context: string) {
  return l.child({ context });
}
