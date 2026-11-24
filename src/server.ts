import app from "./app.js";
import { pool } from "./config/database.js";
import { migrateDatabase } from "./config/migrations.js";

const PORT = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error("PORT deve ser um número inteiro entre 1 e 65535.");
}

try {
    await migrateDatabase();
    await pool.query("SELECT 1");

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    await pool.end();
    console.error("Failed to initialize the API and PostgreSQL migrations:", error);
    process.exitCode = 1;
}
