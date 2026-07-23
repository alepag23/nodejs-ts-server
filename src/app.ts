import express, { type Express } from "express";
import { usersRouter } from "./modules/users/index.ts";
import { authRouter } from "./modules/auth/index.ts";
import cookieParser from "cookie-parser";
import cors from "cors";

export function createApp(): Express {
    const app: Express = express();
    // parse JSON req bodies
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin: 'http://localhost:4200', // url app frontend
        credentials: true,
    }));
    // Mount each module's router under its base path.
    app.use('/users', usersRouter);
    app.use('/auth', authRouter);

    return app;
}