import { jsPDF } from 'jspdf';
import { AlumnoData, PeriodoId } from './tipos';
import {
  PERIODOS_INFO,
  calcularPromedioBimestral,
  calcularPromedioAnualEstudiante,
  calcularAsistenciaAnual,
} from './datos';

export function descargarBoletaPDF(alumno: AlumnoData, periodoActual: PeriodoId) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const periodoInfo = PERIODOS_INFO.find(p => p.id === periodoActual) || PERIODOS_INFO[0];
  const fechaHoy = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Cabecera institucional elegante
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('I.E. REPÚBLICA DE LAS AMÉRICAS', 15, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('SISTEMA INTEGRADO DE EVALUACIÓN Y GESTIÓN ACADÉMICA · CÓDIGO MODULAR: 0451892', 15, 18);
  doc.text('DIRECCIÓN REGIONAL DE EDUCACIÓN · UNIDAD DE GESTIÓN EDUCATIVA LOCAL N° 03', 15, 23);

  // Título del documento
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 34, 180, 10, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('BOLETA OFICIAL DE CALIFICACIONES Y RENDIMIENTO ACADÉMICO', 105, 40.5, { align: 'center' });

  // Ficha del estudiante
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 48, 180, 28, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('ESTUDIANTE:', 20, 55);
  doc.text('N° DNI:', 20, 62);
  doc.text('GRADO Y SECCIÓN:', 20, 69);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`${alumno.apellidos}, ${alumno.nombres}`.toUpperCase(), 50, 55);
  doc.text(alumno.dni, 50, 62);
  doc.text(`${alumno.grado} - Sección "${alumno.seccion}"`, 50, 69);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('AÑO LECTIVO:', 125, 55);
  doc.text('PERIODO VIGENTE:', 125, 62);
  doc.text('DOCENTE TUTOR:', 125, 69);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`${alumno.añoLectivo}`, 160, 55);
  doc.text(`Bimestre ${periodoInfo.romano}`, 160, 62);
  doc.text(alumno.tutor, 160, 69);

  // Tabla de calificaciones
  const startY = 82;
  const colX = {
    curso: 17,
    n1: 95,
    n2: 110,
    n3: 125,
    promBim: 142,
    asist: 160,
    estado: 180,
  };

  // Encabezado de tabla
  doc.setFillColor(30, 41, 59);
  doc.rect(15, startY, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('ASIGNATURA / ÁREA CURRICULAR', colX.curso, startY + 5.5);
  doc.text('N1 (30%)', colX.n1, startY + 5.5, { align: 'center' });
  doc.text('N2 (30%)', colX.n2, startY + 5.5, { align: 'center' });
  doc.text('N3 (40%)', colX.n3, startY + 5.5, { align: 'center' });
  doc.text('PROM. BIM', colX.promBim, startY + 5.5, { align: 'center' });
  doc.text('ASIST. %', colX.asist, startY + 5.5, { align: 'center' });
  doc.text('CONDICIÓN', colX.estado, startY + 5.5, { align: 'center' });

  // Filas de los 3 cursos
  let curY = startY + 8;
  let totalPromedioBim = 0;
  let totalAsistenciaBim = 0;

  alumno.cursos.forEach((curso, index) => {
    const rowColor = index % 2 === 0 ? 255 : 248;
    doc.setFillColor(rowColor, rowColor, rowColor);
    doc.rect(15, curY, 180, 8.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(15, curY + 8.5, 195, curY + 8.5);

    const notas = curso.notasPorPeriodo[periodoActual];
    const promBim = calcularPromedioBimestral(notas);
    totalPromedioBim += promBim;
    totalAsistenciaBim += notas.asistencia;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(curso.nombre, colX.curso, curY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.text(notas.n1.toString(), colX.n1, curY + 5.5, { align: 'center' });
    doc.text(notas.n2.toString(), colX.n2, curY + 5.5, { align: 'center' });
    doc.text(notas.n3.toString(), colX.n3, curY + 5.5, { align: 'center' });

    // Promedio con color según aprobación
    doc.setFont('helvetica', 'bold');
    if (promBim >= 14) {
      doc.setTextColor(15, 118, 110);
    } else if (promBim >= 11) {
      doc.setTextColor(30, 64, 175);
    } else {
      doc.setTextColor(185, 28, 28);
    }
    doc.text(promBim.toFixed(1), colX.promBim, curY + 5.5, { align: 'center' });

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text(`${notas.asistencia}%`, colX.asist, curY + 5.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    if (promBim >= 11) {
      doc.setTextColor(22, 101, 52);
      doc.text('APROBADO', colX.estado, curY + 5.5, { align: 'center' });
    } else {
      doc.setTextColor(185, 28, 28);
      doc.text('RECUPERACIÓN', colX.estado, curY + 5.5, { align: 'center' });
    }

    curY += 8.5;
  });

  const promBimFinal = Math.round((totalPromedioBim / alumno.cursos.length) * 10) / 10;
  const promAsistFinal = Math.round(totalAsistenciaBim / alumno.cursos.length);
  const promAnualGeneral = calcularPromedioAnualEstudiante(alumno);
  const asistAnualGeneral = calcularAsistenciaAnual(alumno);

  // Fila de totales bimestrales
  doc.setFillColor(241, 245, 249);
  doc.rect(15, curY, 180, 8.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(15, curY, 180, 8.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`PROMEDIO BIMESTRAL ACUMULADO (BIMESTRE ${periodoInfo.romano}):`, colX.curso, curY + 6);
  doc.text(promBimFinal.toFixed(1), colX.promBim, curY + 6, { align: 'center' });
  doc.text(`${promAsistFinal}%`, colX.asist, curY + 6, { align: 'center' });
  doc.text(promBimFinal >= 11 ? 'PROMOVIDO' : 'EN RIESGO', colX.estado, curY + 6, { align: 'center' });

  curY += 15;

  // Resumen anual consolidado
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, curY, 180, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('CONSOLIDADO ANUAL ACUMULADO (4 BIMESTRES):', 20, curY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Promedio Anual General:`, 20, curY + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(promAnualGeneral >= 11 ? 30 : 185, promAnualGeneral >= 11 ? 64 : 28, promAnualGeneral >= 11 ? 175 : 28);
  doc.text(`${promAnualGeneral.toFixed(1)} / 20.0`, 62, curY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Asistencia Global Anual:`, 105, curY + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${asistAnualGeneral}%`, 145, curY + 14);

  curY += 28;

  // Escala de calificación normativa
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, curY, 180, 18, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('ESCALA DE CALIFICACIÓN VIGESIMAL (MINISTERIO DE EDUCACIÓN):', 20, curY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('· 18 - 20: AD (Logro Destacado) - Evidencia un nivel superior a lo esperado.', 20, curY + 10.5);
  doc.text('· 14 - 17: A (Logro Esperado) - Cumple satisfactoriamente las competencias.', 20, curY + 14.5);
  doc.text('· 11 - 13: B (En Proceso) - Próximo al nivel requerido, requiere acompañamiento.', 105, curY + 10.5);
  doc.text('· 00 - 10: C (En Inicio) - Dificultades notables, requiere recuperación pedagógica.', 105, curY + 14.5);

  curY += 30;

  // Firmas oficiales
  doc.setDrawColor(148, 163, 184);
  doc.line(30, curY + 16, 85, curY + 16);
  doc.line(125, curY + 16, 180, curY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('DIRECCIÓN GENERAL', 57.5, curY + 21, { align: 'center' });
  doc.text('Mg. Alberto Valenzuela S.', 57.5, curY + 25, { align: 'center' });

  doc.text('DOCENCIA TUTORA', 152.5, curY + 21, { align: 'center' });
  doc.text(alumno.tutor, 152.5, curY + 25, { align: 'center' });

  // Pie de página
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Documento académico oficial emitido el ${fechaHoy}. Validez interna sujeta a verificación en secretaría académica.`, 105, 285, { align: 'center' });

  const nombreLimpio = `${alumno.apellidos}_${alumno.nombres}`.replace(/\s+/g, '_');
  doc.save(`Boleta_Oficial_${alumno.dni}_${nombreLimpio}_${periodoActual.toUpperCase()}.pdf`);
}
