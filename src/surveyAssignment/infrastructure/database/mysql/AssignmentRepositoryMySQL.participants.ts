import { MysqlConnection } from '../../../../core/db/mysl/connection';

export async function listParticipantsQuery(
  idEncuesta: number,
  options: {
    page: number;
    limit: number;
    filtro_acceso?: 'activos' | 'revocados' | 'todos';
    estado_respuesta?: 'pendiente' | 'contestada';
    busqueda?: string;
  }
) {
  const offset = (options.page - 1) * options.limit;
  let where = 'ee.id_encuesta = ?';
  const params: any[] = [idEncuesta];

  // "Contestada": existe una respuesta del egresado al formulario de la encuesta.
  const existeRespuesta =
    'EXISTS (SELECT 1 FROM respuesta r WHERE r.id_egresado = ee.id_egresado AND r.id_formulario = en.id_formulario)';

  if ((options.filtro_acceso ?? 'activos') === 'activos') {
    where += ' AND ee.is_active = 1';
  } else if (options.filtro_acceso === 'revocados') {
    where += ' AND ee.is_active = 0';
  }
  if (options.estado_respuesta === 'pendiente') {
    where += ` AND NOT ${existeRespuesta}`;
  } else if (options.estado_respuesta === 'contestada') {
    where += ` AND ${existeRespuesta}`;
  }
  if (options.busqueda) {
    where += ' AND (e.nombre LIKE ? OR e.primer_apellido LIKE ? OR e.matricula LIKE ? OR e.email LIKE ? OR pe.nombre LIKE ?)';
    params.push(
      `%${options.busqueda}%`,
      `%${options.busqueda}%`,
      `%${options.busqueda}%`,
      `%${options.busqueda}%`,
      `%${options.busqueda}%`
    );
  }

  // Sin unir con grupo_miembro: una sola fila por participante.
  const from = `FROM encuesta_egresados ee
  INNER JOIN egresado e ON ee.id_egresado = e.id_egresado
  LEFT JOIN programa_educativo pe ON e.id_programa_educativo = pe.id_programa_educativo
  LEFT JOIN encuesta en ON en.id_encuesta = ee.id_encuesta`;

  const sql = `SELECT
    ee.id_encuesta_egresados as uuid,
    ee.id_egresado,
    ee.is_active,
    e.nombre, e.primer_apellido, e.segundo_apellido, e.matricula, e.email,
    pe.nombre as programa_educativo,
    IF(${existeRespuesta}, 'contestada', 'pendiente') as estado_respuesta,
    (SELECT MAX(r2.fecha_respuesta) FROM respuesta r2
      WHERE r2.id_egresado = ee.id_egresado AND r2.id_formulario = en.id_formulario) as fecha_respuesta
  ${from}
  WHERE ${where}
  ORDER BY e.nombre ASC, ee.id_encuesta_egresados ASC
  LIMIT ? OFFSET ?`;

  const [rows]: [any[], any] = await MysqlConnection.query(sql, [...params, options.limit, offset]);

  // Total con las mismas condiciones y sin uniones que repitan filas.
  const [countRows]: [any[], any] = await MysqlConnection.query(
    `SELECT COUNT(*) as total ${from} WHERE ${where}`,
    params
  );

  // Grupos de cada persona, en una consulta aparte.
  const gruposPorEgresado = new Map<number, { id_grupo: number; nombre: string }[]>();
  const idsEgresado: number[] = Array.from(new Set(rows.map(row => row.id_egresado)));

  if (idsEgresado.length > 0) {
    const marcadores = idsEgresado.map(() => '?').join(', ');
    const [grupoRows]: [any[], any] = await MysqlConnection.query(
      `SELECT gm.id_egresado, ge.id_grupo, ge.nombre
       FROM grupo_miembro gm
       INNER JOIN grupo_egresado ge ON ge.id_grupo = gm.id_grupo
       WHERE gm.id_egresado IN (${marcadores})
       ORDER BY ge.nombre ASC, ge.id_grupo ASC`,
      idsEgresado
    );
    for (const g of grupoRows) {
      const lista = gruposPorEgresado.get(g.id_egresado) ?? [];
      lista.push({ id_grupo: g.id_grupo, nombre: g.nombre });
      gruposPorEgresado.set(g.id_egresado, lista);
    }
  }

  return {
    meta: {
      total_records: countRows[0]?.total ?? 0,
      page: options.page,
      limit: options.limit,
    },
    data: rows.map(row => {
      const grupos = gruposPorEgresado.get(row.id_egresado) ?? [];
      return {
        type: 'participante',
        id: row.uuid,
        attributes: {
          is_active: !!row.is_active,
          estado_respuesta: row.estado_respuesta,
          fecha_respuesta: row.fecha_respuesta,
          // Se conserva "grupo" (el primero) para que la pantalla actual siga funcionando.
          grupo: grupos[0] ?? null,
          grupos,
          egresado: {
            nombre: row.nombre,
            primer_apellido: row.primer_apellido,
            segundo_apellido: row.segundo_apellido,
            matricula: row.matricula,
            email: row.email,
            programa_educativo: row.programa_educativo ?? null,
          }
        }
      };
    })
  };
}