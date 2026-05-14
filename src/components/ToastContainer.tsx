import { X } from "lucide-react";
import { memo, useEffect, useState, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeToast, selectToasts } from "../store/UiSlice";

const typeStyles: Record<string, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

const ToastContainer = memo(function ToastContainer() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);

  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  const scheduleRemoval = useCallback(
    (id: string) => {
      setExitingIds((prev) => new Set(prev).add(id));
      setTimeout(() => {
        dispatch(removeToast(id));
        setExitingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 400);
    },
    [dispatch],
  );

  useEffect(() => {
    if (toasts.length === 0) return;
    const newToasts = toasts.filter((t) => !exitingIds.has(t.id));
    newToasts.forEach((toast) => {
      const timer = setTimeout(() => scheduleRemoval(toast.id), 5000);
      return () => clearTimeout(timer);
    });
  }, [toasts, exitingIds, scheduleRemoval]);

  return (
    <div className="pointer-events-none fixed top-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-white shadow-lg pointer-events-auto ${
            typeStyles[toast.type]
          } ${exitingIds.has(toast.id) ? "animate-fade-out" : "animate-fade-in"}`}
        >
          <span className="text-sm">{toast.message}</span>
          <button
            onClick={() => scheduleRemoval(toast.id)}
            className="ml-2 hover:text-gray-200"
            aria-label="Fechar notificação"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
});

export default ToastContainer;
