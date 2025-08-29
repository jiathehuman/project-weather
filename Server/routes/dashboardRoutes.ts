import { Router} from "express";
import { get_weather_from_preferences } from "../controllers/dashboard";
import { authentication } from "../middleware/authmiddleware";
import { dashboardWeatherSchema } from "../schemas/weatherSchema";
import validator from "../utils/validator";
const dashboardRouter = Router();

dashboardRouter.get("/", authentication, validator.query(dashboardWeatherSchema), get_weather_from_preferences)

export default dashboardRouter;