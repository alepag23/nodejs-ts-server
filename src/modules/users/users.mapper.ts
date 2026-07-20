import type { UserEntity } from "./user.entity.ts";
import type { UserResponseDto } from "./users.dto.ts";

/**
 * snake_case -> camelCase, Date -> ISO string, and password_hash is dropped.
 * The official translator between the DB shape and the API shape.
 * It explicitly decides what crosses the boundary:
 * @param entity: UserEntity 
 * @returns UserResponseDto
 */
export function userMapperDto(entity: UserEntity): UserResponseDto {
    return {
        id: entity.id,
        email: entity.email,
        createdAt: entity.created_at.toISOString(),
    }
}