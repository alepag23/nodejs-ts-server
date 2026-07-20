import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../shared/errors/errors.ts";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
        // 1. Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedError('Token required');
        }
        const token = authHeader.replace('Bearer ', '');
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