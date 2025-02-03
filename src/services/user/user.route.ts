import { Router } from "express";
import { userControler as UserController } from "./user.controller";
import { authCheck } from "../../middleware/jwt-token.middleware";
import multer from "multer";

const upload = multer({ dest: 'uploads/' })

const router = Router();
router.route("/signup").post(UserController.signupUser);
router.route("/signin").post(UserController.signinUser);
router.route("/verify/:userId/:code").get(UserController.verifyUser);
router.route("/forget-password").post(UserController.forgetPassword);
router.route("/reset-password/:userId/:code").post(UserController.resetPassword);
router.route("/change-password").get(UserController.changePassword);

router.route("/update-profile").put(authCheck(["user", "admin"]), upload.single('profilePicture'), UserController.updateUser);
router.route("/get-user").get(authCheck(["user", "admin"]), UserController.getUserDetails);
router.route("/get-all-user").get(authCheck(["admin"]), UserController.getAllUser);

export default router;