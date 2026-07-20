import { pool } from "../../db/db.ts";
import { ConflictError } from "../../shared/errors/errors.ts";
import type { PublicUserEntity, UserEntity } from "./user.entity.ts";
import type { CreateUserDto } from "./users.dto.ts";


export async function findById(id: number): Promise<PublicUserEntity | null> {
    const result = await pool.query<PublicUserEntity>(
        'SELECT id, email, created_at FROM users WHERE id = $1',
        [id],
    );
    return result.rows[0] ?? null;
}

export async function findByEmail(email: string): Promise<PublicUserEntity | null> {
    const result = await pool.query<PublicUserEntity>(
        'SELECT email FROM users WHERE email = $1',
        [email],
    );
    return result.rows[0] ?? null;
}

export async function insert(email: string, passwordHash: string): Promise<PublicUserEntity> {
    try {
        const result = await pool.query<PublicUserEntity>(
            `INSERT INTO users (email, password_hash)
         VALUES ($1, $2)
         RETURNING id, email, created_at`,
            [email, passwordHash],
        );
        return result.rows[0];
    } catch (error) {
        // 23505 = unique_violation code postgresql
        if (error instanceof Error && 'code' in error && error.code === '23505') {
            throw new ConflictError('Email already registered');
        }
        throw error; // any generic error
    }
}