import { describe, expect, it } from "vitest";
import { Curso } from "../models/Curso.js";
import { CriadorConteudo } from "../models/CriadorConteudo.js";
import { CheckList } from "../models/CheckList.js";
import { Matricula } from "../models/Matricula.js";
import { ValidationError } from "../errors/ValidationError.js";
import { restoreTimestamp } from "../models/validation.js";

const id = "11111111-1111-4111-8111-111111111111";

describe("Models", () => {
    it("normaliza datas com offset e sem fuso para UTC", () => {
        const utc = "2026-01-01T12:00:00.000Z";
        expect(new CheckList({ data_realizacao: "2026-01-01T09:00:00-03:00" }).getDataRealizacao()).toBe(utc);
        expect(new CheckList({ data_realizacao: "2026-01-01T12:00:00" }).getDataRealizacao()).toBe(utc);
        expect(restoreTimestamp("2026-01-01 12:00:00")).toBe(utc);
        expect(restoreTimestamp(utc)).toBe(utc);
    });

    it("valida alteracoes antes de modificar o model", () => {
        const curso = new Curso({ titulo: "Curso" });
        expect(() => curso.rename("x".repeat(151))).toThrow(ValidationError);
        expect(curso.getTitulo()).toBe("Curso");
        expect(() => curso.changeCriadorId("invalido")).toThrow(ValidationError);
    });

    it("restaura identidade e datas sem marcar campos como alterados", () => {
        const curso = Curso.restore({
            id, codigo_unico: null, titulo: "Curso", descricao: null,
            criado_em: new Date("2026-01-01T00:00:00Z"), atualizado_em: null, criador_id: null
        });
        expect(curso.getId()).toBe(id);
        expect(curso.getCriadoEm()).toBe("2026-01-01T00:00:00.000Z");
        expect(curso.toPersistence()).toEqual({});
        curso.applyChanges({ descricao: null });
        expect(curso.toPersistence()).toEqual({ descricao: null });
        expect(curso.getTitulo()).toBe("Curso");
    });

    it("converte NUMERIC do PostgreSQL e preserva o formato JSON", () => {
        const criador = CriadorConteudo.restore({ id, usuario_id: null, especialidade_id: null, avaliacao_criador: "4.50" });
        expect(criador.getAvaliacaoCriador()).toBe(4.5);
        expect(criador.toJSON().avaliacao_criador).toBe("4.50");
        expect(() => criador.changeAvaliacaoCriador(10)).toThrow(ValidationError);
        expect(() => criador.changeAvaliacaoCriador(1.234)).toThrow(ValidationError);
    });

    it("preserva false, zero, null e os valores padrao do banco", () => {
        expect(new CheckList().toPersistence()).toEqual({});
        expect(new CheckList({ status: false }).toPersistence()).toEqual({ status: false });
        expect(new CriadorConteudo({ avaliacao_criador: 0 }).toPersistence()).toEqual({ avaliacao_criador: 0 });
        expect(new Curso({ descricao: null }).toPersistence()).toEqual({ descricao: null });
    });

    it("rejeita campos protegidos, desconhecidos e datas invalidas", () => {
        const curso = new Curso();
        expect(() => curso.applyChanges({ id })).toThrow(ValidationError);
        expect(() => curso.applyChanges({ criado_em: "2026-01-01T00:00:00Z" })).toThrow(ValidationError);
        expect(() => curso.applyChanges({ desconhecido: "valor" })).toThrow(ValidationError);
        expect(() => new Matricula({ data_matricula: "data invalida" })).toThrow(ValidationError);
    });
});
