import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userService from './users.service.ts';
import * as repository from './users.repository.ts';

vi.mock('./users.repository.ts');

describe('getUserById', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('throw ValidationError if id is not a positive integer', async () => {
        await expect(userService.getUserById(0)).rejects.toThrow('id must be a positive integer');
    });

    it('throw NotFoundError if user not exists', async () => {
        vi.mocked(repository.findById).mockResolvedValue(null);
        await expect(userService.getUserById(1)).rejects.toThrow('User not found');
    });

    it('User exists and return userMapperDto', async () => {
        vi.mocked(repository.findById).mockResolvedValue({
            id: 1,
            email: 'prova@prova.com',
            created_at: new Date('2026-01-01T00:00:00Z'),
        });

        expect(userService.getUserById(1));
    });
});

describe('createUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('create user when data is valid and email is free', async () => {
        vi.mocked(repository.emailExists).mockResolvedValue(false);
        vi.mocked(repository.insert).mockResolvedValue({
            id: 1,
            email: 'ada@example.com',
            created_at: new Date('2026-01-01T00:00:00Z'),
        });

        const result = await userService.createUser({
            email: 'ada@example.com',
            password: 'supersecret',
        });

        expect(result.email).toBe('ada@example.com');
        expect(result).not.toHaveProperty('password_hash');
    });

    it('throw ConflictError if email exists', async () => {
        vi.mocked(repository.emailExists).mockResolvedValue(true);

        await expect(
            userService.createUser({ email: 'ada@example.com', password: 'supersecret' }),
        ).rejects.toThrow('Email is already exist');


        expect(repository.insert).not.toHaveBeenCalled();
    });

    it('throw ValidationError if email not valid', async () => {
        await expect(
            userService.createUser({ email: 'not-email', password: 'supersecret' }),
        ).rejects.toThrow('A valid email is required');
    });

    it('throw ValidationError if password is to short', async () => {
        await expect(
            userService.createUser({ email: 'ada@example.com', password: 'short' }),
        ).rejects.toThrow('Password must be at least 8 characters');
    });
});