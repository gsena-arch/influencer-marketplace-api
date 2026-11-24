import type { Request, Response } from "express";
import { CriadorConteudo } from "../models/CriadorConteudo.js";
import CriadorConteudoRepository from "../repositories/CriadorConteudoRepository.js";
import { respondWithError } from "./respondWithError.js";

async function getAll(_req: Request, res: Response) {
    try {
        const records = await CriadorConteudoRepository.findAll();
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar criador_conteudo.");
    }
}

async function getByKeyword(req: Request, res: Response) {
    const { keyword } = req.query;
    if (typeof keyword !== "string" || !keyword.trim()) {
        return res.status(400).json({ message: "Palavra-chave não informada." });
    }
    try {
        const records = await CriadorConteudoRepository.searchByKeyword(keyword);
        return res.status(200).json(records);
    } catch (error) {
        return respondWithError(res, error, "Erro ao pesquisar criador_conteudo.");
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const record = await CriadorConteudoRepository.findById(id);
        return res.status(200).json(record);
    } catch (error) {
        return respondWithError(res, error, "Erro ao buscar criador_conteudo.");
    }
}

async function create(req: Request, res: Response) {
    try {
        const model = new CriadorConteudo(req.body);
        const created = await CriadorConteudoRepository.create(model);
        return res.status(201).json(created);
    } catch (error) {
        return respondWithError(res, error, "Erro ao criar criador_conteudo.");
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        const model = await CriadorConteudoRepository.findById(id);
        model.applyChanges(req.body);
        const updated = await CriadorConteudoRepository.update(model);
        return res.status(200).json(updated);
    } catch (error) {
        return respondWithError(res, error, "Erro ao atualizar criador_conteudo.");
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
        await CriadorConteudoRepository.remove(id);
        return res.status(204).send();
    } catch (error) {
        return respondWithError(res, error, "Erro ao remover criador_conteudo.");
    }
}

export default { getAll, getByKeyword, getById, create, update, remove };
