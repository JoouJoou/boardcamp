import { Router } from "express";
import { getGames, postGames } from "../controllers/gamesController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { newGameSchema } from "../schemas/gamesSchema.js";

const gamesRouter = Router();

gamesRouter.post("/games", validateSchema(newGameSchema), postGames);

gamesRouter.get("/games", getGames);

export default gamesRouter;
