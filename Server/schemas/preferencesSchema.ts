import Joi from "joi";

export const preferenceSchema = Joi.object({
  city: Joi.string().min(3).max(30).required(),
  country_code: Joi.string().min(2).max(2)
    .messages({
      "string.min": "Country code must be exactly 2 characters long",
      "string.max": "Country code must be exactly 2 characters long",
    }),
  temperature_unit: Joi.string().valid('celsius', 'fahrenheit').required()
});