import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import pg from 'pg';

if (existsSync('.env')) loadEnvFile();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('Configure DATABASE_URL in the environment or .env file.');
}

export const pool = new pg.Pool({
    connectionString,
    // The schema stores TIMESTAMP without a timezone; use UTC consistently.
    options: '-c timezone=UTC',
    types: {
        getTypeParser(oid, format) {
            if (oid === pg.types.builtins.TIMESTAMP && format !== 'binary') {
                return (value: string) => new Date(`${value}Z`);
            }
            return pg.types.getTypeParser(oid, format);
        }
    }
});
