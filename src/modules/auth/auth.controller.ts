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
        const result = await authService.login(req.body);
        res.cookie('token', result.token, {
            ...cookieOptions,
            maxAge: TOKEN_MAX_AGE,
        });
        res.status(200).json({ message: 'Login success' });
    } catch (error) {
        next(error);
    }
}

export function logout(req: Request, res: Response, next: NextFunction): void {
    res.clearCookie('token', cookieOptions);
    res.status(200).json({ message: 'Logout success' });
}