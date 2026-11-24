import { entities } from "./entities.js";
import { validateBody, validateField, validateId, restoreTimestamp } from "./validation.js";

const definition = entities.find(entity => entity.table === "curso")!;

export interface CursoData {
    codigo_unico?: string | null;
    titulo?: string | null;
    descricao?: string | null;
    criador_id?: string | null;
}

// PostgreSQL returns NUMERIC as string and TIMESTAMP as Date.
export interface CursoRecord {
    id: string;
    codigo_unico: string | null;
    titulo: string | null;
    descricao: string | null;
    criado_em: Date | string | null;
    atualizado_em: Date | string | null;
    criador_id: string | null;
}

export class Curso {
    private id: string | undefined;
    private codigo_unico: string | null | undefined;
    private titulo: string | null | undefined;
    private descricao: string | null | undefined;
    private criador_id: string | null | undefined;
    private criado_em: string | null | undefined;
    private atualizado_em: string | null | undefined;
    private changes: Record<string, unknown> = {};

    constructor(data: CursoData = {}) {
        const input = validateBody(definition, data) as CursoData;
        this.changeCodigoUnico(input.codigo_unico);
        this.rename(input.titulo);
        this.changeDescricao(input.descricao);
        this.changeCriadorId(input.criador_id);
    }

    static restore(row: CursoRecord): Curso {
        const model = new Curso({
            codigo_unico: row.codigo_unico,
            titulo: row.titulo,
            descricao: row.descricao,
            criador_id: row.criador_id,
        });
        model.id = validateId(row.id);
        model.criado_em = restoreTimestamp(row.criado_em);
        model.atualizado_em = restoreTimestamp(row.atualizado_em);
        model.changes = {};
        return model;
    }

    public getId(): string | undefined { return this.id; }
    public getCodigoUnico(): string | null | undefined { return this.codigo_unico; }
    public getTitulo(): string | null | undefined { return this.titulo; }
    public getDescricao(): string | null | undefined { return this.descricao; }
    public getCriadorId(): string | null | undefined { return this.criador_id; }
    public getCriadoEm(): string | null | undefined { return this.criado_em; }
    public getAtualizadoEm(): string | null | undefined { return this.atualizado_em; }

    public changeCodigoUnico(value: string | null | undefined): void {
        if (value === undefined) return;
        this.codigo_unico = validateField(definition, "codigo_unico", value) as string | null;
        this.changes.codigo_unico = this.codigo_unico;
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

    public changeCriadorId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.criador_id = validateField(definition, "criador_id", value) as string | null;
        this.changes.criador_id = this.criador_id;
    }

    public applyChanges(data: unknown): void {
        const input = validateBody(definition, data) as CursoData;
        if (input.codigo_unico !== undefined) this.changeCodigoUnico(input.codigo_unico);
        if (input.titulo !== undefined) this.rename(input.titulo);
        if (input.descricao !== undefined) this.changeDescricao(input.descricao);
        if (input.criador_id !== undefined) this.changeCriadorId(input.criador_id);
    }

    public toPersistence(): Record<string, unknown> {
        return { ...this.changes };
    }

    public toJSON() {
        return {
            id: this.id,
            codigo_unico: this.codigo_unico,
            titulo: this.titulo,
            descricao: this.descricao,
            criado_em: this.criado_em,
            atualizado_em: this.atualizado_em,
            criador_id: this.criador_id,
        };
    }
}
