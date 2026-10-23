import React, { useState } from 'react';
import {
  Search,
  Download,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { AlumnoData, PeriodoId } from './tipos';
import {
  PERIODOS_INFO,
  calcularPromedioBimestral,
  calcularPromedioAnualEstudiante,
  calcularAsistenciaAnual,
} from './datos';
import { descargarBoletaPDF } from './generarBoletaPdf';

interface ConsultaDniProps {
  estudiantes: AlumnoData[];
}

export const ConsultaDni: React.FC<ConsultaDniProps> = ({ estudiantes }) => {
  const [dniBusqueda, setDniBusqueda] = useState<string>('');
  const [alumnoConsultado, setAlumnoConsultado] = useState<AlumnoData | null>(null);
  const [periodoSeleccionadoDNI, setPeriodoSeleccionadoDNI] = useState<PeriodoId>('bim1');
  const [errorDNI, setErrorDNI] = useState<string>('');
  const [mensajeDescargaDNI, setMensajeDescargaDNI] = useState<boolean>(false);

  const handleBuscarDNI = (dniParam?: string) => {
    const valorDNI = (dniParam !== undefined ? dniParam : dniBusqueda).trim();
    if (!valorDNI) {
      setErrorDNI('Por favor ingrese el número de DNI del estudiante.');
      setAlumnoConsultado(null);
      return;
    }

    const encontrado = estudiantes.find(e => e.dni === valorDNI);
    if (encontrado) {
      setAlumnoConsultado(encontrado);
      setErrorDNI('');
    } else {
      setAlumnoConsultado(null);
      setErrorDNI(`No se encontró ningún estudiante matriculado con el DNI ${valorDNI}. Verifique el número ingresado.`);
    }
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado del módulo */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Consulta de Notas y Boleta Escolar
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ingrese el número de Documento Nacional de Identidad (DNI) del estudiante para consultar calificaciones oficiales.
        </p>
      </div>

      {/* Buscador de DNI */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs mb-8">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleBuscarDNI();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              maxLength={8}
              placeholder="Ingrese los 8 dígitos del DNI (ej: 72458912)"
              value={dniBusqueda}
              onChange={e => setDniBusqueda(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-colors whitespace-nowrap flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar Estudiante
          </button>
        </form>

        {/* Accesos rápidos con DNIs de prueba */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center flex-wrap gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Alumnos de prueba:</span>
          {estudiantes.map(est => (
            <button
              key={est.id}
              type="button"
              onClick={() => {
                setDniBusqueda(est.dni);
                handleBuscarDNI(est.dni);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs transition-colors"
            >
              {est.dni} · {est.nombres.split(' ')[0]} {est.apellidos.split(' ')[0]}
            </button>
          ))}
        </div>

        {errorDNI && (
          <div className="mt-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorDNI}</span>
          </div>
        )}
      </div>

      {/* Resultados de la consulta */}
      {alumnoConsultado ? (
        <div className="space-y-6">
          {/* Tarjeta de Datos del Alumno */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xl flex items-center justify-center border border-indigo-200 shrink-0">
                  {alumnoConsultado.nombres[0]}
                  {alumnoConsultado.apellidos[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {alumnoConsultado.apellidos}, {alumnoConsultado.nombres}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono text-slate-700">DNI: {alumnoConsultado.dni}</span>
                    <span>·</span>
                    <span>{alumnoConsultado.grado} "{alumnoConsultado.seccion}"</span>
                    <span>·</span>
                    <span>Tutor: {alumnoConsultado.tutor}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">{alumnoConsultado.estado}</span>
                  </div>
                </div>
              </div>

              {/* Botón de descarga de PDF oficial */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setMensajeDescargaDNI(true);
                    descargarBoletaPDF(alumnoConsultado, periodoSeleccionadoDNI);
                    setTimeout(() => setMensajeDescargaDNI(false), 3000);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{mensajeDescargaDNI ? 'Generando PDF...' : 'Descargar Boleta Oficial (PDF)'}</span>
                </button>
              </div>
            </div>

            {/* Métricas anuales consolidadas del alumno */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                  Promedio Anual Acumulado
                </span>
                <span className="text-xl font-extrabold font-mono text-slate-900 tabular-nums block mt-1">
                  {calcularPromedioAnualEstudiante(alumnoConsultado).toFixed(1)}
                  <span className="text-xs font-normal text-slate-500 ml-1">/ 20</span>
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                  Asistencia General
                </span>
                <span className="text-xl font-extrabold font-mono text-slate-900 tabular-nums block mt-1">
                  {calcularAsistenciaAnual(alumnoConsultado)}%
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                  Condición Escolar
                </span>
                <span className="text-sm font-bold text-emerald-700 block mt-2">
                  {calcularPromedioAnualEstudiante(alumnoConsultado) >= 11 ? 'PROMOVIDO' : 'EN RIESGO'}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                  Año Lectivo
                </span>
                <span className="text-xl font-extrabold font-mono text-slate-900 tabular-nums block mt-1">
                  {alumnoConsultado.añoLectivo}
                </span>
              </div>
            </div>
          </div>

          {/* Selector interactivo de Bimestres */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Calificaciones por Bimestre</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Desglose oficial para las 3 asignaturas: N1 (30%), N2 (30%) y N3 (40%).
                </p>
              </div>

              {/* Segmented control de Bimestres */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                {PERIODOS_INFO.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPeriodoSeleccionadoDNI(p.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      periodoSeleccionadoDNI === p.id
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bimestre {p.romano}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabla detallada de notas del bimestre */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 border-y border-slate-200 font-semibold">
                    <th className="py-3 px-4">Asignatura</th>
                    <th className="py-3 px-4">Docente</th>
                    <th className="py-3 px-3 text-center">N1 (30%)</th>
                    <th className="py-3 px-3 text-center">N2 (30%)</th>
                    <th className="py-3 px-3 text-center">N3 (40%)</th>
                    <th className="py-3 px-4 text-center font-bold">Promedio Bimestral</th>
                    <th className="py-3 px-3 text-center">Asistencia</th>
                    <th className="py-3 px-4 text-center">Condición</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {alumnoConsultado.cursos.map(curso => {
                    const notas = curso.notasPorPeriodo[periodoSeleccionadoDNI];
                    const prom = calcularPromedioBimestral(notas);
                    const esAprobado = prom >= 11;

                    return (
                      <tr key={curso.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 block">{curso.nombre}</span>
                          <span className="text-[11px] text-slate-500">{curso.area}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{curso.profesor}</td>
                        <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-700">{notas.n1}</td>
                        <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-700">{notas.n2}</td>
                        <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-700">{notas.n3}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-mono font-bold text-sm tabular-nums ${
                              prom >= 14
                                ? 'text-teal-700'
                                : prom >= 11
                                ? 'text-blue-700'
                                : 'text-red-700'
                            }`}
                          >
                            {prom.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-700">
                          {notas.asistencia}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[11px] font-semibold ${
                              esAprobado ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {esAprobado ? 'Aprobado' : 'Recuperación'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Resumen del pie de tabla */}
            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <span>
                Fórmula de ponderación oficial:{' '}
                <strong className="text-slate-700">Promedio = (N1 × 0.3) + (N2 × 0.3) + (N3 × 0.4)</strong>
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span>
                  14 - 20 (Destacado)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  11 - 13 (Aprobado)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
                  00 - 10 (Recuperación)
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Ninguna boleta seleccionada</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ingrese el número de DNI de 8 dígitos del estudiante en el buscador superior o elija uno de los alumnos de prueba.
          </p>
        </div>
      )}
    </main>
  );
};
