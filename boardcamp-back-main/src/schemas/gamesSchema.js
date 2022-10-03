import Joi from "joi";

const newGameSchema = Joi.object({
  name: Joi.string().required(),
  stockTotal: Joi.number().min(1).required(),
  pricePerDay: Joi.number().min(1).required(),
  image: Joi.string().required(),
  categoryId: Joi.number().required(),
});

export { newGameSchema };
