import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { entities } from "../models/entities.js";

const { database } = vi.hoisted(() => ({ database: { query: vi.fn() } }));
vi.mock("../config/database.js", () => ({ pool: database }));
import app from "../app.js";
import spec from "../config/swagger.js";

// supertest does not ship TypeScript declarations in this project.
const { default: request } = await import("supertest" as string);
const db = new PGlite();
beforeAll(async () => {
    await db.exec(readFileSync("db/migrations/000_initial.sql", "utf8"));
    await db.exec(readFileSync("db/migrations/001_regras_de_unicidade.sql", "utf8"));
    database.query.mockImplementation((sql: string, values?: unknown[]) => db.query(sql, values));
});
afterAll(async () => { await db.close(); });

describe("CRUD das entidades", () => {
    for (const entity of entities) {
        it(`atualiza somente um campo de ${entity.table} e preserva os demais dados`, async () => {
            const url = `/${entity.table}`;
            const writableFields = entity.fields.filter(field => !["id", "criado_em", "atualizado_em"].includes(field.name));
            const data = Object.fromEntries(writableFields.map(field => [
                field.name,
                field.format === "email" ? "original@example.com"
                    : field.type === "uuid" ? null
                    : field.type === "boolean" ? true
                    : field.type === "decimal" ? 4.5
                    : field.type === "timestamp" ? "2026-01-01T12:00:00.000Z"
                    : "Valor original"
            ]));
            const field = writableFields.find(field => ["string", "text", "boolean", "decimal"].includes(field.type))!;
            const value = field.type === "boolean" ? false : field.type === "decimal" ? 0 : "Valor atualizado";
            const created = await request(app).post(url).send(data);
            expect(created.status).toBe(201);
            const path = `${url}/${created.body.id}`;

            try {
                const updated = await request(app).put(path).send({ [field.name]: value });
                expect(updated.status).toBe(200);
                const expected = {
                    ...created.body,
                    [field.name]: field.type === "decimal" ? "0.00" : value,
                    ...("atualizado_em" in created.body ? { atualizado_em: expect.any(String) } : {})
                };
                expect(updated.body).toEqual(expected);
                expect((await request(app).get(path)).body).toEqual(updated.body);

                const cleared = await request(app).put(path).send({ [field.name]: null });
                expect(cleared.status).toBe(200);
                expect(cleared.body).toEqual({ ...expected, [field.name]: null });

                expect((await request(app).put(path).send({})).status).toBe(400);
                expect((await request(app).put(path).send({ desconhecido: "valor" })).status).toBe(400);
                expect((await request(app).get(path)).body).toEqual(cleared.body);
            } finally {
                await request(app).delete(path);
            }
        });

        it(`cria, lista, busca, atualiza e exclui ${entity.table}`, async () => {
            const url = `/${entity.table}`;
            const created = await request(app).post(url).send({});
            expect(created.status).toBe(201);
            const id = created.body.id;
            expect((await request(app).get(url)).body).toEqual([created.body]);
            expect((await request(app).get(`${url}/${id}`)).status).toBe(200);
            const field = entity.fields.find(field => !["id", "criado_em", "atualizado_em"].includes(field.name))!;
            expect((await request(app).put(`${url}/${id}`).send({ [field.name]: null })).status).toBe(200);
            expect((await request(app).delete(`${url}/${id}`)).status).toBe(204);
            expect((await request(app).get(`${url}/${id}`)).status).toBe(404);
            expect((await request(app).put(`${url}/${id}`).send({ [field.name]: null })).status).toBe(404);
            expect((await request(app).delete(`${url}/${id}`)).status).toBe(404);
        });
    }
    it("rejeita IDs, campos desconhecidos, tipos e JSON inválidos", async () => {
        expect((await request(app).get('/curso/invalido')).status).toBe(400);
        expect((await request(app).post('/curso').send({ tabela: 'usuario' })).status).toBe(400);
        expect((await request(app).post('/curso').send({ titulo: 42 })).status).toBe(400);
        expect((await request(app).post('/curso').send({ titulo: 'a'.repeat(151) })).status).toBe(400);
        expect((await request(app).post('/curso').set('Content-Type', 'application/json').send('{')).status).toBe(400);
    });
    it("trata referências inválidas e impede excluir um curso com módulo", async () => {
        expect((await request(app).post('/modulo').send({ curso_id: '11111111-1111-4111-8111-111111111111' })).status).toBe(409);
        const curso = await request(app).post('/curso').send({ titulo: 'Curso' });
        const modulo = await request(app).post('/modulo').send({ curso_id: curso.body.id });
        expect((await request(app).delete(`/curso/${curso.body.id}`)).status).toBe(409);
        expect((await request(app).put(`/curso/${curso.body.id}`).send({})).status).toBe(400);
        await request(app).delete(`/modulo/${modulo.body.id}`);
        await request(app).delete(`/curso/${curso.body.id}`);
    });
    it("pesquisa campos de texto e valida a palavra-chave antes do ID", async () => {
        const created = await request(app).post('/curso').send({ titulo: 'Introdução ao SQL' });
        const found = await request(app).get('/curso/search').query({ keyword: 'sql' });
        expect(found.status).toBe(200);
        expect(found.body.map((record: { id: string }) => record.id)).toContain(created.body.id);
        expect((await request(app).get('/curso/search')).status).toBe(400);
        expect((await request(app).get('/curso/search').query({ keyword: '   ' })).status).toBe(400);
        const noText = await request(app).get('/criador_conteudo/search').query({ keyword: 'sql' });
        expect(noText.status).toBe(200);
        expect(noText.body).toEqual([]);
        await request(app).delete(`/curso/${created.body.id}`);
    });
    it("documenta as 60 operações e resolve todos os schemas referenciados", () => {
        const document = spec as any;
        expect(document.openapi).toBe('3.0.3');
        expect(document.servers[0].url).toBe('/');
        expect(document.tags).toHaveLength(10);
        expect(Object.keys(document.components.schemas)).toHaveLength(31);
        expect(Object.keys(document.paths)).toHaveLength(30);
        for (const entity of entities) {
            const name = entity.table.split('_').map(part => part[0]!.toUpperCase() + part.slice(1)).join('');
            expect(document.paths[`/${entity.table}`].post.requestBody.content['application/json'].schema.$ref)
                .toBe(`#/components/schemas/Create${name}`);
            expect(document.paths[`/${entity.table}/{id}`].put.requestBody.content['application/json'].schema.$ref)
                .toBe(`#/components/schemas/Update${name}`);
            expect(document.components.schemas[`Update${name}`].minProperties).toBe(1);
            expect(Object.keys(document.components.schemas[`Update${name}`].example)).toHaveLength(1);
            expect(Object.keys(document.paths[`/${entity.table}`])).toEqual(['get', 'post']);
            expect(document.paths[`/${entity.table}/{id}`]).toHaveProperty('put');
            expect(document.paths[`/${entity.table}/{id}`]).toHaveProperty('delete');
            expect(document.paths[`/${entity.table}/{id}`]).toHaveProperty('get');
        }
        for (const match of JSON.stringify(document).matchAll(/#\/components\/schemas\/([^"\\]+)/g)) {
            expect(document.components.schemas[match[1]!]).toBeDefined();
        }
    });
});
