import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userService from './users.service.ts';
import * as authService from './../auth/auth.service.ts';
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
            name: 'Jhon',
            surname: 'test',
            email: 'prova@prova.com',
            created_at: new Date('2026-01-01T00:00:00Z'),
        });

        await expect(userService.getUserById(1)).resolves.toEqual({
            id: 1,
            email: 'prova@prova.com',
            createdAt: '2026-01-01T00:00:00.000Z',
        });
    });
});

describe('createUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
    });

    it('create user when data is valid and email is free', async () => {
        vi.mocked(repository.emailExists).mockResolvedValue(false);
        vi.mocked(repository.insert).mockResolvedValue({
            id: 1,
            name: 'Jhon',
            surname: 'test',
            email: 'ada@example.com',
            created_at: new Date('2026-01-01T00:00:00Z'),
        });
        vi.mocked(repository.findById).mockResolvedValue({
            id: 1,
            name: 'Jhon',
            surname: 'Test',
            email: 'ada@example.com',
            created_at: new Date('2026-01-01T00:00:00Z'),
        });

        const result = await authService.createUser({
            name: 'Jhon',
            surname: 'Test',
            email: 'ada@example.com',
            password: 'supersecret',
        });

        expect(result.user.email).toBe('ada@example.com');
        expect(result.user).not.toHaveProperty('password_hash');
        expect(result.user).toEqual({
            id: 1,
            email: 'ada@example.com',
            createdAt: '2026-01-01T00:00:00.000Z',
        });
    });

    it('throw ConflictError if email exists', async () => {
        vi.mocked(repository.emailExists).mockResolvedValue(true);

        await expect(
            authService.createUser({
                name: 'Jhon',
                surname: 'Test',
                email: 'ada@example.com',
                password: 'supersecret',
            }),
        ).rejects.toThrow('Email already exists');

        expect(repository.insert).not.toHaveBeenCalled();
    });

    it('throw ValidationError if email not valid', async () => {
        await expect(
            authService.createUser({
                name: 'Jhon',
                surname: 'Test',
                email: 'not-email',
                password: 'supersecret',
            }),
        ).rejects.toThrow('A valid email is required');
    });

    it('throw ValidationError if password is too short', async () => {
        await expect(
            authService.createUser({
                name: 'Jhon',
                surname: 'Test',
                email: 'ada@example.com',
                password: 'short',
            }),
        ).rejects.toThrow('Password must be at least 8 characters');
    });
});