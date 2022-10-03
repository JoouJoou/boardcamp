import Joi from "joi";

const customerSchema = Joi.object({
  name: Joi.string().required(),
  cpf: Joi.string().min(11).max(11).regex(/^\d+$/).required(),
  phone: Joi.string().min(10).max(11).regex(/^\d+$/).required(),
  birthday: Joi.date().required(),
});

export { customerSchema };
