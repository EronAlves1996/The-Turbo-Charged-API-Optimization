import Express, { Request, Response } from "express";
import { PORT } from "./config";
import { logger } from "./logger";

const LOG_CONTEXT = "index";

const LOG = logger(LOG_CONTEXT);

const app = Express();

const MOCK_PLANET_NAME = "Tatooine";
const MOCK_PLANET_CLIMATE = "Arid";
const GET_PLANET_BY_ID_ROUTE = "/planets/:id";

app.get(GET_PLANET_BY_ID_ROUTE, (req: Request, res: Response) => {
  setTimeout(() => {
    res.send({
      id: req.params.id,
      name: MOCK_PLANET_NAME,
      climate: MOCK_PLANET_CLIMATE,
    });
  }, 3000);
});

app.listen(PORT, (err) => {
  if (!err) {
    LOG.info(`app started at ${PORT}`);
  }
});
