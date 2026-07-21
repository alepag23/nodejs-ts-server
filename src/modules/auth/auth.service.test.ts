import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from './auth.service.ts';
import * as usersModule from '../users/index.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock of the three external dependencies of the service:
vi.mock('../users/index.ts');   // the facade from which findByEmailWithHash originates
vi.mock('bcrypt');              // external library
vi.mock('jsonwebtoken');        // external library

describe('login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // The service uses JWT_SECRET; in tests, we set it to a dummy value.
        process.env.JWT_SECRET = 'test-secret';
    });

    const fakeUser = {
        id: 2,
        email: 'test@test.com',
        password_hash: '$2b$12$hashfinto',
        created_at: new Date('2026-01-01T00:00:00Z'),
    };

    it('returns a token when the credentials are correct', async () => {
        vi.mocked(usersModule.findByEmailWithHash).mockResolvedValue(fakeUser);
        vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
        vi.mocked(jwt.sign).mockReturnValue('fake-token' as never);

        const result = await authService.login({
            email: 'test@test.com',
            password: 'supersecret',
        });

        expect(result).toEqual({ token: 'fake-token' });
    });

    it(' UnauthorizedError if email not exists', async () => {
        vi.mocked(usersModule.findByEmailWithHash).mockResolvedValue(null);

        await expect(
            authService.login({ email: 'nothing@test.com', password: 'supersecret' }),
        ).rejects.toThrow('Invalid credentials');
    });

    it('lancia UnauthorizedError if password invalid', async () => {
        vi.mocked(usersModule.findByEmailWithHash).mockResolvedValue(fakeUser);
        vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

        await expect(
            authService.login({ email: 'test@test.com', password: 'sbagliata' }),
        ).rejects.toThrow('Invalid credentials');

        // if password invalid, don't generate token
        expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('throw ValidationError if email invalid', async () => {
        await expect(
            authService.login({ email: 'not-email', password: 'supersecret' }),
        ).rejects.toThrow('A valid email is required');
    });
});