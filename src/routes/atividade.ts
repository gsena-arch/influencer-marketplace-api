import { Router } from "express";
import controller from "../controllers/AtividadeController.js";

/**
 * @openapi
 * /atividade:
 *   get:
 *     tags:
 *       - Atividades
 *     summary: Listar atividade
 *     description: Retorna todos os registros de atividade.
 *     responses:
 *       '200':
 *         description: Lista retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Atividade'
 *       '400':
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Atividades
 *     summary: Criar atividade
 *     description: Cria um registro de atividade. Campos omitidos usam os valores padrão do banco.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAtividade'
 *     responses:
 *       '201':
 *         description: Registro criado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Atividade'
 *       '400':
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '409':
 *         description: Referência inválida ou conflito de dados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /atividade/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *   get:
 *     tags:
 *       - Atividades
 *     summary: Buscar atividade
 *     description: Retorna um registro pelo ID.
 *     responses:
 *       '200':
 *         description: Registro encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Atividade'
 *       '400':
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Registro não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags:
 *       - Atividades
 *     summary: Atualizar atividade
 *     description: Atualiza os campos enviados, preservando os campos omitidos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAtividade'
 *     responses:
 *       '200':
 *         description: Registro atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Atividade'
 *       '400':
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Registro não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '409':
 *         description: Referência inválida ou conflito de dados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags:
 *       - Atividades
 *     summary: Excluir atividade
 *     description: Exclui um registro pelo ID.
 *     responses:
 *       '204':
 *         description: Registro exclu?do, sem conteúdo.
 *       '400':
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Registro não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '409':
 *         description: Registro referenciado por outra entidade.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @openapi
 * /atividade/search:
 *   get:
 *     tags:
 *       - Atividades
 *     summary: Pesquisar atividade por palavra-chave
 *     description: Pesquisa nos campos de texto. Entidades sem campos de texto retornam uma lista vazia.
 *     parameters:
 *       - name: keyword
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *     responses:
 *       '200':
 *         description: Resultados da pesquisa.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Atividade'
 *       '400':
 *         description: Palavra-chave inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erro interno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const router = Router();
router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/search", controller.getByKeyword);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
export default router;
