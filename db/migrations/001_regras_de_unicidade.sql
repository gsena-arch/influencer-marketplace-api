-- Null values remain allowed for compatibility with the existing schema.
-- Index creation fails if existing data violates a rule; no rows are removed.
CREATE UNIQUE INDEX IF NOT EXISTS usuario_email_unico
    ON usuario (lower(btrim(email)))
    WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS curso_codigo_unico
    ON curso (lower(btrim(codigo_unico)))
    WHERE codigo_unico IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS matricula_usuario_curso_unico
    ON matricula (usuario_id, curso_id)
    WHERE usuario_id IS NOT NULL AND curso_id IS NOT NULL;
