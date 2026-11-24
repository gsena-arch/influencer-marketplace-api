# API de cursos

API REST para gerenciamento de uma plataforma de cursos. O sistema permite cadastrar e consultar usuários, criadores de conteúdo, especialidades, cursos, módulos, conteúdos, matrículas, atividades, atividades realizadas e checklists.

## Tecnologias

- Node.js 24;
- TypeScript;
- Express 5;
- PostgreSQL;
- Zod;
- Swagger;
- Vitest.

## Entidades e relacionamentos

### Usuário

- `id`: UUID gerado pelo banco;
- `nome`: nome do usuário, até 150 caracteres;
- `email`: e-mail do usuário, até 255 caracteres;
- `status`: estado do usuário, até 20 caracteres;
- `criado_em` e `atualizado_em`: datas de criação e atualização.

### Especialidade do criador

- `id`: UUID gerado pelo banco;
- `nome`: nome da especialidade, até 100 caracteres;
- `descricao`: descrição da especialidade.

### Criador de conteúdo

- `id`: UUID gerado pelo banco;
- `usuario_id`: usuário associado ao criador;
- `avaliacao_criador`: avaliação decimal do criador;
- `especialidade_id`: especialidade do criador.

### Curso

- `id`: UUID gerado pelo banco;
- `codigo_unico`: código do curso, até 50 caracteres;
- `titulo`: título do curso, até 150 caracteres;
- `descricao`: descrição do curso;
- `criador_id`: criador responsável pelo curso;
- `criado_em` e `atualizado_em`: datas de criação e atualização.

### Módulo

- `id`: UUID gerado pelo banco;
- `curso_id`: curso ao qual o módulo pertence;
- `titulo`: título do módulo, até 150 caracteres;
- `descricao`: descrição do módulo;
- `criado_em` e `atualizado_em`: datas de criação e atualização.

### Conteúdo

- `id`: UUID gerado pelo banco;
- `modulo_id`: módulo ao qual o conteúdo pertence;
- `titulo`: título do conteúdo, até 150 caracteres;
- `conteudo`: texto do conteúdo;
- `criado_em` e `atualizado_em`: datas de criação e atualização.

### Matrícula

- `id`: UUID gerado pelo banco;
- `usuario_id`: usuário matriculado;
- `curso_id`: curso da matrícula;
- `data_matricula`: data da matrícula;
- `status`: estado da matrícula, até 20 caracteres.

### Atividade

- `id`: UUID gerado pelo banco;
- `modulo_id`: módulo relacionado;
- `conteudo_id`: conteúdo relacionado;
- `titulo`: título da atividade, até 150 caracteres;
- `descricao`: descrição da atividade;
- `tipo`: tipo da atividade, até 30 caracteres;
- `criado_em` e `atualizado_em`: datas de criação e atualização.

### Atividade realizada

- `id`: UUID gerado pelo banco;
- `atividade_id`: atividade realizada;
- `matricula_id`: matrícula do aluno;
- `nota`: nota decimal;
- `status`: estado da realização, até 20 caracteres;
- `data_realizacao`: data da realização.

### Checklist

- `id`: UUID gerado pelo banco;
- `conteudo_id`: conteúdo acompanhado;
- `matricula_id`: matrícula do aluno;
- `status`: indica se o conteúdo foi concluído;
- `data_realizacao`: data da conclusão.

As relações entre as entidades são protegidas por chaves estrangeiras. Um registro que esteja sendo usado por outra entidade não pode ser excluído até que suas referências sejam removidas.

## Estrutura do projeto

```text
db/
└── migrations/             # Criação e atualização do banco de dados
src/
├── config/                 # PostgreSQL, migrations e Swagger
├── controllers/            # Tratamento das requisições e respostas
├── errors/                 # Erros da aplicação
├── models/                 # Entidades e validações
├── repositories/           # Consultas SQL
├── routes/                 # Rotas HTTP e documentação OpenAPI
├── scripts/                # Execução manual das migrations
├── tests/                  # Testes unitários, de rotas e de integração
├── app.ts                  # Configuração do Express
└── server.ts               # Inicialização da API
```

## Requisitos

- Node.js 24;
- npm;
- PostgreSQL acessível pela aplicação.

## Variáveis de ambiente

Copie `.env.example` para `.env`:

```powershell
Copy-Item .env.example .env
```

Configure as variáveis:

| Variável | Finalidade | Exemplo |
| --- | --- | --- |
| `DATABASE_URL` | URL de conexão com o PostgreSQL | `postgresql://postgres:senha@localhost:5432/api_db` |
| `PORT` | Porta HTTP da API | `3000` |

O arquivo `.env` não deve ser versionado.

## Execução

Instale as dependências:

```powershell
npm ci
```

Crie um banco PostgreSQL vazio chamado `api_db`, ajuste `DATABASE_URL` no `.env` e execute as migrations:

```powershell
npm run db:migrate
```

Inicie em modo de desenvolvimento:

```powershell
npm run dev
```

A API ficará disponível em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/api-docs`.

Para executar a versão compilada:

```powershell
npm run build
npm start
```

Ao iniciar pelo `npm run dev` ou `npm start`, a aplicação também executa automaticamente as migrations pendentes antes de abrir a porta HTTP.

## Migrations

As migrations ficam em `db/migrations` e são executadas em ordem pelo nome do arquivo.

- `000_initial.sql`: cria as tabelas, colunas e chaves estrangeiras;
- `001_regras_de_unicidade.sql`: cria as regras de unicidade de e-mail, código de curso e matrícula.

A tabela `schema_migrations` registra os arquivos já executados. Uma migration aplicada não é executada novamente.

Para aplicar as migrations manualmente:

```powershell
npm run db:migrate
```

Se o banco já possuir dados que contrariem uma regra de unicidade, a migration será cancelada. Os dados conflitantes precisam ser corrigidos antes de uma nova tentativa.

## Endpoints

Todas as rotas recebem e retornam JSON. Cada entidade utiliza o mesmo conjunto de operações.

| Método | Endpoint | Finalidade |
| --- | --- | --- |
| `GET` | `/<entidade>` | Lista os registros |
| `GET` | `/<entidade>/search?keyword=texto` | Pesquisa nos campos de texto |
| `GET` | `/<entidade>/:id` | Consulta um registro pelo UUID |
| `POST` | `/<entidade>` | Cria um registro |
| `PUT` | `/<entidade>/:id` | Atualiza somente os campos enviados |
| `DELETE` | `/<entidade>/:id` | Exclui um registro |

Entidades disponíveis:

| Entidade | Rota base | Campos aceitos no POST e PUT |
| --- | --- | --- |
| Curso | `/curso` | `codigo_unico`, `titulo`, `descricao`, `criador_id` |
| Módulo | `/modulo` | `curso_id`, `titulo`, `descricao` |
| Conteúdo | `/conteudo` | `modulo_id`, `titulo`, `conteudo` |
| Usuário | `/usuario` | `nome`, `email`, `status` |
| Especialidade | `/especialidade_criador` | `nome`, `descricao` |
| Criador de conteúdo | `/criador_conteudo` | `usuario_id`, `avaliacao_criador`, `especialidade_id` |
| Matrícula | `/matricula` | `usuario_id`, `curso_id`, `data_matricula`, `status` |
| Atividade | `/atividade` | `modulo_id`, `conteudo_id`, `titulo`, `descricao`, `tipo` |
| Atividade realizada | `/atividade_realizada` | `atividade_id`, `matricula_id`, `nota`, `status`, `data_realizacao` |
| Checklist | `/check_list` | `conteudo_id`, `matricula_id`, `status`, `data_realizacao` |

A pesquisa usa os campos de texto da entidade. Para `criador_conteudo` e `check_list`, que não possuem campos de texto, a rota de pesquisa retorna uma lista vazia.

## Exemplos de requisições

### Criar usuário

`POST /usuario`

```json
{
  "nome": "Maria Silva",
  "email": "maria@example.com",
  "status": "ativo"
}
```

### Criar curso

`POST /curso`

```json
{
  "codigo_unico": "CURSO-001",
  "titulo": "Introdução ao TypeScript",
  "descricao": "Conceitos básicos de TypeScript",
  "criador_id": null
}
```

### Atualizar somente um campo

`PUT /curso/<UUID_DO_CURSO>`

```json
{
  "titulo": "TypeScript atualizado"
}
```

Os campos omitidos permanecem inalterados. O corpo deve conter pelo menos um campo. Para limpar um campo opcional, envie `null`:

```json
{
  "descricao": null
}
```

### Criar matrícula

`POST /matricula`

```json
{
  "usuario_id": "<UUID_DO_USUARIO>",
  "curso_id": "<UUID_DO_CURSO>",
  "data_matricula": "2026-11-24T12:00:00.000Z",
  "status": "ativa"
}
```

### Excluir um registro

`DELETE /curso/<UUID_DO_CURSO>`

Uma exclusão bem-sucedida retorna `204` sem corpo. Se o curso estiver relacionado a outro registro, a API retorna `409`.

## Regras de negócio

- O e-mail precisa ter formato válido quando informado;
- o e-mail é salvo em letras minúsculas e sem espaços externos;
- dois usuários não podem usar o mesmo e-mail;
- dois cursos não podem usar o mesmo código, ignorando diferenças entre maiúsculas e minúsculas e espaços externos;
- um usuário não pode possuir duas matrículas no mesmo curso;
- UUIDs informados precisam ser válidos;
- chaves estrangeiras precisam apontar para registros existentes;
- campos desconhecidos são rejeitados;
- o PUT exige pelo menos um campo e preserva os campos omitidos;
- datas são normalizadas e retornadas em UTC;
- valores decimais são enviados como números e retornados como strings com duas casas decimais.

Campos opcionais podem receber `null`. Valores `false` e `0` são preservados.

## Respostas HTTP

| Código | Significado |
| --- | --- |
| `200` | Consulta ou atualização realizada |
| `201` | Registro criado |
| `204` | Registro excluído |
| `400` | Dados, UUID ou JSON inválidos |
| `404` | Registro não encontrado |
| `409` | Duplicidade, referência inexistente ou registro em uso |
| `500` | Erro interno da aplicação |

As respostas de erro usam o formato:

```json
{
  "message": "Descrição do erro."
}
```

## Scripts

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia a API em modo de desenvolvimento e reinicia após alterações |
| `npm run build` | Compila o TypeScript para a pasta `dist` |
| `npm start` | Inicia a versão compilada |
| `npm run db:migrate` | Aplica as migrations pendentes |
| `npm test` | Executa todos os testes |
| `npm run test:integration` | Executa apenas os testes com PostgreSQL |
| `npm run typecheck` | Verifica os tipos sem gerar arquivos |

## Testes

Execute todos os testes:

```powershell
npm test
```

Execute somente os testes de integração:

```powershell
npm run test:integration
```

Os testes de integração usam o PostgreSQL indicado em `DATABASE_URL`, criam registros temporários e removem somente os registros criados durante os testes.

Verifique os tipos TypeScript:

```powershell
npm run typecheck
```

## Documentação Swagger

Com a API em execução, acesse:

```text
http://localhost:3000/api-docs
```

A rota `/` redireciona para essa documentação.
