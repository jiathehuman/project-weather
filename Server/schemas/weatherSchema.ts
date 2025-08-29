import Joi from "joi";

export const weatherQuerySchema = Joi.object({
  location: Joi.string().min(3).max(30).required(),
  unit: Joi.string().valid('celsius', 'fahrenheit').required()
});

export const dashboardWeatherSchema = Joi.object({
    q:Joi.string().min(2).max(30).required(),
})