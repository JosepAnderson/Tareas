import { AlumnoData, PeriodoId } from '../consulta_dni/tipos';
import { PERIODOS_INFO, calcularPromedioBimestral, calcularPromedioAnualEstudiante } from '../consulta_dni/datos';

export function exportarActaCSV(estudiantes: AlumnoData[], periodo: PeriodoId) {
  const pInfo = PERIODOS_INFO.find(p => p.id === periodo) || PERIODOS_INFO[0];

  const headers = [
    'DNI',
    'Apellidos',
    'Nombres',
    'Grado',
    'Sección',
    'Periodo',
    'Curso',
    'Nota 1',
    'Nota 2',
    'Nota 3',
    'Promedio Bimestral',
    'Asistencia %',
    'Condición',
    'Promedio Anual Consolidado',
  ];

  const filas: string[][] = [];

  estudiantes.forEach(est => {
    const promAnual = calcularPromedioAnualEstudiante(est);
    est.cursos.forEach(cur => {
      const notas = cur.notasPorPeriodo[periodo];
      const promBim = calcularPromedioBimestral(notas);
      filas.push([
        `"${est.dni}"`,
        `"${est.apellidos}"`,
        `"${est.nombres}"`,
        `"${est.grado}"`,
        `"${est.seccion}"`,
        `"Bimestre ${pInfo.romano}"`,
        `"${cur.nombre}"`,
        notas.n1.toString(),
        notas.n2.toString(),
        notas.n3.toString(),
        promBim.toFixed(1),
        `${notas.asistencia}%`,
        promBim >= 11 ? 'Aprobado' : 'Recuperación',
        promAnual.toFixed(1),
      ]);
    });
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...filas.map(f => f.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Acta_Calificaciones_Bimestre_${pInfo.romano}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
