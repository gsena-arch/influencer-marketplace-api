import type { Request, Response } from "express";
import { Modulo } from "../models/Modulo.js";
import ModuloRepository from "../repositories/ModuloRepository.js";
import { respondWithError } from "./respondWithError.js";

async function getAll(_req: Request, res: Response) {
    try {
        const records = await ModuloRepository.findAll();
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar modulo.");
    }
}

async function getByKeyword(req: Request, res: Response) {
    const { keyword } = req.query;
    if (typeof keyword !== "string" || !keyword.trim()) {
        return res.status(400).json({ message: "Palavra-chave não informada." });
    }
    try {
        const records = await ModuloRepository.searchByKeyword(keyword);
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao pesquisar modulo.");
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const record = await ModuloRepository.findById(id);
        return res.status(200).json(record);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar modulo.");
    }
}

async function create(req: Request, res: Response) {
    try {
        const model = new Modulo(req.body);
        const created = await ModuloRepository.create(model);
        return res.status(201).json(created);
    } catch (error) {
        return respondWithError(res, error, "Erro ao criar modulo.");
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const model = await ModuloRepository.findById(id);
        model.applyChanges(req.body);
        const updated = await ModuloRepository.update(model);
        return res.status(200).json(updated);
    } catch (error) {
        return respondWithError(res, error, "Erro ao atualizar modulo.");
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        await ModuloRepository.remove(id);
        return res.status(204).send();
    } catch (error) {
        return respondWithError(res, error, "Erro ao remover modulo.");
    }
}

export default { getAll, getByKeyword, getById, create, update, remove };
