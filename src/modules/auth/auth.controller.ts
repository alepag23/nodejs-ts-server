import type { Request, Response, NextFunction, CookieOptions } from "express";
import * as authService from "./auth.service.ts";

const isProd = process.env.NODE_ENV === 'production';
const cookieOptions: CookieOptions = {
    httpOnly: true, // not readable by client-side JS (XSS protection)
    secure: isProd, // HTTPS only in production
    sameSite: isProd ? 'none' : 'lax', // 'none' needs 'secure'; 'lax' is fine same-site in dev
    path: '/', // must match on clearCookie
};
const TOKEN_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day in ms

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { token, user } = await authService.login(req.body);
        res.cookie('token', token, {
            ...cookieOptions,
            maxAge: TOKEN_MAX_AGE,
        });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}
/**
 * Reads the httpOnly cookie, validates the token, and returns the updated user from the DB
 * @param req 
 * @param res 
 * @param next 
 */
export async function checkSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // 1. Extract the token from the cookie automatically sent by the browser
        const token: string = req.cookies?.token as string;
        if (!token) {
            res.status(401).json({ message: 'Token not found. Authentication required.' });
            return;
        }

        // 2. The service verifies the JWT and retrieves the user's data from the db
        const user = await authService.checkSession(token);

        res.status(200).send(user);

    } catch (error) {
        next(error);
    }
}

export function logout(req: Request, res: Response, next: NextFunction): void {
    res.clearCookie('token', cookieOptions);
    res.status(200).json({ message: 'Logout success' });
}