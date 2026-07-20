import { Router } from "express";
import { createUser, getUser } from "./users.controller.ts";
import { authenticate } from "../auth/index.ts";

export const usersRouter: Router = Router();

usersRouter.get('/:id', authenticate, getUser);
usersRouter.post('/new', createUser);