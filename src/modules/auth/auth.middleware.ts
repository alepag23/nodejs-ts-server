import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../shared/errors/errors.ts";
import jwt from "jsonwebtoken";

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    try {
        // 1. Extract the token from the cookie
        const token = req.cookies?.token;
        if (!token) {
            throw new UnauthorizedError('Token required');
        }
        // 2. Check sign and expiration
        jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            next(error)
        } else {
            next(new UnauthorizedError('Invalid or expired token'));
        }
    }
}