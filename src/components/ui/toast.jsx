import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, XCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const toastTypes = {
  success: {
    icon: CheckCircle,
    className: "border-green-400/30 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-100",
    iconClassName: "text-green-400",
    glowColor: "shadow-green-500/25"
  },
  error: {
    icon: XCircle,
    className: "border-red-400/30 bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-100",
    iconClassName: "text-red-400",
    glowColor: "shadow-red-500/25"
  },
  warning: {
    icon: AlertCircle,
    className: "border-yellow-400/30 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-100",
    iconClassName: "text-yellow-400",
    glowColor: "shadow-yellow-500/25"
  },
  info: {
    icon: Info,
    className: "border-blue-400/30 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-100",
    iconClassName: "text-blue-400",
    glowColor: "shadow-blue-500/25"
  }
};

const Toast = ({ message, type = "info", duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const toastConfig = toastTypes[type];
  const IconComponent = toastConfig.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative flex items-start gap-4 rounded-2xl border p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 ease-out min-w-[320px] max-w-[480px]",
        toastConfig.className,
        toastConfig.glowColor,
        isExiting 
          ? "translate-x-full opacity-0 scale-95" 
          : "translate-x-0 opacity-100 scale-100"
      )}
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-white/10"></div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 rounded-full blur-sm animate-pulse"></div>
      
      {/* Icon with enhanced styling */}
      <div className="relative flex-shrink-0">
        <div className={cn(
          "p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20",
          toastConfig.iconClassName.replace('text-', 'bg-').replace('-400', '-500/20')
        )}>
          <IconComponent className={cn("h-5 w-5", toastConfig.iconClassName)} />
        </div>
        {/* Glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-xl blur-md opacity-50",
          toastConfig.iconClassName.replace('text-', 'bg-').replace('-400', '-500/30')
        )}></div>
      </div>
      
      {/* Message content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-relaxed break-words">
          {message}
        </p>
      </div>
      
      {/* Close button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/20 transition-all duration-200 group"
      >
        <X className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
      </button>
    </div>
  );
};

export { Toast };

