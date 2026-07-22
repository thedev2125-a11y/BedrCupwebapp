import { createContext, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = 'success') => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const success = useCallback((message) => push(message, 'success'), [push]);
  const error = useCallback((message) => push(message, 'error'), [push]);

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      {createPortal(
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[100] flex flex-col gap-2 w-[calc(100%-3rem)] sm:w-auto max-w-sm">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-3 shadow-[var(--shadow-card-hover)] text-sm font-medium ${
                  t.type === 'success'
                    ? 'bg-emerald-600 text-chalk-50'
                    : 'bg-red-600 text-chalk-50'
                }`}
              >
                {t.type === 'success' ? <CheckCircle2 size={17} className="shrink-0" /> : <XCircle size={17} className="shrink-0" />}
                <span className="flex-1">{t.message}</span>
                <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-80 hover:opacity-100">
                  <X size={15} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
