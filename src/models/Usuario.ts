import { entities } from "./entities.js";
import { validateBody, validateField, validateId, restoreTimestamp } from "./validation.js";

const definition = entities.find(entity => entity.table === "usuario")!;

export interface UsuarioData {
    nome?: string | null;
    email?: string | null;
    status?: string | null;
}

// PostgreSQL returns NUMERIC as string and TIMESTAMP as Date.
export interface UsuarioRecord {
    id: string;
    nome: string | null;
    email: string | null;
    status: string | null;
    criado_em: Date | string | null;
    atualizado_em: Date | string | null;
}

export class Usuario {
    private id: string | undefined;
    private nome: string | null | undefined;
    private email: string | null | undefined;
    private status: string | null | undefined;
    private criado_em: string | null | undefined;
    private atualizado_em: string | null | undefined;
    private changes: Record<string, unknown> = {};

    constructor(data: UsuarioData = {}) {
        const input = validateBody(definition, data) as UsuarioData;
        this.rename(input.nome);
        this.changeEmail(input.email);
        this.changeStatus(input.status);
    }

    static restore(row: UsuarioRecord): Usuario {
        // Existing records can predate the current input rules.
        const model = new Usuario();
        model.nome = row.nome;
        model.email = row.email;
        model.status = row.status;
        model.id = validateId(row.id);
        model.criado_em = restoreTimestamp(row.criado_em);
        model.atualizado_em = restoreTimestamp(row.atualizado_em);
        model.changes = {};
        return model;
    }

    public getId(): string | undefined { return this.id; }
    public getNome(): string | null | undefined { return this.nome; }
    public getEmail(): string | null | undefined { return this.email; }
    public getStatus(): string | null | undefined { return this.status; }
    public getCriadoEm(): string | null | undefined { return this.criado_em; }
    public getAtualizadoEm(): string | null | undefined { return this.atualizado_em; }

    public rename(value: string | null | undefined): void {
        if (value === undefined) return;
        this.nome = validateField(definition, "nome", value) as string | null;
        this.changes.nome = this.nome;
    }

    public changeEmail(value: string | null | undefined): void {
        if (value === undefined) return;
        this.email = validateField(definition, "email", value) as string | null;
        this.changes.email = this.email;
    }

    public changeStatus(value: string | null | undefined): void {
        if (value === undefined) return;
        this.status = validateField(definition, "status", value) as string | null;
        this.changes.status = this.status;
    }

    public applyChanges(data: unknown): void {
        const input = validateBody(definition, data) as UsuarioData;
        if (input.nome !== undefined) this.rename(input.nome);
        if (input.email !== undefined) this.changeEmail(input.email);
        if (input.status !== undefined) this.changeStatus(input.status);
    }

    public toPersistence(): Record<string, unknown> {
        return { ...this.changes };
    }

    public toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            status: this.status,
            criado_em: this.criado_em,
            atualizado_em: this.atualizado_em,
        };
    }
}
