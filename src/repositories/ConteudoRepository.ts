import { Conteudo } from "../models/Conteudo.js";
import type { ConteudoRecord } from "../models/Conteudo.js";
import { validateId } from "../models/validation.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { query } from "./query.js";

async function findAll(): Promise<Conteudo[]> {
    const result = await query<ConteudoRecord>('SELECT * FROM "conteudo" ORDER BY id');
    return result.rows.map(row => Conteudo.restore(row));
}

async function searchByKeyword(keyword: string): Promise<Conteudo[]> {
    if (typeof keyword !== "string" || !keyword.trim()) throw new ValidationError("Palavra-chave nao informada.");
    const result = await query<ConteudoRecord>(
        'SELECT * FROM "conteudo" WHERE "titulo" ILIKE $1 OR "conteudo" ILIKE $1 ORDER BY id',
        [`%${keyword.trim()}%`]
    );
    return result.rows.map(row => Conteudo.restore(row));
}

async function findById(id: string): Promise<Conteudo> {
    const result = await query<ConteudoRecord>('SELECT * FROM "conteudo" WHERE id = $1', [validateId(id)]);
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: conteudo.");
    return Conteudo.restore(row);
}

async function create(model: Conteudo): Promise<Conteudo> {
    if (model.getId()) throw new ValidationError("O registro ja foi persistido.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    const result = keys.length
        ? await query<ConteudoRecord>(`INSERT INTO "conteudo" (${keys.map(key => `"${key}"`).join(", ")}) VALUES (${keys.map((_, index) => `$${index + 1}`).join(", ")}) RETURNING *`, Object.values(data))
        : await query<ConteudoRecord>('INSERT INTO "conteudo" DEFAULT VALUES RETURNING *');
    const row = result.rows[0];
    if (!row) throw new Error("O banco nao retornou o registro criado.");
    return Conteudo.restore(row);
}

async function update(model: Conteudo): Promise<Conteudo> {
    const id = model.getId();
    if (!id) throw new ValidationError("O ID e obrigatorio para atualizar.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    if (!keys.length) throw new ValidationError("Envie ao menos um campo para atualizar.");
    const assignments = keys.map((key, index) => `"${key}" = $${index + 1}`);
    assignments.push('"atualizado_em" = CURRENT_TIMESTAMP');
    const result = await query<ConteudoRecord>(
        `UPDATE "conteudo" SET ${assignments.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
        [...Object.values(data), validateId(id)]
    );
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: conteudo.");
    return Conteudo.restore(row);
}

async function remove(id: string): Promise<void> {
    const result = await query('DELETE FROM "conteudo" WHERE id = $1 RETURNING id', [validateId(id)]);
    if (!result.rows.length) throw new NotFoundError("Registro nao encontrado: conteudo.");
}

export default { findAll, searchByKeyword, findById, create, update, remove };
