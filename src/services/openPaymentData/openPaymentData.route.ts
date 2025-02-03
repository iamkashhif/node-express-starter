import { Router } from "express";
import { openPaymentDataController as OpenPaymentDataController } from "./openPaymentData.controller";
import { authCheck } from "../../middleware/jwt-token.middleware";

const router = Router();

router.route("/search").get(OpenPaymentDataController.search);

router.route("/generalPayments/:profileId").get(OpenPaymentDataController.generalPaymentAcrossYears);

router.route("/syncDataset").get(OpenPaymentDataController.addDataSetAndSync);

export default router;