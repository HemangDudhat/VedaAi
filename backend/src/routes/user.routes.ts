import { Router } from "express";
import { updateProfile, getImageKitAuth } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.patch("/profile", updateProfile);
router.get("/imagekit-auth", getImageKitAuth);

export default router;
