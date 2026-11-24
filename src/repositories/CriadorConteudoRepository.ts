import { CriadorConteudo } from "../models/CriadorConteudo.js";
import type { CriadorConteudoRecord } from "../models/CriadorConteudo.js";
import { validateId } from "../models/validation.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { query } from "./query.js";

async function findAll(): Promise<CriadorConteudo[]> {
    const result = await query<CriadorConteudoRecord>('SELECT * FROM "criador_conteudo" ORDER BY id');
    return result.rows.map(row => CriadorConteudo.restore(row));
}

async function searchByKeyword(keyword: string): Promise<CriadorConteudo[]> {
    if (typeof keyword !== "string" || !keyword.trim()) throw new ValidationError("Palavra-chave nao informada.");
    return [];
}

async function findById(id: string): Promise<CriadorConteudo> {
    const result = await query<CriadorConteudoRecord>('SELECT * FROM "criador_conteudo" WHERE id = $1', [validateId(id)]);
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: criador_conteudo.");
    return CriadorConteudo.restore(row);
}

async function create(model: CriadorConteudo): Promise<CriadorConteudo> {
    if (model.getId()) throw new ValidationError("O registro ja foi persistido.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    const result = keys.length
        ? await query<CriadorConteudoRecord>(`INSERT INTO "criador_conteudo" (${keys.map(key => `"${key}"`).join(", ")}) VALUES (${keys.map((_, index) => `$${index + 1}`).join(", ")}) RETURNING *`, Object.values(data))
        : await query<CriadorConteudoRecord>('INSERT INTO "criador_conteudo" DEFAULT VALUES RETURNING *');
    const row = result.rows[0];
    if (!row) throw new Error("O banco nao retornou o registro criado.");
    return CriadorConteudo.restore(row);
}

async function update(model: CriadorConteudo): Promise<CriadorConteudo> {
    const id = model.getId();
    if (!id) throw new ValidationError("O ID e obrigatorio para atualizar.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    if (!keys.length) throw new ValidationError("Envie ao menos um campo para atualizar.");
    const assignments = keys.map((key, index) => `"${key}" = $${index + 1}`);
    const result = await query<CriadorConteudoRecord>(
        `UPDATE "criador_conteudo" SET ${assignments.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
        [...Object.values(data), validateId(id)]
    );
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: criador_conteudo.");
    return CriadorConteudo.restore(row);
}

async function remove(id: string): Promise<void> {
    const result = await query('DELETE FROM "criador_conteudo" WHERE id = $1 RETURNING id', [validateId(id)]);
    if (!result.rows.length) throw new NotFoundError("Registro nao encontrado: criador_conteudo.");
}

export default { findAll, searchByKeyword, findById, create, update, remove };
