import React, { useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  Percent,
  Calendar,
  Award,
  Search,
  PlusCircle,
  FileSpreadsheet,
  Edit3,
  Download,
  Trash2,
} from 'lucide-react';
import { AlumnoCreateData, AlumnoData, NotaPeriodo, PeriodoId } from '../consulta_dni/tipos';
import {
  PERIODOS_INFO,
  calcularPromedioBimestral,
  calcularPromedioAnualEstudiante,
  calcularAsistenciaAnual,
} from '../consulta_dni/datos';
import { descargarBoletaPDF } from '../consulta_dni/generarBoletaPdf';
import { exportarActaCSV } from './exportarCsv';
import { ModalCalificar } from './ModalCalificar';
import { ModalMatricula } from './ModalMatricula';

interface DashboardProps {
  estudiantes: AlumnoData[];
  docenteUsuario: string;
  onActualizarNota: (alumnoId: string, cursoId: string, notas: NotaPeriodo, periodo: PeriodoId) => void;
  onMatricularEstudiante: (nuevo: AlumnoCreateData) => Promise<void>;
  onEliminarEstudiante: (alumnoId: string) => Promise<void>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  estudiantes,
  docenteUsuario,
  onActualizarNota,
  onMatricularEstudiante,
  onEliminarEstudiante,
}) => {
  const [filtroDashboard, setFiltroDashboard] = useState<string>('');
  const [periodoDashboard, setPeriodoDashboard] = useState<PeriodoId>('bim1');
  const [mostrarModalNuevoAlumno, setMostrarModalNuevoAlumno] = useState<boolean>(false);
  const [alumnoAEditar, setAlumnoAEditar] = useState<AlumnoData | null>(null);

  // Métricas calculadas del aula
  const metricasAula = useMemo((): {
    total: number;
    promedioGeneral: number;
    tasaAprobacion: number;
    asistenciaMedia: number;
    mejorAlumno: AlumnoData | null;
  } => {
    const totalEstudiantes = estudiantes.length;
    if (totalEstudiantes === 0) {
      return {
        total: 0,
        promedioGeneral: 0,
        tasaAprobacion: 0,
        asistenciaMedia: 0,
        mejorAlumno: null,
      };
    }

    let sumaPromedios = 0;
    let sumaAsistencias = 0;
    let aprobados = 0;
    let mejorPromedio = -1;
    let mejorEstudiante: AlumnoData | null = null;

    estudiantes.forEach(est => {
      const promAnual = calcularPromedioAnualEstudiante(est);
      const asistAnual = calcularAsistenciaAnual(est);

      sumaPromedios += promAnual;
      sumaAsistencias += asistAnual;

      if (promAnual >= 11) aprobados++;

      if (promAnual > mejorPromedio) {
        mejorPromedio = promAnual;
        mejorEstudiante = est;
      }
    });

    return {
      total: totalEstudiantes,
      promedioGeneral: Math.round((sumaPromedios / totalEstudiantes) * 10) / 10,
      tasaAprobacion: Math.round((aprobados / totalEstudiantes) * 100),
      asistenciaMedia: Math.round(sumaAsistencias / totalEstudiantes),
      mejorAlumno: mejorEstudiante,
    };
  }, [estudiantes]);

  // Filtro de estudiantes
  const estudiantesFiltrados = useMemo(() => {
    const q = filtroDashboard.trim().toLowerCase();
    if (!q) return estudiantes;
    return estudiantes.filter(
      e =>
        e.dni.includes(q) ||
        e.nombres.toLowerCase().includes(q) ||
        e.apellidos.toLowerCase().includes(q) ||
        e.grado.toLowerCase().includes(q)
    );
  }, [estudiantes, filtroDashboard]);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header del Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
            <span>Colegio Nacional · Sede Central</span>
            <span>·</span>
            <span>Docente: {docenteUsuario}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Panel de Control y Calificaciones
          </h1>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setMostrarModalNuevoAlumno(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Agregar Alumno
          </button>

          <button
            onClick={() => exportarActaCSV(estudiantes, periodoDashboard)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exportar Acta (CSV/Excel)
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas del Aula */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wide">Total Alumnos</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {metricasAula.total}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">4° Secundaria "A"</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wide">Promedio Aula</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {metricasAula.promedioGeneral}
            <span className="text-xs font-normal text-slate-400 ml-1">/ 20</span>
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Nivel Satisfactorio</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wide">Aprobación</span>
            <Percent className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {metricasAula.tasaAprobacion}%
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Promoción regular</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wide">Asistencia Media</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {metricasAula.asistenciaMedia}%
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Presencialidad</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wide">1er Puesto</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-sm font-bold text-slate-900 truncate block mt-1">
            {metricasAula.mejorAlumno ? `${metricasAula.mejorAlumno.apellidos.split(' ')[0]}` : 'N/A'}
          </span>
          <span className="text-[11px] text-amber-600 font-mono font-semibold block">
            {metricasAula.mejorAlumno
              ? `${calcularPromedioAnualEstudiante(metricasAula.mejorAlumno).toFixed(1)} ptos`
              : '—'}
          </span>
        </div>
      </div>

      {/* Barra de herramientas: Filtro y selector de periodo */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Buscar por DNI, nombres o apellidos..."
            value={filtroDashboard}
            onChange={e => setFiltroDashboard(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-mono"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-600 whitespace-nowrap">Bimestre de Trabajo:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            {PERIODOS_INFO.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodoDashboard(p.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  periodoDashboard === p.id
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bimestre {p.romano}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla con los 3 únicos cursos requeridos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3.5 px-4">Estudiante</th>
                <th className="py-3.5 px-3">DNI</th>
                <th className="py-3.5 px-3 text-center">Matemáticas</th>
                <th className="py-3.5 px-3 text-center">Ciencias</th>
                <th className="py-3.5 px-3 text-center">Comunicación</th>
                <th className="py-3.5 px-3 text-center font-bold">Prom. Bimestre</th>
                <th className="py-3.5 px-3 text-center font-bold">Prom. Anual</th>
                <th className="py-3.5 px-3 text-center">Asist. %</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {estudiantesFiltrados.length > 0 ? (
                estudiantesFiltrados.map(alumno => {
                  const curMat = alumno.cursos.find(c => c.id === 'mat');
                  const curCyt = alumno.cursos.find(c => c.id === 'cyt');
                  const curCom = alumno.cursos.find(c => c.id === 'com');

                  const notaMat = curMat ? calcularPromedioBimestral(curMat.notasPorPeriodo[periodoDashboard]) : 0;
                  const notaCyt = curCyt ? calcularPromedioBimestral(curCyt.notasPorPeriodo[periodoDashboard]) : 0;
                  const notaCom = curCom ? calcularPromedioBimestral(curCom.notasPorPeriodo[periodoDashboard]) : 0;

                  const promBim =
                    Math.round(
                      (alumno.cursos.reduce(
                        (acc, c) => acc + calcularPromedioBimestral(c.notasPorPeriodo[periodoDashboard]),
                        0
                      ) /
                        alumno.cursos.length) *
                        10
                    ) / 10;

                  const promAnual = calcularPromedioAnualEstudiante(alumno);
                  const asistAnual = calcularAsistenciaAnual(alumno);

                  return (
                    <tr key={alumno.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">
                          {alumno.apellidos}, {alumno.nombres}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {alumno.grado} "{alumno.seccion}"
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600">{alumno.dni}</td>

                      <td className="py-3.5 px-3 text-center font-mono tabular-nums">
                        <span className={notaMat >= 11 ? 'text-slate-800' : 'text-red-700 font-bold'}>
                          {notaMat.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono tabular-nums">
                        <span className={notaCyt >= 11 ? 'text-slate-800' : 'text-red-700 font-bold'}>
                          {notaCyt.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono tabular-nums">
                        <span className={notaCom >= 11 ? 'text-slate-800' : 'text-red-700 font-bold'}>
                          {notaCom.toFixed(1)}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono tabular-nums font-bold">
                        <span
                          className={
                            promBim >= 14 ? 'text-teal-700' : promBim >= 11 ? 'text-blue-700' : 'text-red-700'
                          }
                        >
                          {promBim.toFixed(1)}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono tabular-nums font-bold text-slate-900">
                        {promAnual.toFixed(1)}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-700">
                        {asistAnual}%
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setAlumnoAEditar(alumno)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs border border-indigo-200 transition-colors"
                            title="Editar Notas y Asistencia"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Calificar</span>
                          </button>

                          <button
                            onClick={() => descargarBoletaPDF(alumno, periodoDashboard)}
                            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Descargar Boleta PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={async () => {
                              const nombre = `${alumno.apellidos}, ${alumno.nombres}`;
                              if (!window.confirm(`¿Está seguro de eliminar a ${nombre}? Esta acción no se puede deshacer.`)) {
                                return;
                              }

                              try {
                                await onEliminarEstudiante(alumno.id);
                              } catch (error) {
                                const mensaje = error instanceof Error
                                  ? error.message
                                  : 'No se pudo eliminar al estudiante.';
                                window.alert(mensaje);
                              }
                            }}
                            className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                            title="Eliminar estudiante"
                            aria-label={`Eliminar a ${alumno.apellidos}, ${alumno.nombres}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                    No se encontraron estudiantes que coincidan con "{filtroDashboard}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Mostrando <strong className="text-slate-800">{estudiantesFiltrados.length}</strong> de{' '}
            <strong className="text-slate-800">{estudiantes.length}</strong> estudiantes.
          </span>
          <span>
            Periodo activo:{' '}
            <strong className="text-indigo-700">
              {PERIODOS_INFO.find(p => p.id === periodoDashboard)?.nombre}
            </strong>
          </span>
        </div>
      </div>

      {/* Modal de Calificación */}
      {alumnoAEditar && (
        <ModalCalificar
          alumno={alumnoAEditar}
          periodoActivo={periodoDashboard}
          onCerrar={() => setAlumnoAEditar(null)}
          onGuardar={(alumnoId, cursoId, notas) => {
            onActualizarNota(alumnoId, cursoId, notas, periodoDashboard);
            setAlumnoAEditar(null);
          }}
        />
      )}

      {/* Modal de Matrícula */}
      {mostrarModalNuevoAlumno && (
        <ModalMatricula
          estudiantesExistentes={estudiantes}
          onCerrar={() => setMostrarModalNuevoAlumno(false)}
          onMatricular={async nuevo => {
            await onMatricularEstudiante(nuevo);
            setMostrarModalNuevoAlumno(false);
          }}
        />
      )}
    </main>
  );
};
