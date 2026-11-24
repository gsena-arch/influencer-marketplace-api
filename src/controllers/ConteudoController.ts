import type { Request, Response } from "express";
import { Conteudo } from "../models/Conteudo.js";
import ConteudoRepository from "../repositories/ConteudoRepository.js";
import { respondWithError } from "./respondWithError.js";

async function getAll(_req: Request, res: Response) {
    try {
        const records = await ConteudoRepository.findAll();
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar conteudo.");
    }
}

async function getByKeyword(req: Request, res: Response) {
    const { keyword } = req.query;
    if (typeof keyword !== "string" || !keyword.trim()) {
        return res.status(400).json({ message: "Palavra-chave não informada." });
    }
    try {
        const records = await ConteudoRepository.searchByKeyword(keyword);
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao pesquisar conteudo.");
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const record = await ConteudoRepository.findById(id);
        return res.status(200).json(record);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar conteudo.");
    }
}

async function create(req: Request, res: Response) {
    try {
        const model = new Conteudo(req.body);
        const created = await ConteudoRepository.create(model);
        return res.status(201).json(created);
    } catch (error) {
        return respondWithError(res, error, "Erro ao criar conteudo.");
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const model = await ConteudoRepository.findById(id);
        model.applyChanges(req.body);
        const updated = await ConteudoRepository.update(model);
        return res.status(200).json(updated);
    } catch (error) {
        return respondWithError(res, error, "Erro ao atualizar conteudo.");
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        await ConteudoRepository.remove(id);
        return res.status(204).send();
    } catch (error) {
        return respondWithError(res, error, "Erro ao remover conteudo.");
    }
}

export default { getAll, getByKeyword, getById, create, update, remove };
