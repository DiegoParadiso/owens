import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, useForm } from '@inertiajs/react';

export default function Connect() {
    const [showDrawer, setShowDrawer] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: '',
    });

    const submit = (e) => {
        e.preventDefault();
        setShowDrawer(false); // Hide immediately per user request

        post(route('whatsapp.storeToken'), {
            onSuccess: () => {
                reset();
                if (window.toast) {
                    window.toast.success('Conectado', 'WhatsApp se ha conectado correctamente.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.error('Error', 'No se pudo conectar. Verifica el token e intenta nuevamente.');
                }
                // Optionally re-open if critical, but user requested hiding.
                // setShowDrawer(true); 
            }
        });
    };

    return (
        <MainLayout>
            <Head title="Conectar WhatsApp" />

            <div className="container-fluid pt-4 px-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center" style={{ maxWidth: '800px' }}>
                        <h4 className="pb-3">Conectar WhatsApp Business</h4>
                        <div className="card-minimal mb-4 text-start bg-light border-0">
                            <div className="">
                                <h6 className="fw-bold mb-2 small text-uppercase text-muted">Cómo funciona:</h6>
                                <ol className="mb-0 ps-3 small text-muted">
                                    <li className="mb-1">Crea tu cuenta de WhatsApp Business API (Meta, Twilio, 360dialog, etc.)</li>
                                    <li className="mb-1">Obtén tu Token de Acceso o API Key</li>
                                    <li>Pégalo en el campo correspondiente</li>
                                </ol>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary rounded-pill fw-medium"
                            onClick={() => setShowDrawer(true)}
                        >
                            <i className="bi bi-link-45deg me-2"></i>Conectar Cuenta
                        </button>
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                title="Conectar WhatsApp"
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={() => setShowDrawer(false)}>Cancelar</button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={submit}
                            disabled={processing}
                        >
                            {processing ? 'Conectando...' : 'Guardar y Conectar'}
                        </button>
                    </>
                }
            >
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label htmlFor="token" className="form-label fw-semibold">Token / API Key</label>
                        <div className="input-group border rounded" style={{ borderColor: 'var(--border-color)', overflow: 'hidden' }}>
                            <span className="input-group-text bg-white border-0">
                                <i className="bi bi-key text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 ps-0 shadow-none bg-transparent"
                                id="token"
                                placeholder="Pegá tu token acá..."
                                value={data.token}
                                onChange={(e) => setData('token', e.target.value)}
                                required
                                autoFocus
                                style={{ boxShadow: 'none', border: 'none', outline: 'none' }}
                            />
                        </div>
                        {errors.token && <div className="text-danger small mt-1">{errors.token}</div>}
                        <div className="form-text mt-2">
                            <i className="bi bi-shield-lock me-1"></i>
                            Tu token se guardará de forma segura.
                        </div>
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
