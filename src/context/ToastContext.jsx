import { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "@/components/ui/toast";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = "info", duration = 5000 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return addToast({ message, type: "success", duration });
  }, [addToast]);

  const showError = useCallback((message, duration) => {
    return addToast({ message, type: "error", duration });
  }, [addToast]);

  const showWarning = useCallback((message, duration) => {
    return addToast({ message, type: "warning", duration });
  }, [addToast]);

  const showInfo = useCallback((message, duration) => {
    return addToast({ message, type: "info", duration });
  }, [addToast]);

  const success = useCallback((title, message, duration) => {
    return addToast({ message: `${title}: ${message}`, type: "success", duration });
  }, [addToast]);

  const error = useCallback((title, message, duration) => {
    return addToast({ message: `${title}: ${message}`, type: "error", duration });
  }, [addToast]);

  const successWithUser = useCallback((message, userName, description, duration) => {
    const formattedMessage = message.replace('{userName}', userName);
    return addToast({ message: `${formattedMessage} ${description}`, type: "success", duration });
  }, [addToast]);

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    success,
    error,
    successWithUser
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] space-y-3 max-w-md">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="transform transition-all duration-300 ease-out"
            style={{
              transform: `translateY(${index * 8}px)`,
              zIndex: 9999 - index
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

