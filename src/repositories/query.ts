import type { QueryResultRow } from "pg";
import { pool } from "../config/database.js";
import { ConflictError } from "../errors/ConflictError.js";
import { ValidationError } from "../errors/ValidationError.js";

export async function query<Row extends QueryResultRow>(sql: string, values: unknown[] = []) {
    try {
        return await pool.query<Row>(sql, values);
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error) {
            if (error.code === "23503") {
                throw new ConflictError("Referência inexistente ou registro utilizado por outra entidade.", { cause: error });
            }
            if (error.code === "23505") {
                const messages: Record<string, string> = {
                    usuario_email_unico: "E-mail já cadastrado.",
                    curso_codigo_unico: "Já existe um curso com esse código.",
                    matricula_usuario_curso_unico: "Usuário já matriculado neste curso."
                };
                const constraint = "constraint" in error ? String(error.constraint) : "";
                throw new ConflictError(messages[constraint] ?? "Já existe um registro com esses dados.", { cause: error });
            }
            if (["22003", "22007", "22008", "22001", "22P02", "23502"].includes(String(error.code))) {
                throw new ValidationError("Os dados informados não atendem às restrições do banco.");
            }
        }
        throw error;
    }
}
