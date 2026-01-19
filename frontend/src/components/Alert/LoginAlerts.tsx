import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning';

interface LoginAlertsProps {
  type: AlertType;
  message: string;
  onClose: () => void;
}

export const LoginAlerts: React.FC<LoginAlertsProps> = ({ type, message, onClose }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-900/20 border-green-500/30',
          icon: <CheckCircle className="text-green-400" size={24} />,
          text: 'text-green-100',
          title: 'Registration Successful',
          titleColor: 'text-green-400'
        };
      case 'error':
        return {
          bg: 'bg-red-900/20 border-red-500/30',
          icon: <XCircle className="text-red-400" size={24} />,
          text: 'text-red-100',
          title: 'Authentication Failed',
          titleColor: 'text-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-amber-900/20 border-amber-500/30',
          icon: <AlertCircle className="text-amber-400" size={24} />,
          text: 'text-amber-100',
          title: 'Validation Error',
          titleColor: 'text-amber-400'
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`relative max-w-md w-full mx-4 p-6 border ${styles.bg} rounded-sm shadow-2xl animate-slide-up`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/50 hover:text-cream transition-colors"
        >
          <X size={20} />
        </button>

        {/* Alert Content */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            {styles.icon}
          </div>
          <div className="flex-1">
            <h3 className={`font-serif text-xl mb-2 ${styles.titleColor}`}>
              {styles.title}
            </h3>
            <p className={`text-sm ${styles.text} leading-relaxed`}>
              {message}
            </p>
            
            {type === 'success' && (
              <p className="text-xs text-cream/50 mt-3">
                Redirecting to dashboard...
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2 text-xs uppercase tracking-widest font-bold transition-all ${
              type === 'success'
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : type === 'error'
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {type === 'success' ? 'Continue' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};
