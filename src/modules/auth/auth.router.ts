import { Router } from "express";
import * as authController from "./auth.controller.ts";

export const authRouter: Router = Router();

authRouter.post('/login', authController.login);