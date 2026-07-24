import { Router } from "express";
import { createUser, getUser } from "./users.controller.ts";
import { authenticateToken } from "../auth/index.ts";

export const usersRouter: Router = Router();

usersRouter.get('/:id', authenticateToken, getUser);
usersRouter.post('/new', createUser);