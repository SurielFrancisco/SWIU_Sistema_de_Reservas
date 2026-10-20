import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, LockKeyhole, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnTo: string;
}

export default function LoginRequiredModal({ isOpen, onClose, returnTo }: LoginRequiredModalProps) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-required-title"
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-7 shadow-2xl sm:p-9"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar aviso"
              className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-primary"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-brand-secondary">
              <LockKeyhole className="h-6 w-6 text-brand-primary" />
            </div>
            <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-gray-500">RESERVA PROTEGIDA</p>
            <h2 id="login-required-title" className="font-serif text-3xl font-medium tracking-tight text-brand-primary">
              Inicia sesión para reservar
            </h2>
            <p className="mt-4 leading-relaxed text-gray-500">
              Necesitas una cuenta para confirmar tu mesa y consultar tus próximas reservas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="order-2 rounded-full px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 sm:order-1"
              >
                Ahora no
              </button>
              <button
                type="button"
                onClick={() => navigate('/login', { state: { returnTo } })}
                className="group order-1 flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-sm font-medium text-white shadow-lg shadow-gray-300/40 transition-all hover:-translate-y-0.5 hover:bg-brand-primary/90 sm:order-2"
              >
                Iniciar sesión
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
