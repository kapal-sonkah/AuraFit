import { Router } from "express";
import { login, refreshToken, logout } from "../controller/authentication-controller.js";
import authenticateToken from "../../../middlewares/authentication.js";

const router = Router();

router.post('/login', login);
router.put('/refresh-token', refreshToken);
router.delete('/logout', authenticateToken, logout);

export default router;