import Express from "express";
import { PORT } from "./config";
import { logger } from "./logger";

const LOG_CONTEXT = "index";

const LOG = logger(LOG_CONTEXT);

const app = Express();

app.listen(PORT, (err) => {
  if (!err) {
    LOG.info(`app started at ${PORT}`);
  }
});
