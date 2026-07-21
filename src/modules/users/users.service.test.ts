import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userService from './users.service.ts';
import * as repository from './users.repository.ts';


vi.mock('./users.repository.ts');
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