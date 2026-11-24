import { CheckList } from "../models/CheckList.js";
import type { CheckListRecord } from "../models/CheckList.js";
import { validateId } from "../models/validation.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { query } from "./query.js";

async function findAll(): Promise<CheckList[]> {
    const result = await query<CheckListRecord>('SELECT * FROM "check_list" ORDER BY id');
    return result.rows.map(row => CheckList.restore(row));
}

async function searchByKeyword(keyword: string): Promise<CheckList[]> {
    if (typeof keyword !== "string" || !keyword.trim()) throw new ValidationError("Palavra-chave nao informada.");
    return [];
}

async function findById(id: string): Promise<CheckList> {
    const result = await query<CheckListRecord>('SELECT * FROM "check_list" WHERE id = $1', [validateId(id)]);
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: check_list.");
    return CheckList.restore(row);
}

async function create(model: CheckList): Promise<CheckList> {
    if (model.getId()) throw new ValidationError("O registro ja foi persistido.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    const result = keys.length
        ? await query<CheckListRecord>(`INSERT INTO "check_list" (${keys.map(key => `"${key}"`).join(", ")}) VALUES (${keys.map((_, index) => `$${index + 1}`).join(", ")}) RETURNING *`, Object.values(data))
        : await query<CheckListRecord>('INSERT INTO "check_list" DEFAULT VALUES RETURNING *');
    const row = result.rows[0];
    if (!row) throw new Error("O banco nao retornou o registro criado.");
    return CheckList.restore(row);
}

async function update(model: CheckList): Promise<CheckList> {
    const id = model.getId();
    if (!id) throw new ValidationError("O ID e obrigatorio para atualizar.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    if (!keys.length) throw new ValidationError("Envie ao menos um campo para atualizar.");
    const assignments = keys.map((key, index) => `"${key}" = $${index + 1}`);
    const result = await query<CheckListRecord>(
        `UPDATE "check_list" SET ${assignments.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
        [...Object.values(data), validateId(id)]
    );
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: check_list.");
    return CheckList.restore(row);
}

async function remove(id: string): Promise<void> {
    const result = await query('DELETE FROM "check_list" WHERE id = $1 RETURNING id', [validateId(id)]);
    if (!result.rows.length) throw new NotFoundError("Registro nao encontrado: check_list.");
}

export default { findAll, searchByKeyword, findById, create, update, remove };
