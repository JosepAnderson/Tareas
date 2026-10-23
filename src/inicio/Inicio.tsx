import React from 'react';
import { School, Search, Download, ChevronRight, UserCheck } from 'lucide-react';
import { AlumnoData } from '../consulta_dni/tipos';

interface InicioProps {
  estudiantes: AlumnoData[];
  onIrAConsultaDni: (dniSugerido?: string) => void;
  metricasAula: {
    total: number;
    promedioGeneral: number;
    tasaAprobacion: number;
    asistenciaMedia: number;
  };
}

export const Inicio: React.FC<InicioProps> = ({
  estudiantes,
  onIrAConsultaDni,
  metricasAula,
}) => {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero institucional */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="p-8 sm:p-12 lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-3">
              <School className="w-4 h-4" />
              <span>Año Escolar 2026 · Sistema Oficial de Evaluación</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              Gestión Académica Escolar y Control Integral de Notas
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              Plataforma oficial para la emisión de boletas bimestrales, consulta de rendimiento en línea para estudiantes y familias mediante DNI, y registro docente de calificaciones.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onIrAConsultaDni()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-colors"
              >
                <Search className="w-4 h-4" />
                Consultar Boleta por DNI
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 lg:col-span-5 text-white flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-2">
                Resumen del Aula Vigente
              </div>
              <h3 className="text-xl font-bold text-white mb-6">4to Grado de Secundaria - Sección "A"</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-sm">
                  <span className="text-slate-300">Estudiantes Matriculados:</span>
                  <span className="font-mono font-bold text-white tabular-nums">{metricasAula.total} Alumnos</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-sm">
                  <span className="text-slate-300">Promedio General del Aula:</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    {metricasAula.promedioGeneral} / 20.0
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-sm">
                  <span className="text-slate-300">Tasa de Aprobación Global:</span>
                  <span className="font-mono font-bold text-indigo-300 tabular-nums">
                    {metricasAula.tasaAprobacion}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Asistencia Escolar Media:</span>
                  <span className="font-mono font-bold text-slate-100 tabular-nums">
                    {metricasAula.asistenciaMedia}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Periodo Académico Activo:</span>
              <span className="text-indigo-300 font-semibold">Bimestre I (Marzo - Mayo)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos rápidos (solo consulta y descarga para familias) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Consulta para Familias</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Padres y apoderados pueden revisar al instante las calificaciones de las 3 asignaturas (Matemáticas, Ciencias y Comunicación) en cualquiera de los 4 bimestres con el DNI del alumno.
            </p>
          </div>
          <button
            onClick={() => onIrAConsultaDni()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800"
          >
            <span>Acceder a consulta</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Boletas en PDF Oficial</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Descarga directa de la libreta de notas oficial en PDF firmada digitalmente, con desglose de notas N1, N2, N3 y asistencia.
            </p>
          </div>
          <button
            onClick={() => onIrAConsultaDni('72458912')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <span>Ver ejemplo de boleta</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DNI de prueba sugeridos */}
      <div className="bg-slate-100/80 rounded-xl p-5 border border-slate-200">
        <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-slate-500" />
          <span>DNIs de demostración cargados en el sistema:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {estudiantes.map(e => (
            <button
              key={e.id}
              onClick={() => onIrAConsultaDni(e.dni)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-md hover:border-indigo-500 hover:text-indigo-700 transition-colors shadow-2xs"
            >
              <span className="font-semibold">{e.apellidos}, {e.nombres.split(' ')[0]}</span>{' '}
              <span className="text-slate-400 font-mono">({e.dni})</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};
