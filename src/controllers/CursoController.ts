import type { Request, Response } from "express";
import { Curso } from "../models/Curso.js";
import CursoRepository from "../repositories/CursoRepository.js";
import { respondWithError } from "./respondWithError.js";

async function getAll(_req: Request, res: Response) {
    try {
        const records = await CursoRepository.findAll();
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar curso.");
    }
}

async function getByKeyword(req: Request, res: Response) {
    const { keyword } = req.query;
    if (typeof keyword !== "string" || !keyword.trim()) {
        return res.status(400).json({ message: "Palavra-chave não informada." });
    }
    try {
        const records = await CursoRepository.searchByKeyword(keyword);
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao pesquisar curso.");
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const record = await CursoRepository.findById(id);
        return res.status(200).json(record);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar curso.");
    }
}

async function create(req: Request, res: Response) {
    try {
        const model = new Curso(req.body);
        const created = await CursoRepository.create(model);
        return res.status(201).json(created);
    } catch (error) {
        return respondWithError(res, error, "Erro ao criar curso.");
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const model = await CursoRepository.findById(id);
        model.applyChanges(req.body);
        const updated = await CursoRepository.update(model);
        return res.status(200).json(updated);
    } catch (error) {
        return respondWithError(res, error, "Erro ao atualizar curso.");
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        await CursoRepository.remove(id);
        return res.status(204).send();
    } catch (error) {
        return respondWithError(res, error, "Erro ao remover curso.");
    }
}

export default { getAll, getByKeyword, getById, create, update, remove };
