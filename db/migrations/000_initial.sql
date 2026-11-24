CREATE TABLE curso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_unico VARCHAR(50),
    titulo VARCHAR(150),
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE modulo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID,
    titulo VARCHAR(150),
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (curso_id) REFERENCES curso(id)
);

CREATE TABLE conteudo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modulo_id UUID,
    titulo VARCHAR(150),
    conteudo TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (modulo_id) REFERENCES modulo(id)
);

CREATE TABLE usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150),
    email VARCHAR(255),
    status VARCHAR(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE especialidade_criador (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100),
    descricao TEXT
);

CREATE TABLE criador_conteudo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID,
    avaliacao_criador DECIMAL(3,2),
    especialidade_id UUID,

    FOREIGN KEY (usuario_id) REFERENCES usuario(id),

    FOREIGN KEY (especialidade_id) REFERENCES especialidade_criador(id)
);

CREATE TABLE matricula (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID,
    curso_id UUID,
    data_matricula TIMESTAMP,
    status VARCHAR(20),

    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (curso_id) REFERENCES curso(id)
);

CREATE TABLE atividade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modulo_id UUID,
    conteudo_id UUID,
    titulo VARCHAR(150),
    descricao TEXT,
    tipo VARCHAR(30),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (modulo_id) REFERENCES modulo(id),
    FOREIGN KEY (conteudo_id) REFERENCES conteudo(id)
);

CREATE TABLE atividade_realizada (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atividade_id UUID,
    matricula_id UUID,
    nota DECIMAL(5,2),
    status VARCHAR(20),
    data_realizacao TIMESTAMP,

    FOREIGN KEY (atividade_id) REFERENCES atividade(id),
    FOREIGN KEY (matricula_id) REFERENCES matricula(id)
);

CREATE TABLE check_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conteudo_id UUID,
    matricula_id UUID,
    status BOOLEAN DEFAULT FALSE,
    data_realizacao TIMESTAMP,

    FOREIGN KEY (conteudo_id) REFERENCES conteudo(id),
    FOREIGN KEY (matricula_id) REFERENCES matricula(id)
);

ALTER TABLE curso
ADD COLUMN criador_id UUID;

ALTER TABLE curso
ADD CONSTRAINT fk_curso_criador
FOREIGN KEY (criador_id)
REFERENCES criador_conteudo(id);
