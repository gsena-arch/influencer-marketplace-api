export interface Field { name: string; type: string; maxLength?: number; precision?: number; scale?: number; format?: "email"; }
export interface Entity { table: string; fields: Field[]; }
export const entities: Entity[] = [
  {
    "table": "curso",
    "fields": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "codigo_unico",
        "type": "string",
        "maxLength": 50
      },
      {
        "name": "titulo",
        "type": "string",
        "maxLength": 150
      },
      {
        "name": "descricao",
        "type": "text"
      },
      {
        "name": "criado_em",
        "type": "timestamp"
      },
      {
        "name": "atualizado_em",
        "type": "timestamp"
      },
      {
        "name": "criador_id",
        "type": "uuid"
      }
    ]
  },
  {
    "table": "modulo",
    "fields": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "curso_id",
        "type": "uuid"
      },
      {
        "name": "titulo",
        "type": "string",
        "maxLength": 150
      },
      {
        "name": "descricao",
        "type": "text"
      },
      {
        "name": "criado_em",
        "type": "timestamp"
      },
      {
        "name": "atualizado_em",
        "type": "timestamp"
      }
    ]
  },
  {
    "table": "conteudo",
    "fields": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "modulo_id",
        "type": "uuid"
      },
      {
        "name": "titulo",
        "type": "string",
        "maxLength": 150
      },
      {
        "name": "conteudo",
        "type": "text"
      },
      {
        "name": "criado_em",
        "type": "timestamp"
      },
      {
        "name": "atualizado_em",
        "type": "timestamp"
      }
    ]
  },
  {
    "table": "usuario",
    "fields": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "nome",
        "type": "string",
        "maxLength": 150
      },
      {
        "name": "email",
        "type": "string",
        "format": "email",
        "maxLength": 255
      },
      {
        "name": "status",
        "type": "string",
        "maxLength": 20
      },
      {
        "name": "criado_em",
        "type": "timestamp"
      },
      {
        "name": "atualizado_em",
        "type": "timestamp"
      }
    ]
  },
  {
    "table": "especialidade_criador",
    "fields": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "nome",
        "type": "string",
        "maxLength": 100
      },
      {
        "name": "descricao",
        "type": "text"
      }
    ]
  },
  {
    "table": "criador_conteudo",
    "fields": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "usuario_id",
        "type": "uuid"
      },
      {
        "name": "avaliacao_criador",
        "type": "decimal",
        "precision": 3,
        "scale": 2
      },
      {
        "name": "especialidade_id",
        "type": "uuid"
      }
    ]
  },
  {
    "table": "matricula",
    "fields": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "usuario_id",
        "type": "uuid"
      },
      {
        "name": "curso_id",
        "type": "uuid"
      },
      {
        "name": "data_matricula",
        "type": "timestamp"
      },
      {
        "name": "status",
        "type": "string",
        "maxLength": 20
      }
    ]
  },
  {
    "table": "atividade",
    "fields": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "modulo_id",
        "type": "uuid"
      },
      {
        "name": "conteudo_id",
        "type": "uuid"
      },
      {
        "name": "titulo",
        "type": "string",
        "maxLength": 150
      },
      {
        "name": "descricao",
        "type": "text"
      },
      {
        "name": "tipo",
        "type": "string",
        "maxLength": 30
      },
      {
        "name": "criado_em",
        "type": "timestamp"
      },
      {
        "name": "atualizado_em",
        "type": "timestamp"
      }
    ]
  },
  {
    "table": "atividade_realizada",
    "fields": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "atividade_id",
        "type": "uuid"
      },
      {
        "name": "matricula_id",
        "type": "uuid"
      },
      {
        "name": "nota",
        "type": "decimal",
        "precision": 5,
        "scale": 2
      },
      {
        "name": "status",
        "type": "string",
        "maxLength": 20
      },
      {
        "name": "data_realizacao",
        "type": "timestamp"
      }
    ]
  },
  {
    "table": "check_list",
    "fields": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "conteudo_id",
        "type": "uuid"
      },
      {
        "name": "matricula_id",
        "type": "uuid"
      },
      {
        "name": "status",
        "type": "boolean"
      },
      {
        "name": "data_realizacao",
        "type": "timestamp"
      }
    ]
  }
];
