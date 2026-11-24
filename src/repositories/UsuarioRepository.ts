import { Usuario } from "../models/Usuario.js";
import type { UsuarioRecord } from "../models/Usuario.js";
import { validateId } from "../models/validation.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ConflictError } from "../errors/ConflictError.js";
import { query } from "./query.js";

async function ensureEmailAvailable(email: unknown, id?: string): Promise<void> {
    if (typeof email !== "string") return;
    const result = await query(
        'SELECT id FROM "usuario" WHERE lower(btrim(email)) = $1' + (id ? ' AND id <> $2' : '') + ' LIMIT 1',
        id ? [email, validateId(id)] : [email]
    );
    if (result.rows.length) throw new ConflictError("E-mail já cadastrado.");
}

async function findAll(): Promise<Usuario[]> {
    const result = await query<UsuarioRecord>('SELECT * FROM "usuario" ORDER BY id');
    return result.rows.map(row => Usuario.restore(row));
}

async function searchByKeyword(keyword: string): Promise<Usuario[]> {
    if (typeof keyword !== "string" || !keyword.trim()) throw new ValidationError("Palavra-chave nao informada.");
    const result = await query<UsuarioRecord>(
        'SELECT * FROM "usuario" WHERE "nome" ILIKE $1 OR "email" ILIKE $1 OR "status" ILIKE $1 ORDER BY id',
        [`%${keyword.trim()}%`]
    );
    return result.rows.map(row => Usuario.restore(row));
}

async function findById(id: string): Promise<Usuario> {
    const result = await query<UsuarioRecord>('SELECT * FROM "usuario" WHERE id = $1', [validateId(id)]);
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: usuario.");
    return Usuario.restore(row);
}

async function create(model: Usuario): Promise<Usuario> {
    if (model.getId()) throw new ValidationError("O registro ja foi persistido.");
    const data = model.toPersistence();
    await ensureEmailAvailable(data.email);
    const keys = Object.keys(data);
    const result = keys.length
        ? await query<UsuarioRecord>(`INSERT INTO "usuario" (${keys.map(key => `"${key}"`).join(", ")}) VALUES (${keys.map((_, index) => `$${index + 1}`).join(", ")}) RETURNING *`, Object.values(data))
        : await query<UsuarioRecord>('INSERT INTO "usuario" DEFAULT VALUES RETURNING *');
    const row = result.rows[0];
    if (!row) throw new Error("O banco nao retornou o registro criado.");
    return Usuario.restore(row);
}

async function update(model: Usuario): Promise<Usuario> {
    const id = model.getId();
    if (!id) throw new ValidationError("O ID e obrigatorio para atualizar.");
    const data = model.toPersistence();
    const keys = Object.keys(data);
    if (!keys.length) throw new ValidationError("Envie ao menos um campo para atualizar.");
    await ensureEmailAvailable(data.email, id);
    const assignments = keys.map((key, index) => `"${key}" = $${index + 1}`);
    assignments.push('"atualizado_em" = CURRENT_TIMESTAMP');
    const result = await query<UsuarioRecord>(
        `UPDATE "usuario" SET ${assignments.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
        [...Object.values(data), validateId(id)]
    );
    const row = result.rows[0];
    if (!row) throw new NotFoundError("Registro nao encontrado: usuario.");
    return Usuario.restore(row);
}

async function remove(id: string): Promise<void> {
    const result = await query('DELETE FROM "usuario" WHERE id = $1 RETURNING id', [validateId(id)]);
    if (!result.rows.length) throw new NotFoundError("Registro nao encontrado: usuario.");
}

export default { findAll, searchByKeyword, findById, create, update, remove };
