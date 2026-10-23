export type PeriodoId = 'bim1' | 'bim2' | 'bim3' | 'bim4';

export interface NotaPeriodo {
  n1: number; // Prácticas y tareas (30%)
  n2: number; // Proyectos y trabajos (30%)
  n3: number; // Examen bimestral (40%)
  asistencia: number; // Porcentaje 0 - 100%
}

export interface CursoData {
  id: string;
  nombre: string;
  area: string;
  profesor: string;
  creditos: number;
  notasPorPeriodo: Record<PeriodoId, NotaPeriodo>;
}

export interface AlumnoData {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  grado: string;
  seccion: string;
  añoLectivo: number;
  tutor: string;
  estado: 'Activo' | 'Retirado' | 'Trasladado';
  cursos: CursoData[];
}

export interface AlumnoCreateData {
  dni: string;
  nombres: string;
  apellidos: string;
  grado: string;
  seccion: string;
  tutor: string;
}

export interface AlumnoCreateResponse {
  message: string;
  alumno: AlumnoData;
}

export type VistaRuta = '/inicio' | '/dni' | '/iniciar-sesion' | '/dashboard';
