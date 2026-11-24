import app from "./app.js";
import { pool } from "./config/database.js";
import { migrateDatabase } from "./config/migrations.js";

const PORT = process.env.PORT || 3000;

try {
    await migrateDatabase();
    await pool.query("SELECT 1");

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    await pool.end();
    console.error("Failed to initialize the API and PostgreSQL migrations:", error);
    process.exitCode = 1;
}
