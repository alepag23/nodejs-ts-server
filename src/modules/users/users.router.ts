import { Router } from "express";
import { createUser, getUser } from "./users.controller.ts";

export const usersRouter: Router = Router();

usersRouter.get('/:id', getUser);
usersRouter.post('/new', createUser);