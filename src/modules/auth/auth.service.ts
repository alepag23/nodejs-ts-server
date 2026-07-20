import type { LoginDto } from "./auth.dto.ts";
import { findByEmailWithHash } from "../users/index.ts";
import { UnauthorizedError, ValidationError } from "../../shared/errors/errors.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(dto: LoginDto): Promise<{ token: string }> {
    // 1. Check email 
    if (!dto?.email || !dto.email.includes('@')) {
        throw new ValidationError('A valid email is required');
    }
    // 2. Recover user with hash
    const user = await findByEmailWithHash(dto.email);
    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }
    // 3. Check password
    const passwordMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }
    // 4. Create token
    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' },
    );

    return { token };
}