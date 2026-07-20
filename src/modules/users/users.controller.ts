import { type Request, type Response, type NextFunction } from "express";
import { ValidationError } from "../../shared/errors/errors.ts";
import * as userService from "./users.service.ts";

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id: number = Number(req.params.id);
        if (!Number.isInteger(id)) {
            throw new ValidationError('id must be an integer');
        }
        const user = await userService.getUserById(id);
        res.json(user);

    } catch (error) {
        next(error);
    }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // add check req.body type
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}