-- Migración D2: tabla sys_email_account
--
-- Guarda el nombre que se muestra como remitente en los correos
-- (por ejemplo "Egresados UP"). Lo usa la issue B13.
-- La columna puede quedar vacía: si una cuenta no tiene nombre,
-- el correo sale solo con la dirección, como hasta ahora.
--
-- Antes de aplicarla en una base con datos, hacer respaldo.

ALTER TABLE sys_email_account
ADD COLUMN display_name VARCHAR(150) NULL AFTER email;

-- Para deshacerla:
-- ALTER TABLE sys_email_account DROP COLUMN display_name;