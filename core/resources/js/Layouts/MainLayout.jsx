import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import { Player } from '@lottiefiles/react-lottie-player';
import { router, usePage } from '@inertiajs/react';

export default function MainLayout({ children }) {
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        const removeStart = router.on('start', () => setLoading(true));
        const removeFinish = router.on('finish', () => setLoading(false));

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (

        <>
            <button
                onClick={toggleDarkMode}
                className="btn btn-lg-square position-fixed top-0 end-0 m-3"
                style={{ zIndex: 100, background: 'transparent', border: 'none', color: 'var(--text-muted)' }}
            >
                {darkMode ? (
                    <span className="material-symbols-outlined" style={{ fontSize: '1.65rem' }}>light_mode</span>
                ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: '1.65rem' }}>dark_mode</span>
                )}
            </button>

            <div className="container-xxl position-relative d-flex p-0" style={{ background: 'var(--light)' }}>
                <div id="loading-screen" className={loading ? '' : 'hidden'}>
                    <Player
                        autoplay
                        loop
                        src={darkMode ? "/lottie/Scene-2.json" : "/lottie/Scene-1.json"}
                        style={{ height: '110px', width: '110px' }}
                    />
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    className="btn btn-lg-square d-lg-none position-fixed top-0 start-0 m-3"
                    onClick={toggleSidebar}
                    style={{ zIndex: 1000, background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem' }}
                >
                    <i className="fa fa-bars"></i>
                </button>

                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 }}
                        onClick={toggleSidebar}
                    ></div>
                )}

                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} darkMode={darkMode} />



                <div className={`content position-relative ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="container-fluid pt-4 px-4">
                        {children}
                    </div>

                    {url === '/dashboard' && <Footer />}
                </div>
            </div>
        </>
    );
}
