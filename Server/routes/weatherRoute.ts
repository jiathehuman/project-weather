import { Router} from "express";
import validator from "../utils/validator";
import { weatherQuerySchema } from "../schemas/weatherSchema";
import { get_weather } from "../controllers/weather";
const weatherRouter = Router();

weatherRouter.get("/", validator.query(weatherQuerySchema), get_weather)

export default weatherRouter;
