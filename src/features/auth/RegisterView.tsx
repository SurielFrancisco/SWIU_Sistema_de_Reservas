import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, User, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';
import { RESTAURANTS_LIST } from '../restaurants/repository';
import { useAppDispatch } from '@/app/hooks';
import { signIn } from './store/authSlice';

// Imagen diferente a la del login para dar variedad
const HERO_IMAGE = RESTAURANTS_LIST[1]?.image ?? RESTAURANTS_LIST[0].image;

export default function RegisterView() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

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

    // Simula el registro e inicia sesión directamente como cliente
    dispatch(signIn({ email, role: 'customer', userName: name.trim() || email.split('@')[0] }));
    navigate('/', { replace: true });
  }

  return (
    <main className="min-h-screen bg-brand-secondary text-brand-primary selection:bg-brand-primary/10 lg:grid lg:grid-cols-2">
      {/* ── Panel izquierdo (decorativo, solo escritorio) ── */}
      <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <img
          src={HERO_IMAGE}
          alt="Interior de restaurante"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/20" />
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />

        <div
          className="relative z-10 m-8 flex w-fit items-center gap-2 text-white"
        >
          <UtensilsCrossed className="h-8 w-8" />
          <span className="font-serif text-2xl font-bold tracking-tight">SDReservas</span>
        </div>

        <div className="relative z-10 max-w-xl px-12 pb-14 text-white">
          <p className="mb-5 inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            Únete a la comunidad
          </p>
          <p className="font-serif text-4xl font-medium leading-tight xl:text-5xl">
            Reserva las mejores mesas con solo unos clics.
          </p>
        </div>
      </section>

      {/* ── Panel derecho (formulario) ── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
        {/* Orbes decorativos de fondo */}
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-brand-primary/[0.035] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 -left-32 h-96 w-96 rounded-full bg-brand-primary/[0.025] blur-3xl" />

        {/* Volver — solo visible en móvil */}
        <Link
          to="/login"
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
          {/* Logo — solo en móvil */}
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <UtensilsCrossed className="h-7 w-7" />
            <span className="font-serif text-2xl font-bold tracking-tight">SDReservas</span>
          </div>

          {/* Encabezado */}
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-gray-500">BIENVENIDO</p>
            <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">Crea tu cuenta</h1>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Regístrate para explorar restaurantes y gestionar tus reservas.
            </p>
          </div>

          {/* Formulario */}
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
                  placeholder="Tu nombre"
                  className="h-full min-w-0 flex-1 bg-transparent text-brand-primary outline-none placeholder:text-gray-400"
                />
              </span>
            </label>

            {/* Correo electrónico */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Correo electrónico</span>
              <span className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 transition-all focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100">
                <Mail className="h-5 w-5 shrink-0 text-gray-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="nombre@correo.com"
                  className="h-full min-w-0 flex-1 bg-transparent text-brand-primary outline-none placeholder:text-gray-400"
                />
              </span>
            </label>

            {/* Contraseña */}
            <div>
              <label htmlFor="register-password" className="mb-2 block text-sm font-medium">
                Contraseña
              </label>
              <span className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 transition-all focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100">
                <LockKeyhole className="h-5 w-5 shrink-0 text-gray-400" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
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
              <label htmlFor="register-confirm" className="mb-2 block text-sm font-medium">
                Confirmar contraseña
              </label>
              <span
                className={`flex h-14 items-center gap-3 rounded-2xl border bg-white px-4 transition-all focus-within:ring-4 ${
                  passwordError
                    ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-100'
                    : 'border-gray-200 focus-within:border-gray-400 focus-within:ring-gray-100'
                }`}
              >
                <LockKeyhole className={`h-5 w-5 shrink-0 ${passwordError ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  id="register-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
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

              {/* Mensaje de error de contraseña */}
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

            {/* Botón de registro */}
            <button
              type="submit"
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-6 font-medium text-white shadow-lg shadow-gray-300/40 transition-all hover:-translate-y-0.5 hover:bg-brand-primary/90 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              Crear cuenta
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Enlace a login */}
          <p className="mt-8 text-center text-sm text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-brand-primary underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-brand-primary"
            >
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  );
}

