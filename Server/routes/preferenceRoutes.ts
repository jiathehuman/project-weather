import { Router} from "express";
import { authentication } from "../middleware/authmiddleware";
import validator from "../utils/validator";
import { create_or_update_preference, get_preference } from "../controllers/preference";
import { preferenceSchema } from "../schemas/preferencesSchema";
const prefRouter = Router();

prefRouter.get("/", authentication, validator.body(preferenceSchema), get_preference)
prefRouter.post("/", authentication, validator.body(preferenceSchema), create_or_update_preference)
export default prefRouter;
