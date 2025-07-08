import { Router } from "express";
import { getUserProfile, loginUser, logoutUser, signupUser, updateUserProfile } from "../controller/UserController.js";
import { verifyToken } from "../middleware/authMiddleware.js";



const router = Router();

router.route("/register").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, logoutUser);
router.route("/getUser/:id").get(verifyToken, getUserProfile)
router.route("/updateUser").put(verifyToken, updateUserProfile);


export default router