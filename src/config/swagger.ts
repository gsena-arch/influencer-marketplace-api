import { fileURLToPath } from "node:url";
import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Sistema de Cursos - API",
            version: "1.0.0",
            description: "API REST para gerenciamento de cursos, módulos, conteúdos, usuários, criadores, matrículas e atividades."
        },
        servers: [
            {
                url: "/",
                description: "Servidor atual"
            },
            {
                url: "http://localhost:3000",
                description: "Servidor de desenvolvimento"
            }
        ],
        tags: [
            {
                name: "Cursos",
                description: "Gerenciamento de cursos"
            },
            {
                name: "Módulos",
                description: "Gerenciamento dos módulos dos cursos"
            },
            {
                name: "Conteúdos",
                description: "Gerenciamento dos conteúdos dos módulos"
            },
            {
                name: "Usuários",
                description: "Gerenciamento de usuários"
            },
            {
                name: "Especialidades",
                description: "Gerenciamento das especialidades dos criadores"
            },
            {
                name: "Criadores de Conteúdo",
                description: "Gerenciamento de criadores de conteúdo"
            },
            {
                name: "Matrículas",
                description: "Gerenciamento de matrículas nos cursos"
            },
            {
                name: "Atividades",
                description: "Gerenciamento de atividades"
            },
            {
                name: "Atividades Realizadas",
                description: "Gerenciamento das atividades realizadas pelos alunos"
            },
            {
                name: "Checklists",
                description: "Acompanhamento da realização dos conteúdos"
            }
        ],
        components: {
            schemas: {
                Curso: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", readOnly: true, example: "11111111-1111-4111-8111-111111111111" },
                        codigo_unico: { type: "string", maxLength: 50, nullable: true, example: "CURSO-001" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." },
                        criado_em: { type: "string", format: "date-time", nullable: true, readOnly: true, example: "2026-11-21T12:00:00.000Z" },
                        atualizado_em: { type: "string", format: "date-time", nullable: true, readOnly: true, example: "2026-11-21T12:00:00.000Z" },
                        criador_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" }
                    }
                },
                CreateCurso: {
                    type: "object",
                    description: "Campos opcionais conforme o SQL. Campos omitidos usam os valores padrão do banco.",
                    additionalProperties: false,
                    properties: {
                        codigo_unico: { type: "string", maxLength: 50, nullable: true, example: "CURSO-001" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." },
                        criador_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" }
                    }
                },
                UpdateCurso: {
                    type: "object",
                    example: { titulo: "Novo título do curso" },
                    description: "Informe ao menos um campo. Campos omitidos permanecem inalterados.",
                    additionalProperties: false,
                    minProperties: 1,
                    properties: {
                        codigo_unico: { type: "string", maxLength: 50, nullable: true, example: "CURSO-001" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." },
                        criador_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" }
                    }
                },
                Modulo: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", readOnly: true, example: "11111111-1111-4111-8111-111111111111" },
                        curso_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." },
                        criado_em: { type: "string", format: "date-time", nullable: true, readOnly: true, example: "2026-11-21T12:00:00.000Z" },
                        atualizado_em: { type: "string", format: "date-time", nullable: true, readOnly: true, example: "2026-11-21T12:00:00.000Z" }
                    }
                },
                CreateModulo: {
                    type: "object",
                    description: "Campos opcionais conforme o SQL. Campos omitidos usam os valores padrão do banco.",
                    additionalProperties: false,
                    properties: {
                        curso_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." }
                    }
                },
                UpdateModulo: {
                    type: "object",
                    example: { titulo: "Novo título do módulo" },
                    description: "Informe ao menos um campo. Campos omitidos permanecem inalterados.",
                    additionalProperties: false,
                    minProperties: 1,
                    properties: {
                        curso_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." }
                    }
                },
                Conteudo: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", readOnly: true, example: "11111111-1111-4111-8111-111111111111" },
                        modulo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        conteudo: { type: "string", nullable: true, example: "Tipos, interfaces e classes em TypeScript." },
                        criado_em: { type: "string", format: "date-time", nullable: true, readOnly: true, example: "2026-11-21T12:00:00.000Z" },
                        atualizado_em: { type: "string", format: "date-time", nullable: true, readOnly: true, example: "2026-11-21T12:00:00.000Z" }
                    }
                },
                CreateConteudo: {
                    type: "object",
                    description: "Campos opcionais conforme o SQL. Campos omitidos usam os valores padrão do banco.",
                    additionalProperties: false,
                    properties: {
                        modulo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        conteudo: { type: "string", nullable: true, example: "Tipos, interfaces e classes em TypeScript." }
                    }
                },
                UpdateConteudo: {
                    type: "object",
                    example: { conteudo: "Conteúdo atualizado" },
                    description: "Informe ao menos um campo. Campos omitidos permanecem inalterados.",
                    additionalProperties: false,
                    minProperties: 1,
                    properties: {
                        modulo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        conteudo: { type: "string", nullable: true, example: "Tipos, interfaces e classes em TypeScript." }
                    }
                },
                Usuario: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", readOnly: true, example: "11111111-1111-4111-8111-111111111111" },
                        nome: { type: "string", maxLength: 150, nullable: true, example: "Maria Silva" },
                        email: { type: "string", format: "email", maxLength: 255, nullable: true, description: "E-mail único, salvo em minúsculas e sem espaços externos.", example: "maria@example.com" },
                        status: { type: "string", maxLength: 20, nullable: true, example: "ativo" },
                        criado_em: { type: "string", format: "date-time", nullable: true, readOnly: true, example: "2026-11-21T12:00:00.000Z" },
                        atualizado_em: { type: "string", format: "date-time", nullable: true, readOnly: true, example: "2026-11-21T12:00:00.000Z" }
                    }
                },
                CreateUsuario: {
                    type: "object",
                    description: "Campos opcionais conforme o SQL. Campos omitidos usam os valores padrão do banco.",
                    additionalProperties: false,
                    properties: {
                        nome: { type: "string", maxLength: 150, nullable: true, example: "Maria Silva" },
                        email: { type: "string", format: "email", maxLength: 255, nullable: true, description: "E-mail único, salvo em minúsculas e sem espaços externos.", example: "maria@example.com" },
                        status: { type: "string", maxLength: 20, nullable: true, example: "ativo" }
                    }
                },
                UpdateUsuario: {
                    type: "object",
                    example: { nome: "Maria Souza" },
                    description: "Informe ao menos um campo. Campos omitidos permanecem inalterados.",
                    additionalProperties: false,
                    minProperties: 1,
                    properties: {
                        nome: { type: "string", maxLength: 150, nullable: true, example: "Maria Silva" },
                        email: { type: "string", format: "email", maxLength: 255, nullable: true, description: "E-mail único, salvo em minúsculas e sem espaços externos.", example: "maria@example.com" },
                        status: { type: "string", maxLength: 20, nullable: true, example: "ativo" }
                    }
                },
                EspecialidadeCriador: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", readOnly: true, example: "11111111-1111-4111-8111-111111111111" },
                        nome: { type: "string", maxLength: 100, nullable: true, example: "Desenvolvimento Web" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." }
                    }
                },
                CreateEspecialidadeCriador: {
                    type: "object",
                    description: "Campos opcionais conforme o SQL. Campos omitidos usam os valores padrão do banco.",
                    additionalProperties: false,
                    properties: {
                        nome: { type: "string", maxLength: 100, nullable: true, example: "Desenvolvimento Web" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." }
                    }
                },
                UpdateEspecialidadeCriador: {
                    type: "object",
                    example: { nome: "Desenvolvimento de APIs" },
                    description: "Informe ao menos um campo. Campos omitidos permanecem inalterados.",
                    additionalProperties: false,
                    minProperties: 1,
                    properties: {
                        nome: { type: "string", maxLength: 100, nullable: true, example: "Desenvolvimento Web" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." }
                    }
                },
                CriadorConteudo: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", readOnly: true, example: "11111111-1111-4111-8111-111111111111" },
                        usuario_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        avaliacao_criador: { type: "string", nullable: true, example: "4.50", description: "Valor decimal retornado pelo banco como string." },
                        especialidade_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" }
                    }
                },
                CreateCriadorConteudo: {
                    type: "object",
                    description: "Campos opcionais conforme o SQL. Campos omitidos usam os valores padrão do banco.",
                    additionalProperties: false,
                    properties: {
                        usuario_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        avaliacao_criador: { type: "number", nullable: true, multipleOf: 0.01, minimum: -10, exclusiveMinimum: true, maximum: 10, exclusiveMaximum: true, example: 4.5 },
                        especialidade_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" }
                    }
                },
                UpdateCriadorConteudo: {
                    type: "object",
                    example: { avaliacao_criador: 4.5 },
                    description: "Informe ao menos um campo. Campos omitidos permanecem inalterados.",
                    additionalProperties: false,
                    minProperties: 1,
                    properties: {
                        usuario_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        avaliacao_criador: { type: "number", nullable: true, multipleOf: 0.01, minimum: -10, exclusiveMinimum: true, maximum: 10, exclusiveMaximum: true, example: 4.5 },
                        especialidade_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" }
                    }
                },
                Matricula: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", readOnly: true, example: "11111111-1111-4111-8111-111111111111" },
                        usuario_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        curso_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        data_matricula: { type: "string", format: "date-time", nullable: true, example: "2026-11-21T12:00:00.000Z" },
                        status: { type: "string", maxLength: 20, nullable: true, example: "ativo" }
                    }
                },
                CreateMatricula: {
                    type: "object",
                    description: "Campos opcionais conforme o SQL. Campos omitidos usam os valores padrão do banco.",
                    additionalProperties: false,
                    properties: {
                        usuario_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        curso_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        data_matricula: { type: "string", format: "date-time", nullable: true, example: "2026-11-21T12:00:00.000Z" },
                        status: { type: "string", maxLength: 20, nullable: true, example: "ativo" }
                    }
                },
                UpdateMatricula: {
                    type: "object",
                    example: { status: "concluido" },
                    description: "Informe ao menos um campo. Campos omitidos permanecem inalterados.",
                    additionalProperties: false,
                    minProperties: 1,
                    properties: {
                        usuario_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        curso_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        data_matricula: { type: "string", format: "date-time", nullable: true, example: "2026-11-21T12:00:00.000Z" },
                        status: { type: "string", maxLength: 20, nullable: true, example: "ativo" }
                    }
                },
                Atividade: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", readOnly: true, example: "11111111-1111-4111-8111-111111111111" },
                        modulo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        conteudo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." },
                        tipo: { type: "string", maxLength: 30, nullable: true, example: "questionario" },
                        criado_em: { type: "string", format: "date-time", nullable: true, readOnly: true, example: "2026-11-21T12:00:00.000Z" },
                        atualizado_em: { type: "string", format: "date-time", nullable: true, readOnly: true, example: "2026-11-21T12:00:00.000Z" }
                    }
                },
                CreateAtividade: {
                    type: "object",
                    description: "Campos opcionais conforme o SQL. Campos omitidos usam os valores padrão do banco.",
                    additionalProperties: false,
                    properties: {
                        modulo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        conteudo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." },
                        tipo: { type: "string", maxLength: 30, nullable: true, example: "questionario" }
                    }
                },
                UpdateAtividade: {
                    type: "object",
                    example: { titulo: "Novo título da atividade" },
                    description: "Informe ao menos um campo. Campos omitidos permanecem inalterados.",
                    additionalProperties: false,
                    minProperties: 1,
                    properties: {
                        modulo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        conteudo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        titulo: { type: "string", maxLength: 150, nullable: true, example: "Introdução ao TypeScript" },
                        descricao: { type: "string", nullable: true, example: "Conceitos e exemplos práticos para aprender TypeScript." },
                        tipo: { type: "string", maxLength: 30, nullable: true, example: "questionario" }
                    }
                },
                AtividadeRealizada: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", readOnly: true, example: "11111111-1111-4111-8111-111111111111" },
                        atividade_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        matricula_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        nota: { type: "string", nullable: true, example: "4.50", description: "Valor decimal retornado pelo banco como string." },
                        status: { type: "string", maxLength: 20, nullable: true, example: "ativo" },
                        data_realizacao: { type: "string", format: "date-time", nullable: true, example: "2026-11-21T12:00:00.000Z" }
                    }
                },
                CreateAtividadeRealizada: {
                    type: "object",
                    description: "Campos opcionais conforme o SQL. Campos omitidos usam os valores padrão do banco.",
                    additionalProperties: false,
                    properties: {
                        atividade_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        matricula_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        nota: { type: "number", nullable: true, multipleOf: 0.01, minimum: -1000, exclusiveMinimum: true, maximum: 1000, exclusiveMaximum: true, example: 4.5 },
                        status: { type: "string", maxLength: 20, nullable: true, example: "ativo" },
                        data_realizacao: { type: "string", format: "date-time", nullable: true, example: "2026-11-21T12:00:00.000Z" }
                    }
                },
                UpdateAtividadeRealizada: {
                    type: "object",
                    example: { nota: 8.5 },
                    description: "Informe ao menos um campo. Campos omitidos permanecem inalterados.",
                    additionalProperties: false,
                    minProperties: 1,
                    properties: {
                        atividade_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        matricula_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        nota: { type: "number", nullable: true, multipleOf: 0.01, minimum: -1000, exclusiveMinimum: true, maximum: 1000, exclusiveMaximum: true, example: 4.5 },
                        status: { type: "string", maxLength: 20, nullable: true, example: "ativo" },
                        data_realizacao: { type: "string", format: "date-time", nullable: true, example: "2026-11-21T12:00:00.000Z" }
                    }
                },
                CheckList: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid", readOnly: true, example: "11111111-1111-4111-8111-111111111111" },
                        conteudo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        matricula_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        status: { type: "boolean", nullable: true, example: false },
                        data_realizacao: { type: "string", format: "date-time", nullable: true, example: "2026-11-21T12:00:00.000Z" }
                    }
                },
                CreateCheckList: {
                    type: "object",
                    description: "Campos opcionais conforme o SQL. Campos omitidos usam os valores padrão do banco.",
                    additionalProperties: false,
                    properties: {
                        conteudo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        matricula_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        status: { type: "boolean", nullable: true, example: false },
                        data_realizacao: { type: "string", format: "date-time", nullable: true, example: "2026-11-21T12:00:00.000Z" }
                    }
                },
                UpdateCheckList: {
                    type: "object",
                    example: { status: true },
                    description: "Informe ao menos um campo. Campos omitidos permanecem inalterados.",
                    additionalProperties: false,
                    minProperties: 1,
                    properties: {
                        conteudo_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        matricula_id: { type: "string", format: "uuid", nullable: true, example: "11111111-1111-4111-8111-111111111111" },
                        status: { type: "boolean", nullable: true, example: false },
                        data_realizacao: { type: "string", format: "date-time", nullable: true, example: "2026-11-21T12:00:00.000Z" }
                    }
                },
                Error: {
                    type: "object",
                    required: [
                        "message"
                    ],
                    properties: {
                        message: { type: "string", example: "Erro ao processar solicitação." }
                    }
                }
            }
        }
    },
    apis: [fileURLToPath(new URL("../routes/*.{ts,js}", import.meta.url)).replaceAll("\\", "/")],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
