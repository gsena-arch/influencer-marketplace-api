import type { Request, Response } from "express";
import { EspecialidadeCriador } from "../models/EspecialidadeCriador.js";
import EspecialidadeCriadorRepository from "../repositories/EspecialidadeCriadorRepository.js";
import { respondWithError } from "./respondWithError.js";

async function getAll(_req: Request, res: Response) {
    try {
        const records = await EspecialidadeCriadorRepository.findAll();
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar especialidade_criador.");
    }
}

async function getByKeyword(req: Request, res: Response) {
    const { keyword } = req.query;
    if (typeof keyword !== "string" || !keyword.trim()) {
        return res.status(400).json({ message: "Palavra-chave não informada." });
    }
    try {
        const records = await EspecialidadeCriadorRepository.searchByKeyword(keyword);
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao pesquisar especialidade_criador.");
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const record = await EspecialidadeCriadorRepository.findById(id);
        return res.status(200).json(record);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar especialidade_criador.");
    }
}

async function create(req: Request, res: Response) {
    try {
        const model = new EspecialidadeCriador(req.body);
        const created = await EspecialidadeCriadorRepository.create(model);
        return res.status(201).json(created);
    } catch (error) {
        return respondWithError(res, error, "Erro ao criar especialidade_criador.");
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const model = await EspecialidadeCriadorRepository.findById(id);
        model.applyChanges(req.body);
        const updated = await EspecialidadeCriadorRepository.update(model);
        return res.status(200).json(updated);
    } catch (error) {
        return respondWithError(res, error, "Erro ao atualizar especialidade_criador.");
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        await EspecialidadeCriadorRepository.remove(id);
        return res.status(204).send();
    } catch (error) {
        return respondWithError(res, error, "Erro ao remover especialidade_criador.");
    }
}

export default { getAll, getByKeyword, getById, create, update, remove };
