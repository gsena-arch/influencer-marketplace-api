import { entities } from "./entities.js";
import { validateBody, validateField, validateId, restoreDecimal } from "./validation.js";

const definition = entities.find(entity => entity.table === "criador_conteudo")!;

export interface CriadorConteudoData {
    usuario_id?: string | null;
    avaliacao_criador?: number | null;
    especialidade_id?: string | null;
}

// PostgreSQL returns NUMERIC as string and TIMESTAMP as Date.
export interface CriadorConteudoRecord {
    id: string;
    usuario_id: string | null;
    avaliacao_criador: number | string | null;
    especialidade_id: string | null;
}

export class CriadorConteudo {
    private id: string | undefined;
    private usuario_id: string | null | undefined;
    private avaliacao_criador: number | null | undefined;
    private especialidade_id: string | null | undefined;

    private changes: Record<string, unknown> = {};

    constructor(data: CriadorConteudoData = {}) {
        const input = validateBody(definition, data) as CriadorConteudoData;
        this.changeUsuarioId(input.usuario_id);
        this.changeAvaliacaoCriador(input.avaliacao_criador);
        this.changeEspecialidadeId(input.especialidade_id);
    }

    static restore(row: CriadorConteudoRecord): CriadorConteudo {
        const model = new CriadorConteudo({
            usuario_id: row.usuario_id,
            avaliacao_criador: restoreDecimal(row.avaliacao_criador),
            especialidade_id: row.especialidade_id,
        });
        model.id = validateId(row.id);

        model.changes = {};
        return model;
    }

    public getId(): string | undefined { return this.id; }
    public getUsuarioId(): string | null | undefined { return this.usuario_id; }
    public getAvaliacaoCriador(): number | null | undefined { return this.avaliacao_criador; }
    public getEspecialidadeId(): string | null | undefined { return this.especialidade_id; }


    public changeUsuarioId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.usuario_id = validateField(definition, "usuario_id", value) as string | null;
        this.changes.usuario_id = this.usuario_id;
    }

    public changeAvaliacaoCriador(value: number | null | undefined): void {
        if (value === undefined) return;
        this.avaliacao_criador = validateField(definition, "avaliacao_criador", value) as number | null;
        this.changes.avaliacao_criador = this.avaliacao_criador;
    }

    public changeEspecialidadeId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.especialidade_id = validateField(definition, "especialidade_id", value) as string | null;
        this.changes.especialidade_id = this.especialidade_id;
    }

    public applyChanges(data: unknown): void {
        const input = validateBody(definition, data) as CriadorConteudoData;
        if (input.usuario_id !== undefined) this.changeUsuarioId(input.usuario_id);
        if (input.avaliacao_criador !== undefined) this.changeAvaliacaoCriador(input.avaliacao_criador);
        if (input.especialidade_id !== undefined) this.changeEspecialidadeId(input.especialidade_id);
    }

    public toPersistence(): Record<string, unknown> {
        return { ...this.changes };
    }

    public toJSON() {
        return {
            id: this.id,
            usuario_id: this.usuario_id,
            avaliacao_criador: this.avaliacao_criador == null ? this.avaliacao_criador : this.avaliacao_criador.toFixed(2),
            especialidade_id: this.especialidade_id,
        };
    }
}
