import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/errors.ts";
import type { CreateUserDto, UserResponseDto } from "./users.dto.ts";
import { userMapperDto } from "./users.mapper.ts";
import * as repository from "./users.repository.ts";
import bcrypt from "bcrypt";

function hashedPassword(password: string): string {
    return '';
}

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

export async function createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    if (!dto?.email || !dto.email.includes('@')) {
        throw new ValidationError('A valid email is required')
    }

    if (!dto?.password || dto.password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
    }

    const existing = await repository.findByEmail(dto.email);
    if (existing) {
        throw new ConflictError('Email is already exist');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const entity = await repository.insert(dto.email, passwordHash);

    return userMapperDto(entity);
}