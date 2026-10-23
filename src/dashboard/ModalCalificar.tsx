import React, { useState } from 'react';
import { Edit3, X } from 'lucide-react';
import { AlumnoData, NotaPeriodo, PeriodoId } from '../consulta_dni/tipos';
import { PERIODOS_INFO, calcularPromedioBimestral } from '../consulta_dni/datos';

interface ModalCalificarProps {
  alumno: AlumnoData;
  periodoActivo: PeriodoId;
  onCerrar: () => void;
  onGuardar: (alumnoId: string, cursoId: string, notasActualizadas: NotaPeriodo) => void;
}

export const ModalCalificar: React.FC<ModalCalificarProps> = ({
  alumno,
  periodoActivo,
  onCerrar,
  onGuardar,
}) => {
  const [cursoSeleccionadoId, setCursoSeleccionadoId] = useState<string>(
    alumno.cursos[0]?.id || 'mat'
  );

  const cursoActual = alumno.cursos.find(c => c.id === cursoSeleccionadoId) || alumno.cursos[0];
  const notasIniciales = cursoActual?.notasPorPeriodo[periodoActivo] || {
    n1: 14,
    n2: 14,
    n3: 14,
    asistencia: 95,
  };

  const [edicionNotas, setEdicionNotas] = useState<NotaPeriodo>({ ...notasIniciales });

  const handleCambioCurso = (nuevoId: string) => {
    setCursoSeleccionadoId(nuevoId);
    const curso = alumno.cursos.find(c => c.id === nuevoId);
    if (curso) {
      setEdicionNotas({ ...curso.notasPorPeriodo[periodoActivo] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n1 = Math.min(20, Math.max(0, Number(edicionNotas.n1) || 0));
    const n2 = Math.min(20, Math.max(0, Number(edicionNotas.n2) || 0));
    const n3 = Math.min(20, Math.max(0, Number(edicionNotas.n3) || 0));
    const asistencia = Math.min(100, Math.max(0, Number(edicionNotas.asistencia) || 0));

    onGuardar(alumno.id, cursoSeleccionadoId, { n1, n2, n3, asistencia });
  };

  const promActual = calcularPromedioBimestral(edicionNotas);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-400" />
              Calificar y Actualizar Notas
            </h3>
            <span className="text-xs text-slate-400 block mt-0.5">
              Estudiante: {alumno.apellidos}, {alumno.nombres} ({alumno.dni})
            </span>
          </div>
          <button
            onClick={onCerrar}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Selector de Asignatura */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seleccionar Asignatura (Matemáticas, Ciencias o Comunicación)
            </label>
            <select
              value={cursoSeleccionadoId}
              onChange={e => handleCambioCurso(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            >
              {alumno.cursos.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre} · {c.profesor}
                </option>
              ))}
            </select>
          </div>

          {/* Indicador de Bimestre */}
          <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-100 flex items-center justify-between text-xs">
            <span className="text-indigo-900 font-medium">Periodo a Calificar:</span>
            <span className="font-bold text-indigo-700">
              {PERIODOS_INFO.find(p => p.id === periodoActivo)?.nombre}
            </span>
          </div>

          {/* Formulario de 3 notas y asistencia */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nota 1: Prácticas (30%)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                step={1}
                required
                value={edicionNotas.n1}
                onChange={e => setEdicionNotas({ ...edicionNotas, n1: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nota 2: Tareas/Proyectos (30%)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                step={1}
                required
                value={edicionNotas.n2}
                onChange={e => setEdicionNotas({ ...edicionNotas, n2: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nota 3: Examen Bimestral (40%)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                step={1}
                required
                value={edicionNotas.n3}
                onChange={e => setEdicionNotas({ ...edicionNotas, n3: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Asistencia del Periodo (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                required
                value={edicionNotas.asistencia}
                onChange={e => setEdicionNotas({ ...edicionNotas, asistencia: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Vista previa en tiempo real */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Nuevo Promedio Ponderado:</span>
              <span className="text-[11px] text-slate-400">N1(0.3) + N2(0.3) + N3(0.4)</span>
            </div>
            <div className="text-right">
              <span
                className={`text-xl font-mono font-extrabold tabular-nums ${
                  promActual >= 14
                    ? 'text-teal-700'
                    : promActual >= 11
                    ? 'text-blue-700'
                    : 'text-red-700'
                }`}
              >
                {promActual.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {promActual >= 11 ? 'APROBADO' : 'RECUPERACIÓN'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Guardar y Recalcular Métricas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
