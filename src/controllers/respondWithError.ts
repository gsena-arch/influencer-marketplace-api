import type { Response } from "express";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ConflictError } from "../errors/ConflictError.js";

export function respondWithError(res: Response, error: unknown, message: string) {
    if (error instanceof ValidationError) return res.status(400).json({ message: error.message });
    if (error instanceof NotFoundError) return res.status(404).json({ message: error.message });
    if (error instanceof ConflictError) return res.status(409).json({ message: error.message });
    console.error(message, error);
    return res.status(500).json({ message });
}
