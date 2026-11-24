import type { Request, Response } from "express";
import { CheckList } from "../models/CheckList.js";
import CheckListRepository from "../repositories/CheckListRepository.js";
import { respondWithError } from "./respondWithError.js";

async function getAll(_req: Request, res: Response) {
    try {
        const records = await CheckListRepository.findAll();
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar check_list.");
    }
}

async function getByKeyword(req: Request, res: Response) {
    const { keyword } = req.query;
    if (typeof keyword !== "string" || !keyword.trim()) {
        return res.status(400).json({ message: "Palavra-chave não informada." });
    }
    try {
        const records = await CheckListRepository.searchByKeyword(keyword);
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao pesquisar check_list.");
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const record = await CheckListRepository.findById(id);
        return res.status(200).json(record);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar check_list.");
    }
}

async function create(req: Request, res: Response) {
    try {
        const model = new CheckList(req.body);
        const created = await CheckListRepository.create(model);
        return res.status(201).json(created);
    } catch (error) {
        return respondWithError(res, error, "Erro ao criar check_list.");
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const model = await CheckListRepository.findById(id);
        model.applyChanges(req.body);
        const updated = await CheckListRepository.update(model);
        return res.status(200).json(updated);
    } catch (error) {
        return respondWithError(res, error, "Erro ao atualizar check_list.");
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        await CheckListRepository.remove(id);
        return res.status(204).send();
    } catch (error) {
        return respondWithError(res, error, "Erro ao remover check_list.");
    }
}

export default { getAll, getByKeyword, getById, create, update, remove };
