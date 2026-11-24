import { Atividade } from "../models/Atividade.js";
import type { AtividadeRecord } from "../models/Atividade.js";
import { validateId } from "../models/validation.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { query } from "./query.js";

async function findAll(): Promise<Atividade[]> {
    const result = await query<AtividadeRecord>('SELECT * FROM "atividade" ORDER BY id');
    return result.rows.map(row => Atividade.restore(row));
}

async function searchByKeyword(keyword: string): Promise<Atividade[]> {
    if (typeof keyword !== "string" || !keyword.trim()) throw new ValidationError("Palavra-chave nao informada.");
    const result = await query<AtividadeRecord>(
        'SELECT * FROM "atividade" WHERE "titulo" ILIKE $1 OR "descricao" ILIKE $1 OR "tipo" ILIKE $1 ORDER BY id',
        [`%${keyword.trim()}%`]
    );
    return result.rows.map(row => Atividade.restore(row));
}

async function findById(id: string): Promise<Atividade> {
    const result = await query<AtividadeRecord>('SELECT * FROM "atividade" WHERE id = $1', [validateId(id)]);
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: atividade.");
    return Atividade.restore(row);
}

async function create(model: Atividade): Promise<Atividade> {
    if (model.getId()) throw new ValidationError("O registro ja foi persistido.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    const result = keys.length
        ? await query<AtividadeRecord>(`INSERT INTO "atividade" (${keys.map(key => `"${key}"`).join(", ")}) VALUES (${keys.map((_, index) => `$${index + 1}`).join(", ")}) RETURNING *`, Object.values(data))
        : await query<AtividadeRecord>('INSERT INTO "atividade" DEFAULT VALUES RETURNING *');
    const row = result.rows[0];
    if (!row) throw new Error("O banco nao retornou o registro criado.");
    return Atividade.restore(row);
}

async function update(model: Atividade): Promise<Atividade> {
    const id = model.getId();
    if (!id) throw new ValidationError("O ID e obrigatorio para atualizar.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    if (!keys.length) throw new ValidationError("Envie ao menos um campo para atualizar.");
    const assignments = keys.map((key, index) => `"${key}" = $${index + 1}`);
    assignments.push('"atualizado_em" = CURRENT_TIMESTAMP');
    const result = await query<AtividadeRecord>(
        `UPDATE "atividade" SET ${assignments.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
        [...Object.values(data), validateId(id)]
    );
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: atividade.");
    return Atividade.restore(row);
}

async function remove(id: string): Promise<void> {
    const result = await query('DELETE FROM "atividade" WHERE id = $1 RETURNING id', [validateId(id)]);
    if (!result.rows.length) throw new NotFoundError("Registro nao encontrado: atividade.");
}

export default { findAll, searchByKeyword, findById, create, update, remove };
