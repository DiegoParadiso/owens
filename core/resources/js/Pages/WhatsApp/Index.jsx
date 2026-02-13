import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

export default function Index({ conversations = [], messages = [] }) {
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [activeMessages, setActiveMessages] = useState([]);

    useEffect(() => {
        if (selectedNumber) {
            setActiveMessages(messages.filter(m => m.from_number === selectedNumber));
        }
    }, [selectedNumber, messages]);

    const handleSelectConversation = (number) => {
        setSelectedNumber(number);
    };

    return (
        <MainLayout>
            <Head title="Canal WhatsApp" />

            {/* Main Container - Absolute positioning to fill .content exactly */}
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column overflow-hidden bg-body">

                <div className="row g-0 flex-fill h-100">

                    {/* Sidebar: Conversations List */}
                    <div className="col-md-4 col-lg-3 d-flex flex-column border-end border-start" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                        <div className="p-3 d-flex justify-content-between align-items-center border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-sm text-danger p-0 me-1"
                                    title="Desconectar WhatsApp"
                                    onClick={() => {
                                        Swal.fire({
                                            text: "¿Cerrar sesión de WhatsApp Business?",
                                            showCancelButton: true,
                                            confirmButtonColor: '#dc3545',
                                            cancelButtonColor: '#6c757d',
                                            confirmButtonText: 'Cerrar Sesión',
                                            cancelButtonText: 'Cancelar',
                                            buttonsStyling: true,
                                            customClass: {
                                                popup: 'swal-minimal',
                                                confirmButton: 'btn btn-danger px-4',
                                                cancelButton: 'btn btn-secondary px-4'
                                            }
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                router.post(route('whatsapp.logout'));
                                            }
                                        });
                                    }}
                                >
                                    <i className="fa fa-sign-out-alt fa-lg fa-rotate-180"></i>
                                </button>
                                <h6 className="mb-0 fw-bold small text-uppercase text-muted tracking-wide">Mensajes</h6>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-secondary-subtle text-secondary rounded-pill fw-normal icon-link" style={{ fontSize: '0.7rem' }}>
                                    {conversations.length}
                                </span>
                            </div>
                        </div>

                        <div className="overflow-auto flex-fill custom-scrollbar">
                            {conversations.length === 0 ? (
                                <div className="p-5 text-center">
                                    <div className="mb-3 rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                        <i className="bi bi-chat-text text-muted"></i>
                                    </div>
                                    <p className="small text-muted mb-0">No hay conversaciones</p>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {conversations.map((conv) => (
                                        <div
                                            key={conv.number}
                                            className={`list-group-item list-group-item-action p-3 border-0 border-bottom ${selectedNumber === conv.number ? 'bg-primary-subtle' : ''}`}
                                            onClick={() => handleSelectConversation(conv.number)}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: selectedNumber === conv.number ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent',
                                                borderColor: 'var(--border-color)'
                                            }}
                                        >
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                                                        style={{ width: '38px', height: '38px', backgroundColor: selectedNumber === conv.number ? 'var(--primary-color)' : '#adb5bd', fontSize: '0.9rem' }}>
                                                        {conv.name ? conv.name.charAt(0).toUpperCase() : <i className="bi bi-person-fill"></i>}
                                                    </div>
                                                </div>
                                                <div className="flex-fill min-w-0">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <h6 className="mb-0 text-truncate small fw-bold" style={{ color: 'var(--text-main)' }}>
                                                            {conv.name || conv.number}
                                                        </h6>
                                                        <small className="text-muted" style={{ fontSize: '0.65rem' }}>
                                                            {dayjs(conv.timestamp).format(dayjs(conv.timestamp).isSame(dayjs(), 'day') ? 'HH:mm' : 'DD/MM')}
                                                        </small>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p className="mb-0 text-truncate small text-muted w-100" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>
                                                            {conv.last_message}
                                                        </p>
                                                        {conv.unread_count > 0 && (
                                                            <span className="badge bg-success rounded-pill ms-2" style={{ fontSize: '0.6rem' }}>{conv.unread_count}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="col-md-8 col-lg-9 d-flex flex-column h-100" style={{ backgroundColor: 'var(--bg-body)' }}>
                        {selectedNumber ? (
                            <>
                                {/* Header */}
                                <div className="px-4 py-2 border-bottom d-flex justify-content-between align-items-center shadow-sm"
                                    style={{ height: '60px', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                            <i className="bi bi-person text-secondary"></i>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold small" style={{ color: 'var(--text-main)' }}>
                                                {conversations.find(c => c.number === selectedNumber)?.name || selectedNumber}
                                            </span>
                                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>WhatsApp Business</span>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" style={{ fontSize: '0.75rem' }}>
                                            <i className="bi bi-three-dots"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-fill overflow-auto p-4 d-flex flex-column gap-3 position-relative"
                                    style={{
                                        backgroundColor: 'var(--bg-body)'
                                    }}>

                                    {/* Background Pattern Overlay */}
                                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                                        backgroundImage: 'var(--chat-bg-image)',
                                        backgroundRepeat: 'repeat',
                                        backgroundSize: '200px', // Reduced size for smaller pattern
                                        opacity: '0.4', // Increased opacity as it's likely a subtle pattern
                                        pointerEvents: 'none',
                                        zIndex: 0
                                    }}></div>

                                    {activeMessages.map((msg) => (
                                        <div key={msg.id} className={`d-flex ${msg.status === 'sent' ? 'justify-content-end' : 'justify-content-start'} position-relative`} style={{ zIndex: 1 }}>
                                            <div
                                                className={`p-3 rounded-4 shadow-sm`}
                                                style={{
                                                    maxWidth: '65%',
                                                    minWidth: '100px',
                                                    backgroundColor: msg.status === 'sent' ? 'var(--wp-sent-bg)' : 'var(--bg-card)',
                                                    borderTopRightRadius: msg.status === 'sent' ? '0' : '1rem',
                                                    borderTopLeftRadius: msg.status === 'sent' ? '1rem' : '0',
                                                    borderTopLeftRadius: msg.status === 'sent' ? '1rem' : '0',
                                                    borderTopRightRadius: msg.status === 'sent' ? '0' : '1rem',
                                                    color: '#000' // Always dark text for contrast on these bubbles
                                                }}
                                            >
                                                <p className="mb-1 small" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{msg.body}</p>
                                                <div className="d-flex align-items-center justify-content-end gap-1 opacity-75" style={{ fontSize: '0.65rem' }}>
                                                    <span>{dayjs(msg.wa_timestamp).format('HH:mm')}</span>
                                                    {msg.status === 'sent' && <i className="bi bi-check2-all text-primary"></i>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="p-3 border-top" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                                    <div className="input-group">
                                        <button className="btn btn-light text-muted border-0 bg-transparent" type="button">
                                            <i className="bi bi-emoji-smile"></i>
                                        </button>
                                        <input
                                            type="text"
                                            className="form-control rounded-pill bg-light border-0 px-3 small"
                                            placeholder="Escribe un mensaje..."
                                            disabled
                                            style={{ backgroundColor: 'var(--bg-input)' }}
                                        />
                                        <button className="btn border-0 bg-transparent ms-2 p-0 d-flex align-items-center justify-content-center"
                                            style={{ width: '40px', height: '40px' }}>
                                            <i className="fa fa-paper-plane text-primary" style={{ fontSize: '1.2rem' }}></i>
                                        </button>
                                    </div>
                                    <div className="text-center mt-2">
                                        <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                                            <i className="bi bi-info-circle me-1"></i>
                                            Las respuestas estarán habilitadas próximamente.
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: 'var(--bg-card)' }}>
                                <div className="mb-4 position-relative">
                                    <div className="position-absolute top-50 start-50 translate-middle"
                                        style={{ width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(37,211,102,0.1) 0%, rgba(255,255,255,0) 70%)' }}></div>
                                    <i className="bi bi-whatsapp display-1" style={{ color: '#25D366' }}></i>
                                </div>
                                <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>WhatsApp Web</h5>
                                <p className="text-muted small mb-0">Envía y recibe mensajes sin necesidad de mantener tu teléfono conectado.</p>
                                <div className="mt-4 pt-3 border-top" style={{ width: '200px', borderColor: 'var(--border-color)' }}></div>
                                <span className="mt-3 text-muted" style={{ fontSize: '0.7rem' }}>
                                    <i className="bi bi-lock-fill me-1"></i>
                                    Cifrado de extremo a extremo
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
