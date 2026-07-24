import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { pool } from './db/db.ts';
import { createApp } from './app.ts';
import bcrypt from 'bcrypt';

vi.mock('bcrypt');

const app = createApp();

describe('API end-to-end', () => {
    // Fake in-memory "database": an array that simulates the users table
    let fakeUsers: any[];
    let nextId: number;

    beforeEach(() => {
        fakeUsers = [];
        nextId = 1;

        vi.mocked(bcrypt.hash).mockImplementation(
            ((pw: string) => Promise.resolve(`hashed-${pw}`)) as never,
        );
        vi.mocked(bcrypt.compare).mockImplementation(
            ((pw: string, hash: string) => Promise.resolve(hash === `hashed-${pw}`)) as never,
        );

        // We replace pool.query: the only point that touches the DB.
        // We interpret the SQL crudely to return consistent data.
        (pool as any).query = vi.fn(async (sql: string, params: any[] = []) => {
            // check email existence (SELECT EXISTS ...)
            if (sql.includes('EXISTS')) {
                const exists = fakeUsers.some((u) => u.email === params[0]);
                return { rows: [{ exists }] };
            }
            // search by email with hash (login)
            if (sql.includes('WHERE email')) {
                const user = fakeUsers.find((u) => u.email === params[0]) ?? null;
                return { rows: user ? [user] : [] };
            }
            // search by id
            if (sql.includes('WHERE id')) {
                const user = fakeUsers.find((u) => u.id === params[0]) ?? null;
                return { rows: user ? [user] : [] };
            }
            // insert
            if (sql.includes('INSERT')) {
                const user = {
                    id: nextId++,
                    email: params[0],
                    password_hash: params[1],
                    created_at: new Date('2026-01-01T00:00:00Z'),
                };
                fakeUsers.push(user);
                return { rows: [user] };
            }
            return { rows: [] };
        });

        process.env.JWT_SECRET = 'test-secret';
    });

    it('create user with POST /users/new', async () => {
        const res = await request(app)
            .post('/users/new')
            .send({ email: 'ada@example.com', password: 'supersecret' });

        expect(res.status).toBe(201);
        expect(res.body.email).toBe('ada@example.com');
        expect(res.body.password_hash).toBeUndefined();  // dto barrier
    });

    it('reject duplicate email with 409', async () => {
        // first user: ok
        await request(app).post('/users/new').send({ email: 'ada@example.com', password: 'supersecret' });
        // second with same email: conflict
        const res = await request(app).post('/users/new').send({ email: 'ada@example.com', password: 'supersecret' });

        expect(res.status).toBe(409);
    });

    it('block GET /users/:id without token with 401', async () => {
        const res = await request(app).get('/users/1');
        expect(res.status).toBe(401);
    });

    it('allows login and access to the protect route with token', async () => {
        // 1. Register user
        await request(app).post('/users/new').send({ email: 'ada@example.com', password: 'supersecret' });

        // 2. login and take token
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ email: 'ada@example.com', password: 'supersecret' });

        expect(loginRes.status).toBe(200);
        const cookie = loginRes.headers['set-cookie'];
        expect(cookie).toBeTruthy();

        // 3. use cookie on the protect route
        const protectedRes = await request(app)
            .get('/users/1')
            .set('Cookie', cookie);

        expect(protectedRes.status).toBe(200);
        expect(protectedRes.body.email).toBe('ada@example.com');
    });
});