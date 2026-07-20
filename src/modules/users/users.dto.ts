export interface CreateUserDto {
    email: string;
    password: string; //hashed password before storage
}

export interface UserResponseDto {
    id: number;
    email: string;
    createdAt: string // ISO string, not a Date object
}