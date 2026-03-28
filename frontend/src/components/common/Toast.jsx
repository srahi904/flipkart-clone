import { useEffect } from 'react';
import { CircleCheckBig, CircleX, Info, TriangleAlert } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '@/store/slices/uiSlice';

const icons = {
  success: CircleCheckBig,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
};

function Toast() {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.toasts);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => dispatch(removeToast(toast.id)), 3500),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [dispatch, toasts]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = icons[toast.variant] || Info;

        return (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.4)]"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-full bg-slate-100 p-2 text-[var(--brand-blue)]">
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{toast.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;
