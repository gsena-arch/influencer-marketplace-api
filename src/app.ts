import express from "express";
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import routes from "./routes/index.js";

const app = express();
app.use(express.json());
app.get("/", (_req, res) => { res.redirect("/api-docs"); });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routes);
app.use((_req, res) => { res.status(404).json({ message: "Rota não encontrada." }); });
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof ZodError) {
        res.status(400).json({ message: "Dados inválidos.", details: error.issues });
        return;
    }
    if (error?.type === "entity.parse.failed") {
        res.status(400).json({ message: "JSON inválido." });
        return;
    }
    if (["23503", "23505"].includes(error?.code)) {
        res.status(409).json({ message: "Conflito de dados ou referência a outro registro." });
        return;
    }
    console.error(error);
    res.status(500).json({ message: "Erro interno no servidor." });
};
app.use(errorHandler);
export default app;
