import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.ts";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await authService.login(req.body);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
}