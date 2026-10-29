import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  UtensilsCrossed,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/app/hooks';
import { signIn } from './store/authSlice';

export default function AdminRegisterView() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setPasswordError('');
    setIsLoading(true);

    setTimeout(() => {
      const trimmedEmail = email.toLowerCase().trim();
      dispatch(
        signIn({
          email: trimmedEmail,
          role: 'admin',
          userName: name.trim() || trimmedEmail.split('@')[0],
        }),
      );
      navigate('/admin', { replace: true });
    }, 600);
  }

  return (
    <main className="min-h-screen bg-brand-secondary text-brand-primary selection:bg-brand-primary/10 lg:grid lg:grid-cols-2">
      {/* ── Panel izquierdo — identidad operativa ── */}
      <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col lg:justify-between bg-[#0f0f0f]">
        {/* Patrón de cuadrícula */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Orbe decorativo */}
        <div className="absolute -left-32 top-1/3 h-[480px] w-[480px] rounded-full bg-brand-primary/20 blur-[120px]" />

        {/* Logo (texto estático sin redirección) */}
        <div className="relative z-10 m-8 flex w-fit items-center gap-2 text-white">
          <UtensilsCrossed className="h-8 w-8" />
          <span className="font-serif text-2xl font-bold tracking-tight">SDReservas</span>
        </div>

        {/* Copy inferior */}
        <div className="relative z-10 px-12 pb-14 text-white">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-white/70" />
            Portal para establecimientos
          </div>
          <p className="font-serif text-4xl font-medium leading-tight xl:text-5xl">
            Lleva tu restaurante al siguiente nivel digital.
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            Regístrate como administrador para diseñar tu plano de mesas interactivo, gestionar turnos y recibir reservas en tiempo real.
          </p>
        </div>
      </section>

      {/* ── Panel derecho — formulario ── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
        {/* Orbes de fondo */}
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-brand-primary/[0.035] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 -left-32 h-96 w-96 rounded-full bg-brand-primary/[0.025] blur-3xl" />

        {/* Volver en móvil */}
        <Link
          to="/login/admin"
          className="absolute left-5 top-6 z-10 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-primary sm:left-8 sm:top-8 lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Iniciar sesión
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo móvil */}
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <UtensilsCrossed className="h-7 w-7" />
            <span className="font-serif text-2xl font-bold tracking-tight">SDReservas</span>
          </div>

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
            Registro de administrador
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
              Crea tu cuenta admin
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Registra tus datos para comenzar a administrar tus restaurantes y planos de mesas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre completo */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Nombre completo</span>
              <span className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 transition-all focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100">
                <User className="h-5 w-5 shrink-0 text-gray-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Ej. Roberto Gómez"
                  className="h-full min-w-0 flex-1 bg-transparent text-brand-primary outline-none placeholder:text-gray-400"
                />
              </span>
            </label>

            {/* Correo electrónico */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Correo electrónico corporativo</span>
              <span className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 transition-all focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100">
                <Mail className="h-5 w-5 shrink-0 text-gray-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@mirestaurante.com"
                  className="h-full min-w-0 flex-1 bg-transparent text-brand-primary outline-none placeholder:text-gray-400"
                />
              </span>
            </label>

            {/* Contraseña */}
            <div>
              <label htmlFor="admin-register-password" className="mb-2 block text-sm font-medium">
                Contraseña
              </label>
              <span className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 transition-all focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100">
                <LockKeyhole className="h-5 w-5 shrink-0 text-gray-400" />
                <input
                  id="admin-register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className="h-full min-w-0 flex-1 bg-transparent text-brand-primary outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </span>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label htmlFor="admin-register-confirm" className="mb-2 block text-sm font-medium">
                Confirmar contraseña
              </label>
              <span
                className={`flex h-14 items-center gap-3 rounded-2xl border bg-white px-4 transition-all focus-within:ring-4 ${
                  passwordError
                    ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-100'
                    : 'border-gray-200 focus-within:border-gray-400 focus-within:ring-gray-100'
                }`}
              >
                <LockKeyhole
                  className={`h-5 w-5 shrink-0 ${passwordError ? 'text-red-400' : 'text-gray-400'}`}
                />
                <input
                  id="admin-register-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className="h-full min-w-0 flex-1 bg-transparent text-brand-primary outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </span>

              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500"
                >
                  {passwordError}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-6 font-medium text-white shadow-lg shadow-gray-300/40 transition-all hover:-translate-y-0.5 hover:bg-brand-primary/90 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creando cuenta…
                </>
              ) : (
                <>
                  Registrar administrador
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Enlace hacia inicio de sesión admin */}
          <p className="mt-8 text-center text-sm text-gray-500">
            ¿Ya tienes una cuenta de administrador?{' '}
            <Link
              to="/login/admin"
              className="font-medium text-brand-primary underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-brand-primary"
            >
              Inicia sesión aquí
            </Link>
          </p>

          {/* Enlace hacia portal de cliente */}
          <p className="mt-4 text-center text-sm text-gray-500">
            ¿Eres cliente comensal?{' '}
            <Link
              to="/register"
              className="font-medium text-brand-primary underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-brand-primary"
            >
              Crea tu cuenta de cliente
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  );
}

