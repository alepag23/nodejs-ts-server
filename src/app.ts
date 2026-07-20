import express, { type Express } from "express";
import { usersRouter } from "./modules/users/index.ts";
import { authRouter } from "./modules/auth/index.ts";
export function createApp(): Express {
    const app: Express = express();
    // parse JSON req bodies
    app.use(express.json());
    // Mount each module's router under its base path.
    app.use('/users', usersRouter);
    app.use('/auth', authRouter);

    return app;
}