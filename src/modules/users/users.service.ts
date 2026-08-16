import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/errors.ts";
import type { CreateUserDto, UserResponseDto } from "./users.dto.ts";
import { userMapperDto } from "./users.mapper.ts";
import * as repository from "./users.repository.ts";
import bcrypt from "bcrypt";

export async function getUserById(id: number): Promise<UserResponseDto> {
    if (!Number.isInteger(id) || id < 1) {
        throw new ValidationError('id must be a positive integer');
    }

    const entity = await repository.findById(id);
    if (!entity) {
        throw new NotFoundError('User not found');
    }

    return userMapperDto(entity);
}