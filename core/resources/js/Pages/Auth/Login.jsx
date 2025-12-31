import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Player } from '@lottiefiles/react-lottie-player';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const [showLoader, setShowLoader] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const submit = (e) => {
        e.preventDefault();
        setShowLoader(true);
        post(route('login.check'), {
            onFinish: () => setShowLoader(false),
            onError: () => setShowLoader(false),
        });
    };

    return (
        <div className="container-fluid position-relative bg-white d-flex p-0 w-100" style={{ minHeight: '100vh' }}>
            <Head title="Login" />

            {/* Dark Mode Toggle */}
            <button
                onClick={toggleDarkMode}
                className="btn btn-lg-square position-fixed top-0 end-0 m-3"
                style={{ zIndex: 9999, background: 'transparent', border: 'none', color: 'var(--text-muted)' }}
            >
                {darkMode ? (
                    <i className="bi bi-sun" style={{ fontSize: '1.3rem' }}></i>
                ) : (
                    <i className="bi bi-moon" style={{ fontSize: '1.3rem' }}></i>
                )}
            </button>

            {showLoader && (
                <div id="loading-screen" className="loader-full-screen">
                    <Player
                        autoplay
                        loop
                        src="/lottie/Scene-1.json"
                        style={{ height: '150px', width: '150px' }}
                    />
                </div>
            )}

            {/* Sign In Start */}
            <div className="container-fluid position-relative">
                <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                    <div className="col-12 col-sm-8 col-md-5 col-lg-4 col-xl-3">
                        <div className="p-4">
                            <div className="d-flex flex-column align-items-center justify-content-center mb-4">
                                <a href="/" className="text-center mb-3">
                                    <img
                                        id="loginLogo"
                                        src={darkMode ? "/img/owens-darkmode.png" : "/img/owens.png"}
                                        alt="Owen's Logo"
                                        style={{ height: '70px' }}
                                    />
                                </a>
                            </div>

                            <form onSubmit={submit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label text-muted">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className={`form-control border-0 border-bottom rounded-0 px-0 shadow-none form-control-sm ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        style={{ background: 'transparent' }}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label text-muted">Contraseña</label>
                                    <div className="input-group border-bottom">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className={`form-control border-0 rounded-0 px-0 shadow-none form-control-sm ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            style={{ background: 'transparent' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="btn btn-sm text-muted border-0 bg-transparent shadow-none pe-0"
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: '1.1rem' }}></i>
                                        </button>
                                    </div>
                                    {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary py-2 w-100 rounded-0 text-uppercase btn-sm d-flex align-items-center justify-content-center gap-2"
                                    style={{ letterSpacing: '1.5px', fontWeight: '500' }}
                                    disabled={processing}
                                >
                                    <span className="btn-text">Ingresar</span>
                                    {processing && (
                                        <div className="spinner-border spinner-border-sm text-white" role="status" style={{ width: '1rem', height: '1rem', borderWidth: '0.15em' }}></div>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .form-control:focus {
                    border-color: #df0f13 !important;
                    box-shadow: none !important;
                }
                .form-control::placeholder {
                    color: #adb5bd;
                    opacity: 0.5;
                }
                .btn-primary {
                    background-color: #df0f13;
                    border-color: #df0f13;
                    transition: all 0.3s ease;
                }
                .btn-primary:hover {
                    background-color: #b90c10;
                    border-color: #b90c10;
                    letter-spacing: 3px;
                }

                /* Dark Mode Button Hover - Brighter/Vibrant */
                body.dark-mode .btn-primary:hover {
                    background-color: #FF5A5F !important;
                    border-color: #FF5A5F !important;
                }
                
                /* Dark Mode Input Border Fix */
                body.dark-mode .form-control {
                    color: #fff !important;
                    border-bottom-color: #2c3038 !important;
                }
                body.dark-mode .input-group {
                    border-bottom-color: #2c3038 !important;
                }
                /* Focus state needs to target the parent input-group now */
                .form-control:focus {
                    box-shadow: none !important;
                }
                
                .input-group:focus-within {
                    border-color: #df0f13 !important;
                }
                body.dark-mode .input-group:focus-within {
                    border-color: #FF5A5F !important;
                }

                /* Remove Autofill Yellow Background */
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #fff inset !important;
                    -webkit-text-fill-color: #000 !important;
                    transition: background-color 5000s ease-in-out 0s;
                }

                body.dark-mode input:-webkit-autofill,
                body.dark-mode input:-webkit-autofill:hover, 
                body.dark-mode input:-webkit-autofill:focus, 
                body.dark-mode input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #191C24 inset !important; /* Match dark card bg */
                    -webkit-text-fill-color: #fff !important;
                }
            `}</style>
        </div >
    );
}
