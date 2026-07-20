
export interface UserEntity {
    id: number;
    email: string;
    password_hash: string;
    created_at: Date;
}

export type PublicUserEntity = Omit<UserEntity, 'password_hash'>;
