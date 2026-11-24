import { entities } from "./entities.js";
import { validateBody, validateField, validateId, restoreTimestamp } from "./validation.js";

const definition = entities.find(entity => entity.table === "matricula")!;

export interface MatriculaData {
    usuario_id?: string | null;
    curso_id?: string | null;
    data_matricula?: string | null;
    status?: string | null;
}

// PostgreSQL returns NUMERIC as string and TIMESTAMP as Date.
export interface MatriculaRecord {
    id: string;
    usuario_id: string | null;
    curso_id: string | null;
    data_matricula: Date | string | null;
    status: string | null;
}

export class Matricula {
    private id: string | undefined;
    private usuario_id: string | null | undefined;
    private curso_id: string | null | undefined;
    private data_matricula: string | null | undefined;
    private status: string | null | undefined;

    private changes: Record<string, unknown> = {};

    constructor(data: MatriculaData = {}) {
        const input = validateBody(definition, data) as MatriculaData;
        this.changeUsuarioId(input.usuario_id);
        this.changeCursoId(input.curso_id);
        this.changeDataMatricula(input.data_matricula);
        this.changeStatus(input.status);
    }

    static restore(row: MatriculaRecord): Matricula {
        const model = new Matricula({
            usuario_id: row.usuario_id,
            curso_id: row.curso_id,
            data_matricula: restoreTimestamp(row.data_matricula),
            status: row.status,
        });
        model.id = validateId(row.id);

        model.changes = {};
        return model;
    }

    public getId(): string | undefined { return this.id; }
    public getUsuarioId(): string | null | undefined { return this.usuario_id; }
    public getCursoId(): string | null | undefined { return this.curso_id; }
    public getDataMatricula(): string | null | undefined { return this.data_matricula; }
    public getStatus(): string | null | undefined { return this.status; }


    public changeUsuarioId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.usuario_id = validateField(definition, "usuario_id", value) as string | null;
        this.changes.usuario_id = this.usuario_id;
    }

    public changeCursoId(value: string | null | undefined): void {
        if (value === undefined) return;
        this.curso_id = validateField(definition, "curso_id", value) as string | null;
        this.changes.curso_id = this.curso_id;
    }

    public changeDataMatricula(value: string | null | undefined): void {
        if (value === undefined) return;
        this.data_matricula = validateField(definition, "data_matricula", value) as string | null;
        this.changes.data_matricula = this.data_matricula;
    }

    public changeStatus(value: string | null | undefined): void {
        if (value === undefined) return;
        this.status = validateField(definition, "status", value) as string | null;
        this.changes.status = this.status;
    }

    public applyChanges(data: unknown): void {
        const input = validateBody(definition, data) as MatriculaData;
        if (input.usuario_id !== undefined) this.changeUsuarioId(input.usuario_id);
        if (input.curso_id !== undefined) this.changeCursoId(input.curso_id);
        if (input.data_matricula !== undefined) this.changeDataMatricula(input.data_matricula);
        if (input.status !== undefined) this.changeStatus(input.status);
    }

    public toPersistence(): Record<string, unknown> {
        return { ...this.changes };
    }

    public toJSON() {
        return {
            id: this.id,
            usuario_id: this.usuario_id,
            curso_id: this.curso_id,
            data_matricula: this.data_matricula,
            status: this.status,
        };
    }
}
