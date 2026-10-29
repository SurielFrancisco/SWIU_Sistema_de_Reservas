import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CreditCard, LockKeyhole, ShieldCheck, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (wasPaid: boolean) => void;
  restaurantName: string;
  deposit: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onComplete,
  restaurantName,
  deposit,
}: PaymentModalProps) {
  const [step, setStep] = useState<'offer' | 'card'>('offer');
  const [isProcessing, setIsProcessing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isProcessingRef = useRef(false);

  const closePayment = useCallback(() => {
    setStep('offer');
    setIsProcessing(false);
    isProcessingRef.current = false;
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isProcessingRef.current) closePayment();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, closePayment]);

  const completePayment = (wasPaid: boolean) => {
    setStep('offer');
    setIsProcessing(false);
    isProcessingRef.current = false;
    onComplete(wasPaid);
  };

  const handlePayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    isProcessingRef.current = true;
    window.setTimeout(() => {
      setIsProcessing(false);
      completePayment(true);
    }, 1100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isProcessing ? undefined : closePayment}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-title"
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-7 shadow-2xl sm:p-9"
          >
            <button
              type="button"
              ref={closeButtonRef}
              onClick={closePayment}
              disabled={isProcessing}
              aria-label="Cerrar pago"
              className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            {step === 'offer' ? (
              <>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-brand-secondary">
                  <CreditCard className="h-6 w-6 text-brand-primary" />
                </div>
                <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-gray-500">OPCIONAL EN ESTE RESTAURANTE</p>
                <h2 id="payment-title" className="font-serif text-3xl font-medium tracking-tight text-brand-primary">
                  Añade un anticipo
                </h2>
                <p className="mt-4 leading-relaxed text-gray-500">
                  En {restaurantName} puedes dejar un anticipo para tu reserva. Se descontará de tu consumo al visitarnos.
                </p>
                <div className="mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-brand-secondary/60 p-4">
                  <span className="text-sm font-medium text-gray-600">Anticipo opcional</span>
                  <span className="font-serif text-2xl font-medium text-brand-primary">${deposit} MXN</span>
                </div>
                <div className="mt-7 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('card')}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-3.5 text-sm font-medium text-white shadow-lg shadow-gray-300/40 transition-all hover:-translate-y-0.5 hover:bg-brand-primary/90"
                  >
                    Pagar anticipo
                    <CreditCard className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => completePayment(false)}
                    className="rounded-full px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-brand-primary"
                  >
                    Reservar sin anticipo
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handlePayment}>
                <button
                  type="button"
                  onClick={() => setStep('offer')}
                  disabled={isProcessing}
                  className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-brand-primary disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </button>
                <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-gray-500">PAGO SEGURO · SIMULACIÓN</p>
                <h2 id="payment-title" className="font-serif text-3xl font-medium tracking-tight text-brand-primary">
                  Datos de pago
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  No se realizará ningún cargo real. Esta pantalla simula la pasarela de pago.
                </p>

                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-brand-primary">Número de tarjeta</span>
                    <span className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition-all focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-100">
                      <CreditCard className="h-5 w-5 shrink-0 text-gray-400" />
                      <input required inputMode="numeric" autoComplete="cc-number" placeholder="1234 1234 1234 1234" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-400" />
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-brand-primary">Vencimiento</span>
                      <input required inputMode="numeric" autoComplete="cc-exp" placeholder="MM / AA" className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-gray-400 focus:ring-4 focus:ring-gray-100" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-brand-primary">CVV</span>
                      <input required inputMode="numeric" autoComplete="cc-csc" placeholder="123" className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-gray-400 focus:ring-4 focus:ring-gray-100" />
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={isProcessing} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-3.5 text-sm font-medium text-white shadow-lg shadow-gray-300/40 transition-all hover:-translate-y-0.5 hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-70">
                  {isProcessing ? (
                    <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Procesando…</>
                  ) : (
                    <><LockKeyhole className="h-4 w-4" />Pagar ${deposit} MXN</>
                  )}
                </button>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Datos protegidos en esta simulación
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
