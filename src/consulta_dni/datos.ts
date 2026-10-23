import { AlumnoData, CursoData, NotaPeriodo, PeriodoId } from './tipos';

export const PERIODOS_INFO: { id: PeriodoId; nombre: string; romano: string; fecha: string }[] = [
  { id: 'bim1', nombre: 'Primer Bimestre', romano: 'I', fecha: 'Marzo - Mayo' },
  { id: 'bim2', nombre: 'Segundo Bimestre', romano: 'II', fecha: 'Mayo - Julio' },
  { id: 'bim3', nombre: 'Tercer Bimestre', romano: 'III', fecha: 'Agosto - Octubre' },
  { id: 'bim4', nombre: 'Cuarto Bimestre', romano: 'IV', fecha: 'Octubre - Diciembre' },
];

// Cálculo de promedio ponderado: N1(30%) + N2(30%) + N3(40%)
export function calcularPromedioBimestral(n: NotaPeriodo): number {
  const prom = (n.n1 * 0.3) + (n.n2 * 0.3) + (n.n3 * 0.4);
  return Math.round(prom * 10) / 10;
}

// Cálculo del promedio anual de un curso (promedio de los 4 bimestres)
export function calcularPromedioAnualCurso(curso: CursoData): number {
  const bims: PeriodoId[] = ['bim1', 'bim2', 'bim3', 'bim4'];
  const suma = bims.reduce((acc, p) => acc + calcularPromedioBimestral(curso.notasPorPeriodo[p]), 0);
  return Math.round((suma / bims.length) * 10) / 10;
}

// Cálculo del promedio general anual del estudiante
export function calcularPromedioAnualEstudiante(alumno: AlumnoData): number {
  if (alumno.cursos.length === 0) return 0;
  const suma = alumno.cursos.reduce((acc, c) => acc + calcularPromedioAnualCurso(c), 0);
  return Math.round((suma / alumno.cursos.length) * 10) / 10;
}

// Cálculo de asistencia promedio anual
export function calcularAsistenciaAnual(alumno: AlumnoData): number {
  if (alumno.cursos.length === 0) return 0;
  let suma = 0;
  let count = 0;
  const bims: PeriodoId[] = ['bim1', 'bim2', 'bim3', 'bim4'];
  alumno.cursos.forEach(c => {
    bims.forEach(b => {
      suma += c.notasPorPeriodo[b].asistencia;
      count++;
    });
  });
  return Math.round(suma / count);
}

// Los 3 únicos cursos requeridos: Matemáticas, Ciencias y Comunicación
export const CURSOS_DEFAULT = [
  { id: 'mat', nombre: 'Matemáticas', area: 'Ciencias Exactas', profesor: 'Mg. Carlos Paredes', creditos: 5 },
  { id: 'cyt', nombre: 'Ciencias', area: 'Ciencias Naturales', profesor: 'Dr. Roberto Huamán', creditos: 4 },
  { id: 'com', nombre: 'Comunicación', area: 'Humanidades', profesor: 'Lic. Martha Gómez', creditos: 5 },
];

// Estudiantes iniciales con notas completas en los 4 bimestres
export const ESTUDIANTES_INICIALES: AlumnoData[] = [
  {
    id: 'est-001',
    dni: '72458912',
    nombres: 'Carlos Daniel',
    apellidos: 'Mendoza Rojas',
    grado: '4° de Secundaria',
    seccion: 'A',
    añoLectivo: 2026,
    tutor: 'Lic. Martha Gómez',
    estado: 'Activo',
    cursos: [
      {
        id: 'mat',
        nombre: 'Matemáticas',
        area: 'Ciencias Exactas',
        profesor: 'Mg. Carlos Paredes',
        creditos: 5,
        notasPorPeriodo: {
          bim1: { n1: 17, n2: 16, n3: 18, asistencia: 96 },
          bim2: { n1: 18, n2: 17, n3: 19, asistencia: 98 },
          bim3: { n1: 16, n2: 18, n3: 17, asistencia: 95 },
          bim4: { n1: 19, n2: 18, n3: 19, asistencia: 99 },
        },
      },
      {
        id: 'cyt',
        nombre: 'Ciencias',
        area: 'Ciencias Naturales',
        profesor: 'Dr. Roberto Huamán',
        creditos: 4,
        notasPorPeriodo: {
          bim1: { n1: 15, n2: 16, n3: 17, asistencia: 92 },
          bim2: { n1: 16, n2: 16, n3: 18, asistencia: 94 },
          bim3: { n1: 17, n2: 18, n3: 18, asistencia: 96 },
          bim4: { n1: 18, n2: 19, n3: 19, asistencia: 98 },
        },
      },
      {
        id: 'com',
        nombre: 'Comunicación',
        area: 'Humanidades',
        profesor: 'Lic. Martha Gómez',
        creditos: 5,
        notasPorPeriodo: {
          bim1: { n1: 16, n2: 17, n3: 16, asistencia: 95 },
          bim2: { n1: 17, n2: 18, n3: 17, asistencia: 97 },
          bim3: { n1: 18, n2: 17, n3: 18, asistencia: 98 },
          bim4: { n1: 17, n2: 19, n3: 18, asistencia: 100 },
        },
      },
    ],
  },
  {
    id: 'est-002',
    dni: '75319842',
    nombres: 'Valeria Sofía',
    apellidos: 'Quispe Benítez',
    grado: '4° de Secundaria',
    seccion: 'A',
    añoLectivo: 2026,
    tutor: 'Lic. Martha Gómez',
    estado: 'Activo',
    cursos: [
      {
        id: 'mat',
        nombre: 'Matemáticas',
        area: 'Ciencias Exactas',
        profesor: 'Mg. Carlos Paredes',
        creditos: 5,
        notasPorPeriodo: {
          bim1: { n1: 14, n2: 13, n3: 15, asistencia: 92 },
          bim2: { n1: 15, n2: 14, n3: 16, asistencia: 94 },
          bim3: { n1: 16, n2: 15, n3: 16, asistencia: 96 },
          bim4: { n1: 17, n2: 16, n3: 17, asistencia: 98 },
        },
      },
      {
        id: 'cyt',
        nombre: 'Ciencias',
        area: 'Ciencias Naturales',
        profesor: 'Dr. Roberto Huamán',
        creditos: 4,
        notasPorPeriodo: {
          bim1: { n1: 16, n2: 17, n3: 16, asistencia: 95 },
          bim2: { n1: 17, n2: 17, n3: 18, asistencia: 96 },
          bim3: { n1: 18, n2: 18, n3: 18, asistencia: 97 },
          bim4: { n1: 19, n2: 18, n3: 19, asistencia: 99 },
        },
      },
      {
        id: 'com',
        nombre: 'Comunicación',
        area: 'Humanidades',
        profesor: 'Lic. Martha Gómez',
        creditos: 5,
        notasPorPeriodo: {
          bim1: { n1: 18, n2: 19, n3: 19, asistencia: 98 },
          bim2: { n1: 19, n2: 18, n3: 20, asistencia: 100 },
          bim3: { n1: 19, n2: 20, n3: 19, asistencia: 98 },
          bim4: { n1: 20, n2: 19, n3: 20, asistencia: 100 },
        },
      },
    ],
  },
  {
    id: 'est-003',
    dni: '76892341',
    nombres: 'Mateo Alejandro',
    apellidos: 'Fernández Castro',
    grado: '4° de Secundaria',
    seccion: 'A',
    añoLectivo: 2026,
    tutor: 'Lic. Martha Gómez',
    estado: 'Activo',
    cursos: [
      {
        id: 'mat',
        nombre: 'Matemáticas',
        area: 'Ciencias Exactas',
        profesor: 'Mg. Carlos Paredes',
        creditos: 5,
        notasPorPeriodo: {
          bim1: { n1: 11, n2: 12, n3: 10, asistencia: 82 },
          bim2: { n1: 12, n2: 13, n3: 11, asistencia: 85 },
          bim3: { n1: 13, n2: 14, n3: 12, asistencia: 88 },
          bim4: { n1: 14, n2: 15, n3: 13, asistencia: 90 },
        },
      },
      {
        id: 'cyt',
        nombre: 'Ciencias',
        area: 'Ciencias Naturales',
        profesor: 'Dr. Roberto Huamán',
        creditos: 4,
        notasPorPeriodo: {
          bim1: { n1: 12, n2: 11, n3: 13, asistencia: 84 },
          bim2: { n1: 13, n2: 12, n3: 14, asistencia: 86 },
          bim3: { n1: 14, n2: 14, n3: 13, asistencia: 89 },
          bim4: { n1: 15, n2: 15, n3: 14, asistencia: 91 },
        },
      },
      {
        id: 'com',
        nombre: 'Comunicación',
        area: 'Humanidades',
        profesor: 'Lic. Martha Gómez',
        creditos: 5,
        notasPorPeriodo: {
          bim1: { n1: 13, n2: 14, n3: 13, asistencia: 88 },
          bim2: { n1: 14, n2: 14, n3: 15, asistencia: 90 },
          bim3: { n1: 15, n2: 15, n3: 14, asistencia: 92 },
          bim4: { n1: 15, n2: 16, n3: 15, asistencia: 94 },
        },
      },
    ],
  },
];

export function crearCursosParaNuevoAlumno(): CursoData[] {
  return CURSOS_DEFAULT.map(c => ({
    ...c,
    notasPorPeriodo: {
      bim1: { n1: 14, n2: 14, n3: 14, asistencia: 95 },
      bim2: { n1: 14, n2: 14, n3: 14, asistencia: 95 },
      bim3: { n1: 14, n2: 14, n3: 14, asistencia: 95 },
      bim4: { n1: 14, n2: 14, n3: 14, asistencia: 95 },
    },
  }));
}
