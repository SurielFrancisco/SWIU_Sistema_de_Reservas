import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';
import { RESTAURANTS_LIST } from '../restaurants/repository';
import { useAppDispatch } from '@/app/hooks';
import { signIn } from './store/authSlice';

export default function LoginView() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(signIn({ email, role: 'customer' }));
    const returnTo = (location.state as { returnTo?: string } | null)?.returnTo || '/';
    navigate(returnTo, { replace: true });
  }

  return (
    <main className="min-h-screen bg-brand-secondary text-brand-primary selection:bg-brand-primary/10 lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <img
          src={RESTAURANTS_LIST[0].image}
          alt="Mesa preparada en un restaurante"
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
            Tu próxima experiencia comienza aquí
          </p>
          <p className="font-serif text-4xl font-medium leading-tight xl:text-5xl">
            Las mejores mesas de la ciudad, a un par de clics.
          </p>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-brand-primary/[0.035] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 -left-32 h-96 w-96 rounded-full bg-brand-primary/[0.025] blur-3xl" />

        <Link
          to="/"
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
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <UtensilsCrossed className="h-7 w-7" />
            <span className="font-serif text-2xl font-bold tracking-tight">SDReservas</span>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-gray-500">BIENVENIDO</p>
            <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">Inicia sesión</h1>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Accede para gestionar tus reservas y descubrir nuevos sabores.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Correo electrónico</span>
              <span className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 transition-all focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100">
                <Mail className="h-5 w-5 shrink-0 text-gray-400" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="nombre@correo.com"
                  className="h-full min-w-0 flex-1 bg-transparent text-brand-primary outline-none placeholder:text-gray-400"
                />
              </span>
            </label>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-medium">
                <label htmlFor="password">Contraseña</label>
                <button type="button" className="font-normal text-gray-500 transition-colors hover:text-brand-primary">
                  ¿La olvidaste?
                </button>
              </div>
              <span className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 transition-all focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100">
                <LockKeyhole className="h-5 w-5 shrink-0 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Tu contraseña"
                  className="h-full min-w-0 flex-1 bg-transparent text-brand-primary outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </span>
            </div>

            <label className="flex cursor-pointer items-center gap-3 pt-1 text-sm text-gray-500">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 accent-brand-primary" />
              Recordarme en este dispositivo
            </label>

            <button
              type="submit"
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-6 font-medium text-white shadow-lg shadow-gray-300/40 transition-all hover:-translate-y-0.5 hover:bg-brand-primary/90 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              Entrar a mi cuenta
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            ¿Aún no tienes una cuenta?{' '}
            <Link
              to="/register"
              className="font-medium text-brand-primary underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-brand-primary"
            >
              Crea una cuenta
            </Link>
          </p>

          <p className="mt-8 text-center text-sm text-gray-500">
            ¿Tienes un restaurante?{' '}
            <Link
              to="/login/admin"
              className="font-medium text-brand-primary underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-brand-primary"
            >
              Accede como administrador
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  );
}
