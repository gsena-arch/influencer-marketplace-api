import { migrateDatabase } from "../config/migrations.js";
import { pool } from "../config/database.js";

try {
    await migrateDatabase();
    console.log("Migrações aplicadas com sucesso.");
} catch (error) {
    console.error("Não foi possível aplicar as migrações. Verifique a conexão e possíveis dados duplicados.", error);
    process.exitCode = 1;
} finally {
    await pool.end();
}
