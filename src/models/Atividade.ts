import { entities } from "./entities.js";
import { validateBody, validateField, validateId, restoreTimestamp } from "./validation.js";

const definition = entities.find(entity => entity.table === "atividade")!;

export interface AtividadeData {
    modulo_id?: string | null;
    conteudo_id?: string | null;
    titulo?: string | null;
    descricao?: string | null;
    tipo?: string | null;
}

export interface AtividadeRecord {
    id: string;
    modulo_id: string | null;
    conteudo_id: string | null;
    titulo: string | null;
    descricao: string | null;
    tipo: string | null;
    criado_em: Date | string | null;
    atualizado_em: Date | string | null;
}

export class Atividade {
    private id: string | undefined;
    private modulo_id: string | null | undefined;
    private conteudo_id: string | null | undefined;
    private titulo: string | null | undefined;
    private descricao: string | null | undefined;
    private tipo: string | null | undefined;
    private criado_em: string | null | undefined;
    private atualizado_em: string | null | undefined;
    private changes: Record<string, unknown> = {};

    constructor(data: AtividadeData = {}) {
        const input = validateBody(definition, data) as AtividadeData;
        this.changeModuloId(input.modulo_id);
        this.changeConteudoId(input.conteudo_id);
        this.rename(input.titulo);
        this.changeDescricao(input.descricao);
        this.changeTipo(input.tipo);
    }

    static restore(row: AtividadeRecord): Atividade {
        const model = new Atividade({
            modulo_id: row.modulo_id,
            conteudo_id: row.conteudo_id,
            titulo: row.titulo,
            descricao: row.descricao,
            tipo: row.tipo,
        });
        model.id = validateId(row.id);
        model.criado_em = restoreTimestamp(row.criado_em);
        model.atualizado_em = restoreTimestamp(row.atualizado_em);
        model.changes = {};
        return model;
    }

    public getId(): string | undefined { return this.id; }
    public getModuloId(): string | null | undefined { return this.modulo_id; }
    public getConteudoId(): string | null | undefined { return this.conteudo_id; }
    public getTitulo(): string | null | undefined { return this.titulo; }
    public getDescricao(): string | null | undefined { return this.descricao; }
    public getTipo(): string | null | undefined { return this.tipo; }
    public getCriadoEm(): string | null | undefined { return this.criado_em; }
    public getAtualizadoEm(): string | null | undefined { return this.atualizado_em; }

    public changeModuloId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.modulo_id = validateField(definition, "modulo_id", value) as string | null;
        this.changes.modulo_id = this.modulo_id;
    }

    public changeConteudoId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.conteudo_id = validateField(definition, "conteudo_id", value) as string | null;
        this.changes.conteudo_id = this.conteudo_id;
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

    public changeTipo(value: string | null | undefined): void {
        if (value === undefined) return;
        this.tipo = validateField(definition, "tipo", value) as string | null;
        this.changes.tipo = this.tipo;
    }

    public applyChanges(data: unknown): void {
        const input = validateBody(definition, data) as AtividadeData;
        if (input.modulo_id !== undefined) this.changeModuloId(input.modulo_id);
        if (input.conteudo_id !== undefined) this.changeConteudoId(input.conteudo_id);
        if (input.titulo !== undefined) this.rename(input.titulo);
        if (input.descricao !== undefined) this.changeDescricao(input.descricao);
        if (input.tipo !== undefined) this.changeTipo(input.tipo);
    }

    public toPersistence(): Record<string, unknown> {
        return { ...this.changes };
    }

    public toJSON() {
        return {
            id: this.id,
            modulo_id: this.modulo_id,
            conteudo_id: this.conteudo_id,
            titulo: this.titulo,
            descricao: this.descricao,
            tipo: this.tipo,
            criado_em: this.criado_em,
            atualizado_em: this.atualizado_em,
        };
    }
}
