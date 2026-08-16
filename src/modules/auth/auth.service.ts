import type { LoginDto, RegisterDto } from "./auth.dto.ts";
import { findByEmailWithHash, findById, userMapperDto } from "../users/index.ts";
import { ConflictError, NotFoundError, UnauthorizedError, ValidationError } from "../../shared/errors/errors.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { PublicUserEntity, UserEntity } from "../users/user.entity.ts";
import type { UserResponseDto } from "../users/users.dto.ts";
import { insert, emailExists } from "../users/index.ts";

export async function login(dto: LoginDto): Promise<{ token: string, user: UserResponseDto }> {
    // 1. Check email 
    if (!dto?.email || !dto.email.includes('@')) {
        throw new ValidationError('A valid email is required');
    }
    // 2. Recover user with hash
    const user: UserEntity | null = await findByEmailWithHash(dto.email);
    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }
    // 3. Check password
    const passwordMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }

    // 4. Recover PublicUserEntity
    const publicUserEntity: PublicUserEntity | null = await findById(user.id);
    if (!publicUserEntity) {
        throw new NotFoundError('User not found');
    }

    // 4. Create token
    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' },
    );

    return { token, user: userMapperDto(publicUserEntity) };
}

export async function checkSession(token: string): Promise<UserResponseDto> {
    // 1. Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    // 2. Search user in the db using the id in the token payload
    const entity: PublicUserEntity | null = await findById(decoded.userId);
    if (!entity) {
        throw new NotFoundError('User not found');
    }

    return userMapperDto(entity);
}

export async function createUser(dto: RegisterDto): Promise<{ token: string, user: UserResponseDto }> {
    // 1. Validation Name
    if (!dto?.name || dto.name.trim().length === 0) {
        throw new ValidationError('Name is required');
    }
    // 2. Validation Surname
    if (!dto?.surname || dto.surname.trim().length === 0) {
        throw new ValidationError('Surname is required');
    }

    // 3. Validation Email
    if (!dto?.email || !dto.email.includes('@')) {
        throw new ValidationError('A valid email is required');
    }
    // 4. Validation password
    if (!dto?.password || dto.password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
    }

    // 5. Sanitization input (removing extra space)
    const cleanName = dto.name.trim();
    const cleanSurname = dto.surname.trim();
    const cleanEmail = dto.email.trim().toLowerCase();

    // 6. check if email exists
    const existing = await emailExists(cleanName);
    if (existing) {
        throw new ConflictError('Email already exists');
    }

    // 7. Hashing password
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const entity = await insert({
        name: cleanName,
        surname: cleanSurname,
        email: cleanEmail,
        passwordHash,
    });

    // Recover PublicUserEntity
    const publicUserEntity: PublicUserEntity | null = await findById(entity.id);
    if (!publicUserEntity) {
        throw new NotFoundError('User not found after creation');
    }

    // 4. Create token
    const token = jwt.sign(
        { userId: publicUserEntity.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' },
    );

    return { token, user: userMapperDto(publicUserEntity) };
}