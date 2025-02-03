import { Router } from "express";
import { dailyMedController as DailyMedController } from "./rxgo.controller";
import { authCheck } from "../../middleware/jwt-token.middleware";

const router = Router();
router.route("/drug-search").get(DailyMedController.durgSearch);
router.route("/drug-search/:setid").get(DailyMedController.durgSearchById);

export default router;