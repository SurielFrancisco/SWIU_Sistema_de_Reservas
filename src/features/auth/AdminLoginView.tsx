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
  Store,
  UtensilsCrossed,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/app/hooks';
import { signIn } from './store/authSlice';

// Credenciales de demostración — en producción vendrían del backend
const DEMO_ADMINS: Record<string, { name: string; password: string }> = {
  'admin@asador.com':    { name: 'Carlos Méndez',  password: 'admin123' },
  'admin@sushizen.com':  { name: 'Yuki Tanaka',    password: 'admin123' },
  'admin@terraza.com':   { name: 'Marina Torres',  password: 'admin123' },
};

// ─────────────────────────────────────────────
// Credenciales de acceso visibles en el panel
const demoCards = [
  { email: 'admin@asador.com',   restaurant: 'El Asador Gourmet' },
  { email: 'admin@sushizen.com', restaurant: 'Sushi Zen' },
  { email: 'admin@terraza.com',  restaurant: 'La Terraza del Mar' },
];
// ─────────────────────────────────────────────

export default function AdminLoginView() {
  const navigate   = useNavigate();
  const dispatch   = useAppDispatch();

  const [email,        setEmail       ] = useState('');
  const [password,     setPassword    ] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError       ] = useState('');
  const [isLoading,    setIsLoading   ] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    // Simula una llamada asíncrona al backend
    setTimeout(() => {
      const trimmedEmail = email.toLowerCase().trim();
      const admin = DEMO_ADMINS[trimmedEmail];

      if (admin) {
        if (admin.password !== password) {
          setError('Contraseña incorrecta para esta cuenta.');
          setIsLoading(false);
          return;
        }
      } else if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        setIsLoading(false);
        return;
      }

      dispatch(
        signIn({
          email: trimmedEmail,
          role: 'admin',
          userName: admin?.name || trimmedEmail.split('@')[0],
        }),
      );
      navigate('/admin', { replace: true });
    }, 600);
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword('admin123');
    setError('');
  }

  return (
    <main className="min-h-screen bg-brand-secondary text-brand-primary selection:bg-brand-primary/10 lg:grid lg:grid-cols-2">

      {/* ── Panel izquierdo — identidad operativa ── */}
      <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col lg:justify-between bg-[#0f0f0f]">
        {/* Patrón de cuadrícula sutil */}
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

        {/* Logo */}
        <div
          className="relative z-10 m-8 flex w-fit items-center gap-2 text-white"
        >
          <UtensilsCrossed className="h-8 w-8" />
          <span className="font-serif text-2xl font-bold tracking-tight">SDReservas</span>
        </div>

        {/* Copy inferior */}
        <div className="relative z-10 px-12 pb-14 text-white">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-white/70" />
            Acceso exclusivo para administradores
          </div>
          <p className="font-serif text-4xl font-medium leading-tight xl:text-5xl">
            Gestiona tu restaurante desde un solo lugar.
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            Configura pisos, mesas, áreas y publica tu establecimiento para que tus clientes puedan reservar en tiempo real.
          </p>

          {/* Tarjetas de acceso demo
          <div className="mt-10 space-y-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
              Cuentas de demostración — contraseña: <span className="text-white/60">admin123</span>
            </p>
            {demoCards.map((card) => (
              <button
                key={card.email}
                type="button"
                onClick={() => fillDemo(card.email)}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/70 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                <Store className="h-4 w-4 shrink-0 text-white/40" />
                <span>
                  <span className="block font-medium text-white/90">{card.restaurant}</span>
                  <span className="text-xs text-white/50">{card.email}</span>
                </span>
              </button>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── Panel derecho — formulario ── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
        {/* Orbes de fondo */}
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-brand-primary/[0.035] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 -left-32 h-96 w-96 rounded-full bg-brand-primary/[0.025] blur-3xl" />

        {/* Volver — solo visible en móvil */}
        <Link
          to="/login"
          className="absolute left-5 top-6 z-10 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-primary sm:left-8 sm:top-8 lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo — solo móvil */}
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <UtensilsCrossed className="h-7 w-7" />
            <span className="font-serif text-2xl font-bold tracking-tight">SDReservas</span>
          </div>

          {/* Badge de rol */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
            Portal de administración
          </div>

          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
              Acceso admin
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Ingresa con las credenciales de tu cuenta de administrador para gestionar tu restaurante.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Correo */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Correo electrónico</span>
              <span className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 transition-all focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100">
                <Mail className="h-5 w-5 shrink-0 text-gray-400" />
                <input
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
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
              <div className="mb-2 flex items-center justify-between text-sm font-medium">
                <label htmlFor="admin-password">Contraseña</label>
                <button
                  type="button"
                  className="font-normal text-gray-500 transition-colors hover:text-brand-primary"
                >
                  ¿La olvidaste?
                </button>
              </div>
              <span
                className={`flex h-14 items-center gap-3 rounded-2xl border bg-white px-4 transition-all focus-within:ring-4 ${
                  error
                    ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-100'
                    : 'border-gray-200 focus-within:border-gray-400 focus-within:ring-gray-100'
                }`}
              >
                <LockKeyhole className={`h-5 w-5 shrink-0 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
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

              {/* Error de credenciales */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Botón de acceso */}
            <button
              type="submit"
              disabled={isLoading}
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-6 font-medium text-white shadow-lg shadow-gray-300/40 transition-all hover:-translate-y-0.5 hover:bg-brand-primary/90 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verificando…
                </>
              ) : (
                <>
                  Entrar al panel
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Tarjetas de demo — solo móvil */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 lg:hidden">
            <p className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Cuentas de demo · contraseña: admin123
            </p>
            <div className="space-y-2">
              {demoCards.map((card) => (
                <button
                  key={card.email}
                  type="button"
                  onClick={() => fillDemo(card.email)}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-100 px-3 py-2.5 text-left text-sm transition-colors hover:bg-gray-50"
                >
                  <Store className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>
                    <span className="block font-medium text-brand-primary">{card.restaurant}</span>
                    <span className="text-xs text-gray-400">{card.email}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Enlace para crear cuenta de administrador */}
          <p className="mt-8 text-center text-sm text-gray-500">
            ¿No tienes cuenta para tu restaurante?{' '}
            <Link
              to="/register/admin"
              className="font-medium text-brand-primary underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-brand-primary"
            >
              Regístrate como administrador
            </Link>
          </p>

          {/* Enlace a login de cliente */}
          <p className="mt-4 text-center text-sm text-gray-500">
            ¿Eres cliente?{' '}
            <Link
              to="/login"
              className="font-medium text-brand-primary underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-brand-primary"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  );
}

