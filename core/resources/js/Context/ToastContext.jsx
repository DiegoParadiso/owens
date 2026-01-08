import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Toast from '../Components/Toast/Toast';

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

    const showToast = useCallback((type, title, message, duration = 5000) => {
        const id = Date.now().toString();
        setToasts((prevToasts) => [...prevToasts, { id, type, title, message, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    useEffect(() => {
        window.toast = {
            show: showToast,
            success: (title, message) => showToast('success', title, message),
            error: (title, message) => showToast('error', title, message),
            info: (title, message) => showToast('info', title, message),
            warning: (title, message) => showToast('warning', title, message),
        };
        return () => {
            delete window.toast;
        };
    }, [showToast]);


    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            {createPortal(
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        pointerEvents: 'none'
                    }}
                >
                    {toasts.map((toast) => (
                        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
                            <Toast
                                id={toast.id}
                                type={toast.type}
                                title={toast.title}
                                message={toast.message}
                                duration={toast.duration}
                                onClose={() => removeToast(toast.id)}
                            />
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};
