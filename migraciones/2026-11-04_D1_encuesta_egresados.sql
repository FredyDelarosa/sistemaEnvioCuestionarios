-- Migración D1: tabla encuesta_egresados
--
-- Guarda quién se quitó a mano de una encuesta (revocado_manual) y de qué grupo
-- vino cada participante (id_grupo). También impide repetir a la misma persona
-- en una misma encuesta.
--
-- Antes de aplicarla en una base con datos:
--   1. Hacer respaldo.
--   2. Revisar que no haya duplicados. Si esta consulta devuelve filas, hay que
--      limpiarlas primero, porque el índice único del paso 4 fallaría:
--      SELECT id_encuesta, id_egresado, COUNT(*) FROM encuesta_egresados
--      GROUP BY id_encuesta, id_egresado HAVING COUNT(*) > 1;

-- 1. Marca de "quitado a mano por el administrador"
ALTER TABLE encuesta_egresados
ADD COLUMN revocado_manual TINYINT(1) NOT NULL DEFAULT 0;

-- 2. Grupo de origen (puede estar vacío)
ALTER TABLE encuesta_egresados ADD COLUMN id_grupo INT NULL;

-- 3. Si se borra el grupo, la columna queda en NULL
ALTER TABLE encuesta_egresados
ADD CONSTRAINT fk_encuesta_egresados_grupo FOREIGN KEY (id_grupo) REFERENCES grupo_egresado (id_grupo) ON DELETE SET NULL;

-- 4. Una persona no puede estar dos veces en la misma encuesta
ALTER TABLE encuesta_egresados
ADD CONSTRAINT uq_encuesta_egresado UNIQUE (id_encuesta, id_egresado);

-- Para deshacerla:
-- ALTER TABLE encuesta_egresados DROP INDEX uq_encuesta_egresado;
-- ALTER TABLE encuesta_egresados DROP FOREIGN KEY fk_encuesta_egresados_grupo;
-- ALTER TABLE encuesta_egresados DROP COLUMN id_grupo;
-- ALTER TABLE encuesta_egresados DROP COLUMN revocado_manual;