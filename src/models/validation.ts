import { z } from "zod";
import type { Entity, Field } from "../models/entities.js";
import { ValidationError } from "../errors/ValidationError.js";

function timestampDate(value: string): Date {
    const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
    return new Date(hasTimezone ? value : `${value}Z`);
}

function fieldSchema(field: Field): z.ZodType {
    if (field.format === "email") {
        return z.string().trim().toLowerCase().max(field.maxLength ?? 255).email("Informe um e-mail válido.");
    }
    switch (field.type) {
        case "uuid": return z.guid();
        case "timestamp": return z.iso.datetime({ local: true, offset: true })
            .transform(value => timestampDate(value).toISOString());
        case "boolean": return z.boolean();
        case "decimal": {
            const limit = 10 ** ((field.precision ?? 5) - (field.scale ?? 2));
            return z.number().gt(-limit).lt(limit).multipleOf(10 ** -(field.scale ?? 2));
        }
        default: return field.maxLength ? z.string().max(field.maxLength) : z.string();
    }
}

export function validateField(entity: Entity, name: string, value: unknown): unknown {
    const field = entity.fields.find(field => field.name === name);
    if (!field) throw new ValidationError(`Campo desconhecido: ${name}.`);
    const result = fieldSchema(field).nullable().optional().safeParse(value);
    if (!result.success) {
        throw new ValidationError(`${name}: ${result.error.issues.map(issue => issue.message).join("; ")}`);
    }
    return result.data;
}

export function restoreTimestamp(value: Date | string | null): string | null {
    if (value === null) return null;
    const date = value instanceof Date ? value : timestampDate(value);
    if (!Number.isFinite(date.getTime())) throw new ValidationError("Data inválida no registro persistido.");
    return date.toISOString();
}

export function restoreDecimal(value: string | number | null): number | null {
    if (value === null) return null;
    const number = Number(value);
    if (!Number.isFinite(number)) throw new ValidationError("Decimal inválido no registro persistido.");
    return number;
}

export function validateId(id: string): string {
    if (!z.guid().safeParse(id).success) throw new ValidationError("ID inválido. Informe um UUID válido.");
    return id;
}

export function validateBody(entity: Entity, body: unknown): Record<string, unknown> {
    const fields = entity.fields.filter(field => !["id", "criado_em", "atualizado_em"].includes(field.name));
    const schema = z.strictObject(Object.fromEntries(fields.map(field => [field.name, fieldSchema(field).nullable().optional()])));
    const result = schema.safeParse(body);
    if (!result.success) {
        throw new ValidationError(result.error.issues.map(issue => `${issue.path.join(".") || "body"}: ${issue.message}`).join("; "));
    }
    return result.data;
}
