import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import '../../css/landing.css';

export default function Landing() {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

    useEffect(() => {
        document.body.classList.add('landing-page');

        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        localStorage.setItem('darkMode', darkMode);

        // Set diagonal text background
        const setDiagonalBackground = () => {
            const textColor = darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.025)';
            const svgString = `<svg id="diagtext" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%">
                <style type="text/css">
                    text { fill: ${textColor}; font-family: Inter, Poppins, Arial, sans-serif; font-weight: 600; }
                </style>
                <defs>
                    <pattern id="owenspattern" patternUnits="userSpaceOnUse" width="400" height="200">
                        <text y="80" font-size="48" id="owenstext">@owens.arg</text>
                    </pattern>
                    <pattern id="combo" xlink:href="#owenspattern" patternTransform="rotate(-45)">
                        <use xlink:href="#owenstext" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#combo)" />
            </svg>`;
            document.body.style.backgroundImage = `url('data:image/svg+xml;base64,${window.btoa(svgString)}')`;
        };

        setDiagonalBackground();

        // Load Inter Font
        const interFont = document.createElement('link');
        interFont.rel = 'stylesheet';
        interFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        document.head.appendChild(interFont);

        // Load FontAwesome
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css';
        document.head.appendChild(faLink);

        // Load Material Symbols
        const msLink = document.createElement('link');
        msLink.rel = 'stylesheet';
        msLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=explore_nearby';
        document.head.appendChild(msLink);

        return () => {
            document.body.classList.remove('landing-page');
            document.body.classList.remove('dark-mode');
            document.body.style.backgroundImage = '';
            document.head.removeChild(interFont);
            document.head.removeChild(faLink);
            document.head.removeChild(msLink);
        };
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className="landing-frame">
            <Head title="Owens Argentina" />

            {/* Dark Mode Toggle Button */}
            <button
                className="theme-toggle-btn"
                onClick={toggleDarkMode}
                aria-label="Toggle Dark Mode"
            >
                {darkMode ? (
                    <i className="fas fa-sun"></i>
                ) : (
                    <i className="fas fa-moon"></i>
                )}
            </button>

            {/* Vertical Centered Layout */}
            <div className="landing-container">

                {/* Logo and Header */}
                <section className="header-section">
                    <div className="header__logo">
                        <img
                            src="/img/owens.png"
                            alt="Owens Logo"
                            style={{ height: '70px', width: 'auto' }}
                        />
                    </div>
                </section>

                {/* Action Buttons Grid */}
                <div className="services-grid">
                    {/* Card 1: Ubicación */}
                    <a href="https://maps.google.com/?q=-27.394635,-55.9289364" target="_blank" rel="noreferrer" className="single-service">
                        <div className="service-content">
                            <span className="material-symbols-outlined">explore_nearby</span>
                            <div className="text-content">
                                <h3 className="title">Ubicación</h3>
                                <p className="subtitle">Av Andresito y Semilla</p>
                            </div>
                        </div>
                        <div className="action-arrow">
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </a>

                    {/* Card 2: WhatsApp */}
                    <a href="https://wa.me/5493765365090" target="_blank" rel="noreferrer" className="single-service">
                        <div className="service-content">
                            <img src="/img/whatsapp-icon.svg" alt="WhatsApp" style={{ width: '28px', height: '28px' }} />
                            <div className="text-content">
                                <h3 className="title">WhatsApp</h3>
                                <p className="subtitle">3765-365090</p>
                            </div>
                        </div>
                        <div className="action-arrow">
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </a>

                    {/* Card 3: Hacé tu pedido */}
                    <a href="/hacer-pedido" className="single-service">
                        <div className="service-content">
                            <i className="fas fa-shopping-bag"></i>
                            <div className="text-content">
                                <h3 className="title">Hacé tu pedido</h3>
                                <p className="subtitle">Pedir Online</p>
                            </div>
                        </div>
                        <div className="action-arrow">
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </a>
                </div>

                {/* Map */}
                <div className="map-side">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1576.4947938367466!2d-55.9289364!3d-27.394635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjfCsDIzJzQwLjciUyA1NcKwNTUnNDQuMiJX!5e0!3m2!1ses-419!2sar!4v1714588938977!5m2!1ses-419!2sar"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

            </div>
        </div>
    );
}
