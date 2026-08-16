export interface CreateUserDto {
    name: string;
    surname: string;
    email: string;
    passwordHash: string; //hashed password before storage
}

export interface UserResponseDto {
    id: number;
    email: string;
    createdAt: string // ISO string, not a Date object
}