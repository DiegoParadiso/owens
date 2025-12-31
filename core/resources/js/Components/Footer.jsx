import React from 'react';

export default function Footer() {
    return (
        <div className="container-fluid pt-4 px-4">
            <div className="bg-white rounded-top p-4">
                <div className="row">
                    <div className="col-12 col-sm-6 text-center text-sm-start">
                        <small className="text-muted">&copy; <a href="https://www.instagram.com/owens.arg/" target="_blank" rel="noopener noreferrer">OWEN'S Argentina</a> Todos los derechos reservados.</small>
                    </div>
                    <div className="col-12 col-sm-6 text-center text-sm-end">
                        <small className="text-muted">Diseñado por Paradiso</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
