import { Router } from "express";
import controller from "../controllers/EspecialidadeCriadorController.js";

/**
 * @openapi
 * /especialidade_criador:
 *   get:
 *     tags:
 *       - Especialidades
 *     summary: Listar especialidade_criador
 *     description: Retorna todos os registros de especialidade_criador.
 *     responses:
 *       '200':
 *         description: Lista retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EspecialidadeCriador'
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
 *       - Especialidades
 *     summary: Criar especialidade_criador
 *     description: Cria um registro de especialidade_criador. Campos omitidos usam os valores padrão do banco.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEspecialidadeCriador'
 *     responses:
 *       '201':
 *         description: Registro criado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EspecialidadeCriador'
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
 * /especialidade_criador/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *   get:
 *     tags:
 *       - Especialidades
 *     summary: Buscar especialidade_criador
 *     description: Retorna um registro pelo ID.
 *     responses:
 *       '200':
 *         description: Registro encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EspecialidadeCriador'
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
 *       - Especialidades
 *     summary: Atualizar especialidade_criador
 *     description: Atualiza os campos enviados, preservando os campos omitidos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEspecialidadeCriador'
 *     responses:
 *       '200':
 *         description: Registro atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EspecialidadeCriador'
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
 *       - Especialidades
 *     summary: Excluir especialidade_criador
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
 * /especialidade_criador/search:
 *   get:
 *     tags:
 *       - Especialidades
 *     summary: Pesquisar especialidade_criador por palavra-chave
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
 *                 $ref: '#/components/schemas/EspecialidadeCriador'
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
