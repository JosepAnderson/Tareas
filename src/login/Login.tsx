import React, { useState } from 'react';
import { Lock, User, AlertTriangle } from 'lucide-react';

interface LoginProps {
  onLoginExitoso: (nombreDocente: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginExitoso }) => {
  const [formLogin, setFormLogin] = useState({ usuario: '', clave: '' });
  const [errorLogin, setErrorLogin] = useState<string>('');

  const handleIniciarSesion = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin('');

    // Validación oficial requerida: Usuario: "profesor", Clave: "123"
    if (formLogin.usuario.trim() === 'profesor' && formLogin.clave.trim() === '123') {
      onLoginExitoso('Prof. Carlos Paredes');
    } else {
      setErrorLogin('Credenciales incorrectas. Verifique el usuario ("profesor") y la clave ("123").');
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-md p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-xs mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Acceso Docente</h2>
          <p className="text-xs text-slate-500 mt-1">
            Portal administrativo de control de notas, actas y calificaciones.
          </p>
        </div>

        {errorLogin && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorLogin}</span>
          </div>
        )}

        <form onSubmit={handleIniciarSesion} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Usuario Docente</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Ingrese su usuario"
                value={formLogin.usuario}
                onChange={e => setFormLogin({ ...formLogin, usuario: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="Ingrese su contraseña"
                value={formLogin.clave}
                onChange={e => setFormLogin({ ...formLogin, clave: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-colors mt-2"
          >
            Ingresar al Panel
          </button>
        </form>

        {/* Credenciales de demostración asignadas */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
            <span className="font-semibold text-slate-800 block mb-1">Credenciales oficiales asignadas:</span>
            <div className="text-slate-600 space-y-0.5 font-mono text-[11px]">
              <div>Usuario: <strong className="text-indigo-700 font-bold">profesor</strong></div>
              <div>Clave: <strong className="text-indigo-700 font-bold">123</strong></div>
            </div>
            <button
              type="button"
              onClick={() => setFormLogin({ usuario: 'profesor', clave: '123' })}
              className="mt-2.5 w-full py-1.5 px-3 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors"
            >
              Autocompletar credenciales
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
