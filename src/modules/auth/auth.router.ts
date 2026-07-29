import { Router } from "express";
import * as authController from "./auth.controller.ts";
import { authenticateToken } from "./auth.middleware.ts";

export const authRouter: Router = Router();

authRouter.post('/login', authController.login);
authRouter.get('/checkSession', authenticateToken, authController.checkSession)
//authRouter.post('/register', )