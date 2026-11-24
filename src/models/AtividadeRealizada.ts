import { entities } from "./entities.js";
import { validateBody, validateField, validateId, restoreTimestamp, restoreDecimal } from "./validation.js";

const definition = entities.find(entity => entity.table === "atividade_realizada")!;

export interface AtividadeRealizadaData {
    atividade_id?: string | null;
    matricula_id?: string | null;
    nota?: number | null;
    status?: string | null;
    data_realizacao?: string | null;
}

// PostgreSQL returns NUMERIC as string and TIMESTAMP as Date.
export interface AtividadeRealizadaRecord {
    id: string;
    atividade_id: string | null;
    matricula_id: string | null;
    nota: number | string | null;
    status: string | null;
    data_realizacao: Date | string | null;
}

export class AtividadeRealizada {
    private id: string | undefined;
    private atividade_id: string | null | undefined;
    private matricula_id: string | null | undefined;
    private nota: number | null | undefined;
    private status: string | null | undefined;
    private data_realizacao: string | null | undefined;

    private changes: Record<string, unknown> = {};

    constructor(data: AtividadeRealizadaData = {}) {
        const input = validateBody(definition, data) as AtividadeRealizadaData;
        this.changeAtividadeId(input.atividade_id);
        this.changeMatriculaId(input.matricula_id);
        this.changeNota(input.nota);
        this.changeStatus(input.status);
        this.changeDataRealizacao(input.data_realizacao);
    }

    static restore(row: AtividadeRealizadaRecord): AtividadeRealizada {
        const model = new AtividadeRealizada({
            atividade_id: row.atividade_id,
            matricula_id: row.matricula_id,
            nota: restoreDecimal(row.nota),
            status: row.status,
            data_realizacao: restoreTimestamp(row.data_realizacao),
        });
        model.id = validateId(row.id);

        model.changes = {};
        return model;
    }

    public getId(): string | undefined { return this.id; }
    public getAtividadeId(): string | null | undefined { return this.atividade_id; }
    public getMatriculaId(): string | null | undefined { return this.matricula_id; }
    public getNota(): number | null | undefined { return this.nota; }
    public getStatus(): string | null | undefined { return this.status; }
    public getDataRealizacao(): string | null | undefined { return this.data_realizacao; }


    public changeAtividadeId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.atividade_id = validateField(definition, "atividade_id", value) as string | null;
        this.changes.atividade_id = this.atividade_id;
    }

    public changeMatriculaId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.matricula_id = validateField(definition, "matricula_id", value) as string | null;
        this.changes.matricula_id = this.matricula_id;
    }

    public changeNota(value: number | null | undefined): void {
        if (value === undefined) return;
        this.nota = validateField(definition, "nota", value) as number | null;
        this.changes.nota = this.nota;
    }

    public changeStatus(value: string | null | undefined): void {
        if (value === undefined) return;
        this.status = validateField(definition, "status", value) as string | null;
        this.changes.status = this.status;
    }

    public changeDataRealizacao(value: string | null | undefined): void {
        if (value === undefined) return;
        this.data_realizacao = validateField(definition, "data_realizacao", value) as string | null;
        this.changes.data_realizacao = this.data_realizacao;
    }

    public applyChanges(data: unknown): void {
        const input = validateBody(definition, data) as AtividadeRealizadaData;
        if (input.atividade_id !== undefined) this.changeAtividadeId(input.atividade_id);
        if (input.matricula_id !== undefined) this.changeMatriculaId(input.matricula_id);
        if (input.nota !== undefined) this.changeNota(input.nota);
        if (input.status !== undefined) this.changeStatus(input.status);
        if (input.data_realizacao !== undefined) this.changeDataRealizacao(input.data_realizacao);
    }

    public toPersistence(): Record<string, unknown> {
        return { ...this.changes };
    }

    public toJSON() {
        return {
            id: this.id,
            atividade_id: this.atividade_id,
            matricula_id: this.matricula_id,
            nota: this.nota == null ? this.nota : this.nota.toFixed(2),
            status: this.status,
            data_realizacao: this.data_realizacao,
        };
    }
}
