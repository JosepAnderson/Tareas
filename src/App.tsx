import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  LogOut,
  LogIn,
  CheckCircle2,
  School,
} from 'lucide-react';

// Importaciones de los 4 módulos correspondientes
import { AlumnoCreateData, AlumnoCreateResponse, AlumnoData, NotaPeriodo, PeriodoId, VistaRuta } from './consulta_dni/tipos';
import { ESTUDIANTES_INICIALES, PERIODOS_INFO, calcularAsistenciaAnual, calcularPromedioAnualEstudiante } from './consulta_dni/datos';
import { Inicio } from './inicio/Inicio';
import { ConsultaDni } from './consulta_dni/ConsultaDni';
import { Login } from './login/Login';
import { Dashboard } from './dashboard/Dashboard';

export default function App() {
  // Estado de navegación entre las 4 vistas
  const [ruta, setRuta] = useState<VistaRuta>('/inicio');

  // Estado centralizado de alumnos
  const [estudiantes, setEstudiantes] = useState<AlumnoData[]>(ESTUDIANTES_INICIALES);

  // Estado de autenticación del docente
  const [estaAutenticado, setEstaAutenticado] = useState<boolean>(false);
  const [docenteUsuario, setDocenteUsuario] = useState<string>('Prof. Carlos Paredes');

  // Notificación flotante de confirmación
  const [notificacionExito, setNotificacionExito] = useState<string>('');

  const mostrarMensaje = (texto: string) => {
    setNotificacionExito(texto);
    setTimeout(() => {
      setNotificacionExito('');
    }, 4000);
  };

  // Manejo de inicio de sesión docente
  const handleLoginExitoso = (nombreDocente: string) => {
    setEstaAutenticado(true);
    setDocenteUsuario(nombreDocente);
    setRuta('/dashboard');
    mostrarMensaje('¡Sesión iniciada correctamente! Bienvenido al Panel Docente.');
  };

  const handleCerrarSesion = () => {
    setEstaAutenticado(false);
    setRuta('/inicio');
    mostrarMensaje('Ha cerrado la sesión de docente.');
  };

  // Actualización de notas en tiempo real desde el dashboard
  const handleActualizarNota = (
    alumnoId: string,
    cursoId: string,
    notas: NotaPeriodo,
    periodo: PeriodoId
  ) => {
    setEstudiantes(prev =>
      prev.map(est => {
        if (est.id !== alumnoId) return est;
        return {
          ...est,
          cursos: est.cursos.map(cur => {
            if (cur.id !== cursoId) return cur;
            return {
              ...cur,
              notasPorPeriodo: {
                ...cur.notasPorPeriodo,
                [periodo]: notas,
              },
            };
          }),
        };
      })
    );
    const pInfo = PERIODOS_INFO.find(p => p.id === periodo);
    mostrarMensaje(`Calificaciones guardadas exitosamente en ${pInfo?.nombre}.`);
  };

  // Matricular nuevo estudiante
  const handleMatricularEstudiante = async (nuevo: AlumnoCreateData) => {
    const response = await fetch('/api/alumnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    });
    const respuesta: unknown = await response.json();

    if (!response.ok) {
      const detalle =
        typeof respuesta === 'object' &&
        respuesta !== null &&
        'detail' in respuesta &&
        typeof respuesta.detail === 'string'
          ? respuesta.detail
          : `No se pudo guardar la matrícula (HTTP ${response.status}).`;
      throw new Error(detalle);
    }

    const registro = respuesta as AlumnoCreateResponse;
    const alumnoGuardado = registro.alumno;
    setEstudiantes(prev => [alumnoGuardado, ...prev]);
    mostrarMensaje(registro.message);
  };

  const handleEliminarEstudiante = async (alumnoId: string) => {
    const response = await fetch(`/api/alumnos/${encodeURIComponent(alumnoId)}`, {
      method: 'DELETE',
    });
    const resultado: unknown = await response.json();

    if (!response.ok) {
      const detalle =
        typeof resultado === 'object' &&
        resultado !== null &&
        'detail' in resultado &&
        typeof resultado.detail === 'string'
          ? resultado.detail
          : `No se pudo eliminar al estudiante (HTTP ${response.status}).`;
      throw new Error(detalle);
    }

    setEstudiantes(prev => prev.filter(estudiante => estudiante.id !== alumnoId));
    const mensaje =
      typeof resultado === 'object' &&
      resultado !== null &&
      'message' in resultado &&
      typeof resultado.message === 'string'
        ? resultado.message
        : 'Alumno eliminado con éxito';
    mostrarMensaje(mensaje);
  };

  // Métricas generales para el resumen del inicio
  const metricasInicio = React.useMemo(() => {
    const total = estudiantes.length;
    if (total === 0) return { total: 0, promedioGeneral: 0, tasaAprobacion: 0, asistenciaMedia: 0 };

    let sumaPromedios = 0;
    let sumaAsistencias = 0;
    let aprobados = 0;

    estudiantes.forEach(e => {
      const p = calcularPromedioAnualEstudiante(e);
      sumaPromedios += p;
      sumaAsistencias += calcularAsistenciaAnual(e);
      if (p >= 11) aprobados++;
    });

    return {
      total,
      promedioGeneral: Math.round((sumaPromedios / total) * 10) / 10,
      tasaAprobacion: Math.round((aprobados / total) * 100),
      asistenciaMedia: Math.round(sumaAsistencias / total),
    };
  }, [estudiantes]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* ============================================================== */}
      {/* BARRA SUPERIOR DE NAVEGACIÓN INSTITUCIONAL (TOP BAR) */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zona 1: Logotipo y Título */}
          <button
            onClick={() => setRuta('/inicio')}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-indigo-500 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap block">
                EduControl Académico
              </span>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                I.E. República de las Américas
              </span>
            </div>
          </button>

          {/* Zona 2: Enlaces de navegación (Ocultos al ingresar al Dashboard) */}
          {ruta !== '/dashboard' && (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
              <button
                onClick={() => setRuta('/inicio')}
                className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                  ruta === '/inicio' ? 'text-white border-b-2 border-indigo-400 font-semibold' : ''
                }`}
              >
                Inicio Institucional
              </button>
              <button
                onClick={() => setRuta('/dni')}
                className={`hover:text-white transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 ${
                  ruta === '/dni' ? 'text-white border-b-2 border-indigo-400 font-semibold' : ''
                }`}
              >
                <Search className="w-4 h-4" />
                Consulta por DNI
              </button>
            </nav>
          )}

          {/* Zona 3: Estado de autenticación / Acceso Docente */}
          <div className="flex items-center gap-3 shrink-0">
            {estaAutenticado ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-semibold text-white block">{docenteUsuario}</span>
                  <span className="text-[11px] text-emerald-400 block">Docente Conectado</span>
                </div>
                <button
                  onClick={handleCerrarSesion}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setRuta('/iniciar-sesion')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm transition-colors whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                Acceso Docente
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notificación flotante de confirmación */}
      {notificacionExito && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium leading-relaxed">{notificacionExito}</p>
        </div>
      )}

      {/* ============================================================== */}
      {/* RENDERIZADO MODULAR DE LAS 4 VISTAS */}
      {/* ============================================================== */}
      {ruta === '/inicio' && (
        <Inicio
          estudiantes={estudiantes}
          onIrAConsultaDni={() => setRuta('/dni')}
          metricasAula={metricasInicio}
        />
      )}

      {ruta === '/dni' && <ConsultaDni estudiantes={estudiantes} />}

      {ruta === '/iniciar-sesion' && (
        <Login onLoginExitoso={handleLoginExitoso} />
      )}

      {ruta === '/dashboard' && (
        <Dashboard
          estudiantes={estudiantes}
          docenteUsuario={docenteUsuario}
          onActualizarNota={handleActualizarNota}
          onMatricularEstudiante={handleMatricularEstudiante}
          onEliminarEstudiante={handleEliminarEstudiante}
        />
      )}

      {/* ============================================================== */}
      {/* PIE DE PÁGINA INSTITUCIONAL */}
      {/* ============================================================== */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-indigo-600" />
            <span>I.E. República de las Américas · Dirección Académica</span>
          </div>
          <div>
            <span>Sistema Web de Control de Notas · Vigencia 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
