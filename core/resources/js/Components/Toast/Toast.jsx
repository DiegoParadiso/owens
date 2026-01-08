import React, { useEffect, useState } from 'react';

const Toast = ({ id, type, title, message, duration, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {

        const enterTimer = setTimeout(() => {
            setIsVisible(true);
        }, 100);


        let dismissTimer;
        if (duration) {
            dismissTimer = setTimeout(() => {
                handleClose();
            }, duration);
        }

        return () => {
            clearTimeout(enterTimer);
            if (dismissTimer) clearTimeout(dismissTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);

        setTimeout(() => {
            onClose(id);
        }, 500);
    };

    const styles = {
        success: {
            bg: 'bg-[#2ecc71]',
            icon: 'check_circle',
            title: 'Success!',
        },
        error: {
            bg: 'bg-[#e74c3c]',
            icon: 'cancel',
            title: 'Error!',
        },
        info: {
            bg: 'bg-[#3498db]',
            icon: 'info',
            title: 'Info!',
        },
        warning: {
            bg: 'bg-[#f1c40f]',
            icon: 'info',
            title: 'Warning!',
        },
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <div
            style={{
                position: 'relative',
                minWidth: '350px',
                width: 'fit-content',
                maxWidth: '90vw',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                color: '#FFFFFF',
                overflow: 'hidden',
                transition: 'all 0.5s ease-in-out',
                transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
                opacity: isVisible ? 1 : 0,
                backgroundColor: type === 'success' ? '#27ae60' : type === 'error' ? '#EF4444' : type === 'info' ? '#3B82F6' : '#F59E0B',
                marginBottom: '12px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
            role="alert"
        >

            <div style={{
                position: 'absolute',
                left: '-16px',
                top: '-16px',
                width: '80px',
                height: '80px',
                backgroundColor: 'white',
                opacity: 0.2,
                borderRadius: '50%'
            }}></div>

            <button
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    color: 'white',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 10 }}>
                <div style={{
                    flexShrink: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    marginTop: '2px'
                }}>
                    {type === 'success' && (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </svg>
                    )}
                    {type === 'error' && (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                    )}
                    {(type === 'info' || type === 'warning') && (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                            <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                        </svg>
                    )}
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: '500', fontSize: '16px', lineHeight: '1.4', marginBottom: '2px', margin: 0, color: '#FFFFFF' }}>{title || currentStyle.title}</h4>
                    <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.4', margin: 0, color: '#FFFFFF', whiteSpace: 'nowrap' }}>{message}</p>
                </div>
            </div>


        </div>
    );
};

export default Toast;
