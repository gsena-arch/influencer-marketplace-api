import { entities } from "./entities.js";
import { validateBody, validateField, validateId } from "./validation.js";

const definition = entities.find(entity => entity.table === "especialidade_criador")!;

export interface EspecialidadeCriadorData {
    nome?: string | null;
    descricao?: string | null;
}

// PostgreSQL returns NUMERIC as string and TIMESTAMP as Date.
export interface EspecialidadeCriadorRecord {
    id: string;
    nome: string | null;
    descricao: string | null;
}

export class EspecialidadeCriador {
    private id: string | undefined;
    private nome: string | null | undefined;
    private descricao: string | null | undefined;

    private changes: Record<string, unknown> = {};

    constructor(data: EspecialidadeCriadorData = {}) {
        const input = validateBody(definition, data) as EspecialidadeCriadorData;
        this.rename(input.nome);
        this.changeDescricao(input.descricao);
    }

    static restore(row: EspecialidadeCriadorRecord): EspecialidadeCriador {
        const model = new EspecialidadeCriador({
            nome: row.nome,
            descricao: row.descricao,
        });
        model.id = validateId(row.id);

        model.changes = {};
        return model;
    }

    public getId(): string | undefined { return this.id; }
    public getNome(): string | null | undefined { return this.nome; }
    public getDescricao(): string | null | undefined { return this.descricao; }


    public rename(value: string | null | undefined): void {
        if (value === undefined) return;
        this.nome = validateField(definition, "nome", value) as string | null;
        this.changes.nome = this.nome;
    }

    public changeDescricao(value: string | null | undefined): void {
        if (value === undefined) return;
        this.descricao = validateField(definition, "descricao", value) as string | null;
        this.changes.descricao = this.descricao;
    }

    public applyChanges(data: unknown): void {
        const input = validateBody(definition, data) as EspecialidadeCriadorData;
        if (input.nome !== undefined) this.rename(input.nome);
        if (input.descricao !== undefined) this.changeDescricao(input.descricao);
    }

    public toPersistence(): Record<string, unknown> {
        return { ...this.changes };
    }

    public toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            descricao: this.descricao,
        };
    }
}
