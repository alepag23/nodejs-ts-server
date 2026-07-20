import { Pool } from "pg";

export const pool = new Pool();

pool.on('error', (err) => {
    console.log('Error pool db: ', err);
});