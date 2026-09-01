import { createContext, useCallback, useContext, useRef, useState } from "react";
import "../../styles/toast.css";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const removeToast = useCallback((id) => {
        setToasts((current) => current.filter((t) => t.id !== id));
        clearTimeout(timers.current[id]);
        delete timers.current[id];
    }, []);

    const showToast = useCallback((message, type = "info", duration = 3500) => {
        const id = ++idCounter;
        setToasts((current) => [...current, { id, message, type }]);
        timers.current[id] = setTimeout(() => removeToast(id), duration);
        return id;
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-stack" role="status" aria-live="polite">
                {toasts.map((t) => (
                    <div key={t.id} className={`toast-item toast-${t.type}`} onClick={() => removeToast(t.id)}>
                        <span className="toast-icon">
                            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
                        </span>
                        <span className="toast-message">{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        // fallback בטוח למקרה נדיר של שימוש מחוץ ל-Provider, כדי לא להפיל את האתר
        return { showToast: (msg) => window.alert(msg) };
    }
    return ctx;
}
