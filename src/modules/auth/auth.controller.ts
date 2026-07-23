import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.ts";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await authService.login(req.body);
        res.cookie('token', result.token, {
            httpOnly: true, // Prevents client-side JavaScript (Angular) from reading it (XSS protection)
            secure: false, // true only HTTPS (dev use false)
            sameSite: 'none', // 'none' if fe e be are on different domains
            maxAge: 24 * 60 * 60 * 1000 // duration in ms (es. 1 day)
        });
        res.status(200).json({ message: 'Login success' });
    } catch (error) {
        next(error);
    }
}

export async function logout(res: Response): Promise<void> {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
    });
    res.status(200).json({ message: 'Logout success' });
}