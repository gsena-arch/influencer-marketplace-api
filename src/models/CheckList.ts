import { entities } from "./entities.js";
import { validateBody, validateField, validateId, restoreTimestamp } from "./validation.js";

const definition = entities.find(entity => entity.table === "check_list")!;

export interface CheckListData {
    conteudo_id?: string | null;
    matricula_id?: string | null;
    status?: boolean | null;
    data_realizacao?: string | null;
}

// PostgreSQL returns NUMERIC as string and TIMESTAMP as Date.
export interface CheckListRecord {
    id: string;
    conteudo_id: string | null;
    matricula_id: string | null;
    status: boolean | null;
    data_realizacao: Date | string | null;
}

export class CheckList {
    private id: string | undefined;
    private conteudo_id: string | null | undefined;
    private matricula_id: string | null | undefined;
    private status: boolean | null | undefined;
    private data_realizacao: string | null | undefined;

    private changes: Record<string, unknown> = {};

    constructor(data: CheckListData = {}) {
        const input = validateBody(definition, data) as CheckListData;
        this.changeConteudoId(input.conteudo_id);
        this.changeMatriculaId(input.matricula_id);
        this.changeStatus(input.status);
        this.changeDataRealizacao(input.data_realizacao);
    }

    static restore(row: CheckListRecord): CheckList {
        const model = new CheckList({
            conteudo_id: row.conteudo_id,
            matricula_id: row.matricula_id,
            status: row.status,
            data_realizacao: restoreTimestamp(row.data_realizacao),
        });
        model.id = validateId(row.id);

        model.changes = {};
        return model;
    }

    public getId(): string | undefined { return this.id; }
    public getConteudoId(): string | null | undefined { return this.conteudo_id; }
    public getMatriculaId(): string | null | undefined { return this.matricula_id; }
    public getStatus(): boolean | null | undefined { return this.status; }
    public getDataRealizacao(): string | null | undefined { return this.data_realizacao; }


    public changeConteudoId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.conteudo_id = validateField(definition, "conteudo_id", value) as string | null;
        this.changes.conteudo_id = this.conteudo_id;
    }

    public changeMatriculaId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.matricula_id = validateField(definition, "matricula_id", value) as string | null;
        this.changes.matricula_id = this.matricula_id;
    }

    public changeStatus(value: boolean | null | undefined): void {
        if (value === undefined) return;
        this.status = validateField(definition, "status", value) as boolean | null;
        this.changes.status = this.status;
    }

    public changeDataRealizacao(value: string | null | undefined): void {
        if (value === undefined) return;
        this.data_realizacao = validateField(definition, "data_realizacao", value) as string | null;
        this.changes.data_realizacao = this.data_realizacao;
    }

    public applyChanges(data: unknown): void {
        const input = validateBody(definition, data) as CheckListData;
        if (input.conteudo_id !== undefined) this.changeConteudoId(input.conteudo_id);
        if (input.matricula_id !== undefined) this.changeMatriculaId(input.matricula_id);
        if (input.status !== undefined) this.changeStatus(input.status);
        if (input.data_realizacao !== undefined) this.changeDataRealizacao(input.data_realizacao);
    }

    public toPersistence(): Record<string, unknown> {
        return { ...this.changes };
    }

    public toJSON() {
        return {
            id: this.id,
            conteudo_id: this.conteudo_id,
            matricula_id: this.matricula_id,
            status: this.status,
            data_realizacao: this.data_realizacao,
        };
    }
}
