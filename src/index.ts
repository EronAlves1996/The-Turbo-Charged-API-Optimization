import Express, { Request, Response } from "express";
import { PORT } from "./config";
import { logger } from "./logger";
import { getPlanet } from "./repository";

const LOG_CONTEXT = "index";

const LOG = logger(LOG_CONTEXT);

const app = Express();

const GET_PLANET_BY_ID_ROUTE = "/planets/:id";

const MISSING_ID_PARAMETER_MESSAGE =
  "The path parameter id should be passed. Example: /planets/1";
const MULTIPLE_IDS_MESSAGE = "You must pass only one planet id";
const NON_NUMERIC_ID_PARAMETER_MESSAGE = "The id parameter should be numeric";
const NOT_FOUND_MESSAGE = "NOT FOUND";

const NEGATIVE_OR_ZERO_ID_PARAMETER_MESSAGE =
  "Id parameter should be positive and non-zero value";

app.get(GET_PLANET_BY_ID_ROUTE, async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id === "undefined" || id === null) {
    returnHttpValidationException(res, MISSING_ID_PARAMETER_MESSAGE);
    return;
  }

  if (Array.isArray(id)) {
    returnHttpValidationException(res, MULTIPLE_IDS_MESSAGE);
    return;
  }

  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    returnHttpValidationException(res, NON_NUMERIC_ID_PARAMETER_MESSAGE);
    return;
  }

  if (numericId <= 0) {
    returnHttpValidationException(res, NEGATIVE_OR_ZERO_ID_PARAMETER_MESSAGE);
    return;
  }

  const planet = await getPlanet(numericId);

  if (!planet) {
    res.statusCode = 404;
    res.send({ message: NOT_FOUND_MESSAGE });
    return;
  }

  res.send(planet);
});

app.listen(PORT, (err) => {
  if (!err) {
    LOG.info(`app started at ${PORT}`);
  }
});

function returnHttpValidationException(
  res: Express.Response<any, Record<string, any>>,
  message: string,
) {
  res.statusCode = 400;
  res.send({
    message,
  });
}
