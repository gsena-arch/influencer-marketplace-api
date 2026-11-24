import { readdir, readFile } from "node:fs/promises";
import { pool } from "./database.js";

export async function migrateDatabase(): Promise<void> {
    const directory = new URL("../../db/migrations/", import.meta.url);
    const files = (await readdir(directory)).filter(name => /^\d+.*\.sql$/.test(name)).sort();
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        // Serialize migrations when several API instances start together.
        await client.query("SELECT pg_advisory_xact_lock(hashtext('api_schema_migrations'))");
        await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
            name TEXT PRIMARY KEY,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`);

        for (const name of files) {
            const applied = await client.query("SELECT 1 FROM schema_migrations WHERE name = $1", [name]);
            if (applied.rows.length) continue;
            await client.query(await readFile(new URL(name, directory), "utf8"));
            await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name]);
        }

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
