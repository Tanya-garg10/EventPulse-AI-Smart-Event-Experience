import React from 'react';
import { CheckCircle2, AlertTriangle, Flame, Info, X } from 'lucide-react';
import { useEvent, ToastMessage } from '../../context/EventContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useEvent();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
              isError
                ? 'bg-rose-950/90 border-rose-600 text-rose-100'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500 text-amber-100'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-100'
                : 'bg-slate-900/95 border-slate-700 text-slate-100'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isError && <Flame className="w-5 h-5 text-rose-400 animate-bounce" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {!isError && !isWarning && !isSuccess && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-xs tracking-wide">{toast.title}</p>
                <span className="text-[10px] opacity-70 font-mono ml-2">{toast.timestamp}</span>
              </div>
              {toast.description && (
                <p className="text-[11px] opacity-90 mt-0.5 leading-snug line-clamp-2">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 opacity-70 hover:opacity-100 transition-opacity rounded"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
