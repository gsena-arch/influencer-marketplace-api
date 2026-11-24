import { AtividadeRealizada } from "../models/AtividadeRealizada.js";
import type { AtividadeRealizadaRecord } from "../models/AtividadeRealizada.js";
import { validateId } from "../models/validation.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { query } from "./query.js";

async function findAll(): Promise<AtividadeRealizada[]> {
    const result = await query<AtividadeRealizadaRecord>('SELECT * FROM "atividade_realizada" ORDER BY id');
    return result.rows.map(row => AtividadeRealizada.restore(row));
}

async function searchByKeyword(keyword: string): Promise<AtividadeRealizada[]> {
    if (typeof keyword !== "string" || !keyword.trim()) throw new ValidationError("Palavra-chave nao informada.");
    const result = await query<AtividadeRealizadaRecord>(
        'SELECT * FROM "atividade_realizada" WHERE "status" ILIKE $1 ORDER BY id',
        [`%${keyword.trim()}%`]
    );
    return result.rows.map(row => AtividadeRealizada.restore(row));
}

async function findById(id: string): Promise<AtividadeRealizada> {
    const result = await query<AtividadeRealizadaRecord>('SELECT * FROM "atividade_realizada" WHERE id = $1', [validateId(id)]);
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: atividade_realizada.");
    return AtividadeRealizada.restore(row);
}

async function create(model: AtividadeRealizada): Promise<AtividadeRealizada> {
    if (model.getId()) throw new ValidationError("O registro ja foi persistido.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    const result = keys.length
        ? await query<AtividadeRealizadaRecord>(`INSERT INTO "atividade_realizada" (${keys.map(key => `"${key}"`).join(", ")}) VALUES (${keys.map((_, index) => `$${index + 1}`).join(", ")}) RETURNING *`, Object.values(data))
        : await query<AtividadeRealizadaRecord>('INSERT INTO "atividade_realizada" DEFAULT VALUES RETURNING *');
    const row = result.rows[0];
    if (!row) throw new Error("O banco nao retornou o registro criado.");
    return AtividadeRealizada.restore(row);
}

async function update(model: AtividadeRealizada): Promise<AtividadeRealizada> {
    const id = model.getId();
    if (!id) throw new ValidationError("O ID e obrigatorio para atualizar.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    if (!keys.length) throw new ValidationError("Envie ao menos um campo para atualizar.");
    const assignments = keys.map((key, index) => `"${key}" = $${index + 1}`);
    const result = await query<AtividadeRealizadaRecord>(
        `UPDATE "atividade_realizada" SET ${assignments.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
        [...Object.values(data), validateId(id)]
    );
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: atividade_realizada.");
    return AtividadeRealizada.restore(row);
}

async function remove(id: string): Promise<void> {
    const result = await query('DELETE FROM "atividade_realizada" WHERE id = $1 RETURNING id', [validateId(id)]);
    if (!result.rows.length) throw new NotFoundError("Registro nao encontrado: atividade_realizada.");
}

export default { findAll, searchByKeyword, findById, create, update, remove };
