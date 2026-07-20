import express, { type Express, type Request, type Response } from "express";
import { usersRouter } from "./modules/users/users.router.ts";

export function createApp(): Express {
    const app: Express = express();
    // parse JSON req bodies
    app.use(express.json());
    // Mount each module's router under its base path.
    app.use('/users', usersRouter);

    return app;
}