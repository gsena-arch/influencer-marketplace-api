import { randomUUID } from "node:crypto";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import app from "../app.js";
import { pool } from "../config/database.js";
import { entities, type Entity, type Field } from "../models/entities.js";

const { default: request } = await import("supertest" as string);

type CreatedRecord = { table: string; id: string };

const createdRecords: CreatedRecord[] = [];

function writableFields(entity: Entity): Field[] {
    return entity.fields.filter(field => !["id", "criado_em", "atualizado_em"].includes(field.name));
}

function makeData(entity: Entity) {
    const marker = `vt-${randomUUID().replaceAll("-", "").slice(0, 16)}`;
    const data: Record<string, unknown> = {};

    for (const field of writableFields(entity)) {
        if (field.format === "email") data[field.name] = `${marker}@example.com`;
        else if (field.type === "string" || field.type === "text") data[field.name] = marker.slice(0, field.maxLength);
        else if (field.type === "decimal") data[field.name] = 4.5;
        else if (field.type === "boolean") data[field.name] = false;
        else if (field.type === "timestamp") data[field.name] = "2026-01-01T12:00:00.000Z";
        else if (field.type === "uuid") data[field.name] = null;
    }

    return { data };
}

function expectedData(entity: Entity, data: Record<string, unknown>) {
    return Object.fromEntries(Object.entries(data).map(([name, value]) => {
        const field = entity.fields.find(field => field.name === name)!;
        return [name, field.type === "decimal" && typeof value === "number"
            ? value.toFixed(field.scale ?? 2) : value];
    }));
}

async function createRecord(entity: Entity, data: Record<string, unknown>) {
    const response = await request(app).post(`/${entity.table}`).send(data);
    expect(response.status, JSON.stringify(response.body)).toBe(201);
    createdRecords.push({ table: entity.table, id: response.body.id });
    return response;
}

async function removeCreatedRecords() {
    // Deleta somente IDs criados por este arquivo; dados existentes permanecem intactos.
    for (const record of [...createdRecords].reverse()) {
        await pool.query(`DELETE FROM "${record.table}" WHERE id = $1`, [record.id]);
    }
    createdRecords.length = 0;
}

beforeAll(async () => {
    await pool.query("SELECT 1");
});

afterEach(async () => {
    await removeCreatedRecords();
});

afterAll(async () => {
    await pool.end();
});

describe("API - testes de integração com PostgreSQL", () => {
    it.each([
        "2026-01-01T12:00:00.000Z",
        "2026-01-01T09:00:00-03:00",
        "2026-01-01T12:00:00"
    ])("preserva a data %s em UTC ao criar, consultar e atualizar", async value => {
        const entity = entities.find(entity => entity.table === "check_list")!;
        const created = await createRecord(entity, { status: false, data_realizacao: value });
        const path = `/check_list/${created.body.id}`;
        expect(created.body.data_realizacao).toBe("2026-01-01T12:00:00.000Z");
        expect((await request(app).get(path)).body.data_realizacao).toBe("2026-01-01T12:00:00.000Z");

        const updated = await request(app).put(path).send({ data_realizacao: "2026-01-02T09:00:00-03:00" });
        expect(updated.status).toBe(200);
        expect(updated.body.data_realizacao).toBe("2026-01-02T12:00:00.000Z");
        expect(updated.body.status).toBe(false);
        expect((await request(app).get(path)).body.data_realizacao).toBe("2026-01-02T12:00:00.000Z");
    });

    for (const entity of entities) {
        describe(entity.table, () => {
            it("deve criar um registro válido", async () => {
                const { data } = makeData(entity);
                const response = await createRecord(entity, data);

                expect(response.status).toBe(201);
                expect(response.body.id).toEqual(expect.any(String));
                expect(response.body).toMatchObject(expectedData(entity, data));
            }, 20_000);

            it("deve listar o registro criado", async () => {
                const { data } = makeData(entity);
                const created = await createRecord(entity, data);

                const response = await request(app).get(`/${entity.table}`);

                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({ id: created.body.id }),
                ]));
            }, 20_000);

            it("deve consultar o registro existente pelo ID", async () => {
                const { data } = makeData(entity);
                const created = await createRecord(entity, data);

                const response = await request(app).get(`/${entity.table}/${created.body.id}`);

                expect(response.status).toBe(200);
                expect(response.body).toMatchObject({ id: created.body.id, ...expectedData(entity, data) });
            }, 20_000);

            it("deve buscar por palavra-chave quando a entidade possui campos de texto", async () => {
                const { data } = makeData(entity);
                const textField = writableFields(entity).find(field => field.type === "string" || field.type === "text");

                const created = await createRecord(entity, data);

                const response = await request(app)
                    .get(`/${entity.table}/search`)
                    .query({ keyword: textField ? data[textField.name] : "qualquer-coisa" });

                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
                if (textField) {
                    expect(response.body).toEqual(expect.arrayContaining([
                        expect.objectContaining({ id: created.body.id }),
                    ]));
                }
            }, 20_000);

            it("deve atualizar o registro existente", async () => {
                const { data } = makeData(entity);
                const created = await createRecord(entity, data);
                const field = writableFields(entity)[0]!;
                const updatedValue = field.type === "boolean" ? true : field.type === "decimal" ? 3.5 : null;

                const response = await request(app)
                    .put(`/${entity.table}/${created.body.id}`)
                    .send({ [field.name]: updatedValue });

                expect(response.status).toBe(200);
                expect(response.body).toMatchObject({ id: created.body.id, ...expectedData(entity, { [field.name]: updatedValue }) });
            }, 20_000);

            it("deve remover o registro existente", async () => {
                const created = await createRecord(entity, {});

                const response = await request(app).delete(`/${entity.table}/${created.body.id}`);

                expect(response.status).toBe(204);
                expect((await request(app).get(`/${entity.table}/${created.body.id}`)).status).toBe(404);
            }, 20_000);
        });
    }

    it("deve rejeitar ID inválido", async () => {
        const response = await request(app).get("/usuario/id-invalido");
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("ID inválido");
    });

    it("deve rejeitar campos desconhecidos", async () => {
        const response = await request(app).post("/usuario").send({ campo_inexistente: true });
        expect(response.status).toBe(400);
    });
});
