import { entities } from "./entities.js";
import { validateBody, validateField, validateId, restoreTimestamp } from "./validation.js";

const definition = entities.find(entity => entity.table === "conteudo")!;

export interface ConteudoData {
    modulo_id?: string | null;
    titulo?: string | null;
    conteudo?: string | null;
}

// PostgreSQL returns NUMERIC as string and TIMESTAMP as Date.
export interface ConteudoRecord {
    id: string;
    modulo_id: string | null;
    titulo: string | null;
    conteudo: string | null;
    criado_em: Date | string | null;
    atualizado_em: Date | string | null;
}

export class Conteudo {
    private id: string | undefined;
    private modulo_id: string | null | undefined;
    private titulo: string | null | undefined;
    private conteudo: string | null | undefined;
    private criado_em: string | null | undefined;
    private atualizado_em: string | null | undefined;
    private changes: Record<string, unknown> = {};

    constructor(data: ConteudoData = {}) {
        const input = validateBody(definition, data) as ConteudoData;
        this.changeModuloId(input.modulo_id);
        this.rename(input.titulo);
        this.changeConteudo(input.conteudo);
    }

    static restore(row: ConteudoRecord): Conteudo {
        const model = new Conteudo({
            modulo_id: row.modulo_id,
            titulo: row.titulo,
            conteudo: row.conteudo,
        });
        model.id = validateId(row.id);
        model.criado_em = restoreTimestamp(row.criado_em);
        model.atualizado_em = restoreTimestamp(row.atualizado_em);
        model.changes = {};
        return model;
    }

    public getId(): string | undefined { return this.id; }
    public getModuloId(): string | null | undefined { return this.modulo_id; }
    public getTitulo(): string | null | undefined { return this.titulo; }
    public getConteudo(): string | null | undefined { return this.conteudo; }
    public getCriadoEm(): string | null | undefined { return this.criado_em; }
    public getAtualizadoEm(): string | null | undefined { return this.atualizado_em; }

    public changeModuloId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.modulo_id = validateField(definition, "modulo_id", value) as string | null;
        this.changes.modulo_id = this.modulo_id;
    }

    public rename(value: string | null | undefined): void {
        if (value === undefined) return;
        this.titulo = validateField(definition, "titulo", value) as string | null;
        this.changes.titulo = this.titulo;
    }

    public changeConteudo(value: string | null | undefined): void {
        if (value === undefined) return;
        this.conteudo = validateField(definition, "conteudo", value) as string | null;
        this.changes.conteudo = this.conteudo;
    }

    public applyChanges(data: unknown): void {
        const input = validateBody(definition, data) as ConteudoData;
        if (input.modulo_id !== undefined) this.changeModuloId(input.modulo_id);
        if (input.titulo !== undefined) this.rename(input.titulo);
        if (input.conteudo !== undefined) this.changeConteudo(input.conteudo);
    }

    public toPersistence(): Record<string, unknown> {
        return { ...this.changes };
    }

    public toJSON() {
        return {
            id: this.id,
            modulo_id: this.modulo_id,
            titulo: this.titulo,
            conteudo: this.conteudo,
            criado_em: this.criado_em,
            atualizado_em: this.atualizado_em,
        };
    }
}
