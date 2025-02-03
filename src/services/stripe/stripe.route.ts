import { Router } from "express";
import { stripeController as stripeController } from "./stripe.controller";
import { authCheck } from "../../middleware/jwt-token.middleware";

const router = Router();

router.route("/subscribe").post(authCheck(['user']),stripeController.createSubscription);

export default router;