import { entities } from "./entities.js";
import { validateBody, validateField, validateId, restoreTimestamp } from "./validation.js";

const definition = entities.find(entity => entity.table === "modulo")!;

export interface ModuloData {
    curso_id?: string | null;
    titulo?: string | null;
    descricao?: string | null;
}

// PostgreSQL returns NUMERIC as string and TIMESTAMP as Date.
export interface ModuloRecord {
    id: string;
    curso_id: string | null;
    titulo: string | null;
    descricao: string | null;
    criado_em: Date | string | null;
    atualizado_em: Date | string | null;
}

export class Modulo {
    private id: string | undefined;
    private curso_id: string | null | undefined;
    private titulo: string | null | undefined;
    private descricao: string | null | undefined;
    private criado_em: string | null | undefined;
    private atualizado_em: string | null | undefined;
    private changes: Record<string, unknown> = {};

    constructor(data: ModuloData = {}) {
        const input = validateBody(definition, data) as ModuloData;
        this.changeCursoId(input.curso_id);
        this.rename(input.titulo);
        this.changeDescricao(input.descricao);
    }

    static restore(row: ModuloRecord): Modulo {
        const model = new Modulo({
            curso_id: row.curso_id,
            titulo: row.titulo,
            descricao: row.descricao,
        });
        model.id = validateId(row.id);
        model.criado_em = restoreTimestamp(row.criado_em);
        model.atualizado_em = restoreTimestamp(row.atualizado_em);
        model.changes = {};
        return model;
    }

    public getId(): string | undefined { return this.id; }
    public getCursoId(): string | null | undefined { return this.curso_id; }
    public getTitulo(): string | null | undefined { return this.titulo; }
    public getDescricao(): string | null | undefined { return this.descricao; }
    public getCriadoEm(): string | null | undefined { return this.criado_em; }
    public getAtualizadoEm(): string | null | undefined { return this.atualizado_em; }

    public changeCursoId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.curso_id = validateField(definition, "curso_id", value) as string | null;
        this.changes.curso_id = this.curso_id;
    }

    public rename(value: string | null | undefined): void {
        if (value === undefined) return;
        this.titulo = validateField(definition, "titulo", value) as string | null;
        this.changes.titulo = this.titulo;
    }

    public changeDescricao(value: string | null | undefined): void {
        if (value === undefined) return;
        this.descricao = validateField(definition, "descricao", value) as string | null;
        this.changes.descricao = this.descricao;
    }

    public applyChanges(data: unknown): void {
        const input = validateBody(definition, data) as ModuloData;
        if (input.curso_id !== undefined) this.changeCursoId(input.curso_id);
        if (input.titulo !== undefined) this.rename(input.titulo);
        if (input.descricao !== undefined) this.changeDescricao(input.descricao);
    }

    public toPersistence(): Record<string, unknown> {
        return { ...this.changes };
    }

    public toJSON() {
        return {
            id: this.id,
            curso_id: this.curso_id,
            titulo: this.titulo,
            descricao: this.descricao,
            criado_em: this.criado_em,
            atualizado_em: this.atualizado_em,
        };
    }
}
