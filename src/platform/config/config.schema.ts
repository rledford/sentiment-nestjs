import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().integer().min(0).max(65535).default(8900),
  MONGO_HOST: Joi.string(),
  MONGO_PORT: Joi.number().integer().min(1).max(65535).default(27017),
  MONGO_USER: Joi.string(),
  MONGO_PASS: Joi.string(),
  MONGO_NAME: Joi.string(),
  GNL_CLIENT_API_KEY: Joi.string(),
});
