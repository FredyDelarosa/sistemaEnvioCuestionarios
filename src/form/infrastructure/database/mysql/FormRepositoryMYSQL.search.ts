import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { Formulario } from '../../../domain/model/form';
import { BusquedaFormularios } from '../../../domain/port/formRepository';

// Igual que searchByText de preguntas: compara sin acentos ni mayúsculas.
// Los pares son fijos (no vienen del usuario), así que no hay riesgo de inyección.
const PARES: Array<[string, string]> = [
    ['á', 'a'], ['é', 'e'], ['í', 'i'], ['ó', 'o'], ['ú', 'u'],
    ['Á', 'A'], ['É', 'E'], ['Í', 'I'], ['Ó', 'O'], ['Ú', 'U'],
    ['ñ', 'n'], ['Ñ', 'N'], ['ü', 'u'], ['Ü', 'U'], ['ç', 'c'],
];

function sinAcentos(expr: string): string {
    return `UPPER(${PARES.reduce((acc, [de, a]) => `REPLACE(${acc}, '${de}', '${a}')`, expr)})`;
}

export async function searchFormulariosQuery(
    opciones: BusquedaFormularios
): Promise<{ data: Formulario[]; total: number }> {
    const condiciones: string[] = [];
    const params: Array<string | number> = [];

    if (opciones.activo !== undefined) {
        condiciones.push('is_active = ?');
        params.push(opciones.activo ? 1 : 0);
    }
    if (opciones.q) {
        condiciones.push(`${sinAcentos('titulo')} LIKE ${sinAcentos('?')}`);
        params.push(`%${opciones.q}%`);
    }
    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

    const [countRows]: any = await MysqlConnection.query(
        `SELECT COUNT(*) AS total FROM formulario ${where}`,
        params
    );

    const offset = (opciones.page - 1) * opciones.limit;
    const [rows]: any = await MysqlConnection.query(
        `SELECT * FROM formulario ${where}
     ORDER BY fecha_creacion DESC, id_formulario DESC
     LIMIT ? OFFSET ?`,
        [...params, opciones.limit, offset]
    );

    return { data: rows, total: Number(countRows[0]?.total ?? 0) };
}
