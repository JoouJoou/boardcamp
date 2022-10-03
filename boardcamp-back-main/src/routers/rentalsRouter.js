import { Router } from "express";
import {
  delRentals,
  endRental,
  getRentals,
  postRent,
} from "../controllers/rentalsController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { rentalSchema } from "../schemas/rentalsSchema.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", validateSchema(rentalSchema), postRent);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals/:id/return", endRental);
rentalsRouter.delete("/rentals/:id", delRentals);

export default rentalsRouter;
