import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{
            addToast,
            success: (msg, duration) => addToast(msg, 'success', duration),
            error: (msg, duration) => addToast(msg, 'error', duration),
            info: (msg, duration) => addToast(msg, 'info', duration),
            warning: (msg, duration) => addToast(msg, 'warning', duration),
        }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}>
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ toast, onClose }) => {
    const bgColors = {
        success: '#f0fdf4',
        error: '#fef2f2',
        info: '#eff6ff',
        warning: '#fffbeb',
    };

    const textColors = {
        success: '#15803d',
        error: '#b91c1c',
        info: '#1d4ed8',
        warning: '#b45309',
    };

    const borderColors = {
        success: '#bbf7d0',
        error: '#fecaca',
        info: '#bfdbfe',
        warning: '#fde68a',
    };

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle',
    };

    return (
        <div style={{
            minWidth: '300px',
            maxWidth: '400px',
            backgroundColor: bgColors[toast.type] || 'white',
            color: textColors[toast.type] || '#333',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: `1px solid ${borderColors[toast.type] || '#eee'}`,
            display: 'flex',
            alignItems: 'start',
            gap: '12px',
            animation: 'slideIn 0.3s ease-out',
        }}>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
            <i className={`fas ${icons[toast.type] || 'fa-info-circle'}`} style={{ marginTop: '2px', fontSize: '1.1rem' }}></i>
            <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: '500' }}>
                {toast.message}
            </div>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: textColors[toast.type],
                    cursor: 'pointer',
                    opacity: 0.7,
                }}
            >
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};
