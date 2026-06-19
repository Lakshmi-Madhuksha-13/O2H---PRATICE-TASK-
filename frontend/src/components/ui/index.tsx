import React, { createContext, useContext, useState, useEffect } from 'react';
import { LucideIcon, X } from 'lucide-react';

// ==========================================
// 1. BUTTON COMPONENT
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 focus:ring-indigo-500 dark:focus:ring-offset-slate-900',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 focus:ring-slate-500',
    outline: 'bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 focus:ring-slate-500',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 focus:ring-rose-500',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

// ==========================================
// 2. INPUT & LABEL COMPONENTS
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>}
      <input
        className={`w-full px-3 py-2 text-sm bg-slate-900 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
          error ? 'border-rose-500 ring-rose-500/20' : 'border-slate-800 focus:ring-indigo-500'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
};

// ==========================================
// 3. BADGE COMPONENT
// ==========================================
interface BadgeProps {
  type: 'status' | 'priority' | 'generic';
  value: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, value }) => {
  const getColors = () => {
    if (type === 'status') {
      switch (value) {
        case 'Completed':
          return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        case 'In Progress':
          return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
        default:
          return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'; // Pending
      }
    }
    if (type === 'priority') {
      switch (value) {
        case 'High':
          return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
        case 'Medium':
          return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
        default:
          return 'bg-slate-500/10 text-slate-400 border border-slate-500/20'; // Low
      }
    }
    return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tracking-wide ${getColors()}`}>
      {value}
    </span>
  );
};

// ==========================================
// 4. CARD COMPONENT
// ==========================================
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`glass rounded-xl shadow-lg border border-slate-800 p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-slate-100 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`text-slate-300 text-sm ${className}`} {...props}>
    {children}
  </div>
);

// ==========================================
// 5. TOAST NOTIFICATION SYSTEM
// ==========================================
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Render Node */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const bgColors = {
            success: 'bg-emerald-950 border-emerald-800 text-emerald-200 shadow-emerald-950/20',
            error: 'bg-rose-950 border-rose-800 text-rose-200 shadow-rose-950/20',
            info: 'bg-slate-900 border-slate-700 text-slate-200 shadow-slate-950/20',
          };

          const barColors = {
            success: 'bg-emerald-500',
            error: 'bg-rose-500',
            info: 'bg-indigo-500',
          };

          return (
            <ToastItem
              key={t.id}
              toast={t}
              bgColor={bgColors[t.type]}
              barColor={barColors[t.type]}
              onClose={() => removeToast(t.id)}
            />
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{
  toast: Toast;
  bgColor: string;
  barColor: string;
  onClose: () => void;
}> = ({ toast, bgColor, barColor, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`flex items-center justify-between p-3.5 rounded-lg border shadow-xl pointer-events-auto transition-all duration-300 animate-slide-in ${bgColor}`}>
      <span className="text-sm font-medium pr-4">{toast.message}</span>
      <button onClick={onClose} className="p-0.5 hover:bg-white/10 rounded transition-colors text-current">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ==========================================
// 6. DIALOG COMPONENT (MODAL)
// ==========================================
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Dialog content box */}
      <div className="relative glass border border-slate-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col text-left z-10 animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
