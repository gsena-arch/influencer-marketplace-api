import { Curso } from "../models/Curso.js";
import type { CursoRecord } from "../models/Curso.js";
import { validateId } from "../models/validation.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { query } from "./query.js";

async function findAll(): Promise<Curso[]> {
    const result = await query<CursoRecord>('SELECT * FROM "curso" ORDER BY id');
    return result.rows.map(row => Curso.restore(row));
}

async function searchByKeyword(keyword: string): Promise<Curso[]> {
    if (typeof keyword !== "string" || !keyword.trim()) throw new ValidationError("Palavra-chave nao informada.");
    const result = await query<CursoRecord>(
        'SELECT * FROM "curso" WHERE "codigo_unico" ILIKE $1 OR "titulo" ILIKE $1 OR "descricao" ILIKE $1 ORDER BY id',
        [`%${keyword.trim()}%`]
    );
    return result.rows.map(row => Curso.restore(row));
}

async function findById(id: string): Promise<Curso> {
    const result = await query<CursoRecord>('SELECT * FROM "curso" WHERE id = $1', [validateId(id)]);
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: curso.");
    return Curso.restore(row);
}

async function create(model: Curso): Promise<Curso> {
    if (model.getId()) throw new ValidationError("O registro ja foi persistido.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    const result = keys.length
        ? await query<CursoRecord>(`INSERT INTO "curso" (${keys.map(key => `"${key}"`).join(", ")}) VALUES (${keys.map((_, index) => `$${index + 1}`).join(", ")}) RETURNING *`, Object.values(data))
        : await query<CursoRecord>('INSERT INTO "curso" DEFAULT VALUES RETURNING *');
    const row = result.rows[0];
    if (!row) throw new Error("O banco nao retornou o registro criado.");
    return Curso.restore(row);
}

async function update(model: Curso): Promise<Curso> {
    const id = model.getId();
    if (!id) throw new ValidationError("O ID e obrigatorio para atualizar.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    if (!keys.length) throw new ValidationError("Envie ao menos um campo para atualizar.");
    const assignments = keys.map((key, index) => `"${key}" = $${index + 1}`);
    assignments.push('"atualizado_em" = CURRENT_TIMESTAMP');
    const result = await query<CursoRecord>(
        `UPDATE "curso" SET ${assignments.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
        [...Object.values(data), validateId(id)]
    );
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: curso.");
    return Curso.restore(row);
}

async function remove(id: string): Promise<void> {
    const result = await query('DELETE FROM "curso" WHERE id = $1 RETURNING id', [validateId(id)]);
    if (!result.rows.length) throw new NotFoundError("Registro nao encontrado: curso.");
}

export default { findAll, searchByKeyword, findById, create, update, remove };
