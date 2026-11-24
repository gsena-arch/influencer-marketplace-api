import type { Request, Response } from "express";
import { AtividadeRealizada } from "../models/AtividadeRealizada.js";
import AtividadeRealizadaRepository from "../repositories/AtividadeRealizadaRepository.js";
import { respondWithError } from "./respondWithError.js";

async function getAll(_req: Request, res: Response) {
    try {
        const records = await AtividadeRealizadaRepository.findAll();
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar atividade_realizada.");
    }
}

async function getByKeyword(req: Request, res: Response) {
    const { keyword } = req.query;
    if (typeof keyword !== "string" || !keyword.trim()) {
        return res.status(400).json({ message: "Palavra-chave não informada." });
    }
    try {
        const records = await AtividadeRealizadaRepository.searchByKeyword(keyword);
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao pesquisar atividade_realizada.");
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const record = await AtividadeRealizadaRepository.findById(id);
        return res.status(200).json(record);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar atividade_realizada.");
    }
}

async function create(req: Request, res: Response) {
    try {
        const model = new AtividadeRealizada(req.body);
        const created = await AtividadeRealizadaRepository.create(model);
        return res.status(201).json(created);
    } catch (error) {
        return respondWithError(res, error, "Erro ao criar atividade_realizada.");
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const model = await AtividadeRealizadaRepository.findById(id);
        model.applyChanges(req.body);
        const updated = await AtividadeRealizadaRepository.update(model);
        return res.status(200).json(updated);
    } catch (error) {
        return respondWithError(res, error, "Erro ao atualizar atividade_realizada.");
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        await AtividadeRealizadaRepository.remove(id);
        return res.status(204).send();
    } catch (error) {
        return respondWithError(res, error, "Erro ao remover atividade_realizada.");
    }
}

export default { getAll, getByKeyword, getById, create, update, remove };
