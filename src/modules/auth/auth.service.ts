import type { LoginDto } from "./auth.dto.ts";
import { findByEmailWithHash, findById, userMapperDto } from "../users/index.ts";
import { NotFoundError, UnauthorizedError, ValidationError } from "../../shared/errors/errors.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { PublicUserEntity, UserEntity } from "../users/user.entity.ts";
import type { UserResponseDto } from "../users/users.dto.ts";

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
    if(!publicUserEntity){
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

export async function checkSession(token: string): Promise<UserResponseDto>{
    // 1. Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {userId: number};

    // 2. Search user in the db using the id in the token payload
    const entity: PublicUserEntity | null = await findById(decoded.userId);
    if(!entity){
        throw new NotFoundError('User not found');
    }

    return userMapperDto(entity);
}

// export async function register(dto:RegisterDto): Promise<{token: string}> {
    
// }


// async function generateToken(dto:LoginDto | RegisterDto, user: string): Promise<{token: string}> {
//     // 2. Recover user with hash
//     const user = await findByEmailWithHash(dto.email);
//     if (!user) {
//         throw new UnauthorizedError('Invalid credentials');
//     }
//     // 3. Check password
//     const passwordMatch = await bcrypt.compare(dto.password, user.password_hash);
//     if (!passwordMatch) {
//         throw new UnauthorizedError('Invalid credentials');
//     }
//     // 4. Create token
//     const token = jwt.sign(
//         { userId: user.id },
//         process.env.JWT_SECRET as string,
//         { expiresIn: '1h' },
//     );
//     return {token};
// }