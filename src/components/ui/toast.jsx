import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const toastTypes = {
  success: {
    icon: CheckCircle,
    className: "border-green-500/20 bg-green-500/10 text-green-600",
    iconClassName: "text-green-500"
  },
  error: {
    icon: XCircle,
    className: "border-red-500/20 bg-red-500/10 text-red-600",
    iconClassName: "text-red-500"
  },
  warning: {
    icon: AlertCircle,
    className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-600",
    iconClassName: "text-yellow-500"
  },
  info: {
    icon: Info,
    className: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    iconClassName: "text-blue-500"
  }
};

const Toast = ({ message, type = "info", duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const toastConfig = toastTypes[type];
  const IconComponent = toastConfig.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-300",
        toastConfig.className,
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <IconComponent className={cn("h-5 w-5 flex-shrink-0", toastConfig.iconClassName)} />
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-auto flex-shrink-0 rounded-md p-1 hover:bg-white/20 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export { Toast };

