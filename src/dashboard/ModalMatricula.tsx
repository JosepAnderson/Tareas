import React, { useState } from 'react';
import { PlusCircle, X, AlertTriangle } from 'lucide-react';
import { AlumnoCreateData, AlumnoData } from '../consulta_dni/tipos';

interface ModalMatriculaProps {
  estudiantesExistentes: AlumnoData[];
  onCerrar: () => void;
  onMatricular: (nuevoAlumno: AlumnoCreateData) => Promise<void>;
}

export const ModalMatricula: React.FC<ModalMatriculaProps> = ({
  estudiantesExistentes,
  onCerrar,
  onMatricular,
}) => {
  const [form, setForm] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    grado: '4° de Secundaria',
    seccion: 'A',
    tutor: 'Lic. Martha Gómez',
  });
  const [error, setError] = useState<string>('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const dniLimpio = form.dni.trim();
    if (dniLimpio.length !== 8) {
      setError('El DNI debe contener exactamente 8 dígitos.');
      return;
    }

    if (estudiantesExistentes.some(est => est.dni === dniLimpio)) {
      setError('Ya existe un estudiante matriculado con este número de DNI.');
      return;
    }

    if (!form.nombres.trim() || !form.apellidos.trim()) {
      setError('Por favor complete los nombres y apellidos del estudiante.');
      return;
    }

    setGuardando(true);
    try {
      await onMatricular({
        dni: dniLimpio,
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        grado: form.grado,
        seccion: form.seccion,
        tutor: form.tutor,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo guardar la matrícula.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Agregar Nuevo Estudiante
            </h3>
            <span className="text-xs text-slate-400 block mt-0.5">
              Asignación inmediata: Matemáticas, Ciencias y Comunicación
            </span>
          </div>
          <button
            onClick={onCerrar}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Número de DNI (8 dígitos)
            </label>
            <input
              type="text"
              maxLength={8}
              required
              placeholder="Ej: 78945612"
              value={form.dni}
              onChange={e => setForm({ ...form, dni: e.target.value.replace(/\D/g, '') })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombres</label>
            <input
              type="text"
              required
              placeholder="Ej: Lucía Fernanda"
              value={form.nombres}
              onChange={e => setForm({ ...form, nombres: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Apellidos</label>
            <input
              type="text"
              required
              placeholder="Ej: Salazar Morales"
              value={form.apellidos}
              onChange={e => setForm({ ...form, apellidos: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Grado</label>
              <select
                value={form.grado}
                onChange={e => setForm({ ...form, grado: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="4° de Secundaria">4° de Secundaria</option>
                <option value="5° de Secundaria">5° de Secundaria</option>
                <option value="3° de Secundaria">3° de Secundaria</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sección</label>
              <select
                value={form.seccion}
                onChange={e => setForm({ ...form, seccion: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="A">Sección A</option>
                <option value="B">Sección B</option>
                <option value="C">Sección C</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Docente Tutor</label>
            <input
              type="text"
              value={form.tutor}
              onChange={e => setForm({ ...form, tutor: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
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
              disabled={guardando}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              {guardando ? 'Guardando...' : 'Completar Matrícula'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
