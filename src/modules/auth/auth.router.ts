import { Router } from "express";
import * as authController from "./auth.controller.ts";

export const authRouter: Router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "mario.rossi@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful (returns the token/cookie)
 *       400:
 *         description: Missing or invalid data
 *       401:
 *         description: Incorrect credentials
 */
authRouter.post('/login', authController.login);

/**
 * @openapi
 * /auth/checkSession:
 *   get:
 *     summary: Check the user's current session
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Active and valid session
 *       401:
 *         description: User not authenticated or token expired
 */
authRouter.get('/checkSession', authController.checkSession);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already in use
 */
authRouter.post('/register', authController.register);