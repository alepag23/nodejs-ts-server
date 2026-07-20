
export interface UserEntity {
    id: number;
    email: string;
    password_hashed: string;
    created_at: Date;
}

export type PublicUserEntity = Omit<UserEntity, 'password_hash'>;