@extends('auth.template.master')
@section('content')

    <body>
        <div class="container-xxl position-relative bg-white d-flex p-0">



            <!-- Sign In Start -->
            <div class="container-fluid">
                <div class="row h-100 align-items-center justify-content-center" style="min-height: 100vh; background-color: #fff;">
                    <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                        <div class="p-4">
                            <div class="d-flex flex-column align-items-center justify-content-center mb-5">
                                <a href="/" class="text-center mb-4">
                                    <img src="{{ asset('img/owens.png') }}" alt="Owen's Logo" style="height: 80px;">
                                </a>
                            </div>
                            

                            @session('error')
                                <div class="alert alert-danger border-0 rounded-0">
                                    {{ session('error') }}
                                </div>
                            @endsession

                            <form action="{{ route('login.check') }}" method="POST">
                                @csrf
                                <div class="mb-4">
                                    <label for="email" class="form-label text-muted small text-uppercase" style="letter-spacing: 0.5px;">Correo Electrónico</label>
                                    <input type="email" class="form-control border-0 border-bottom rounded-0 px-0 shadow-none" id="email"
                                        name="email" style="background: transparent;">
                                </div>
                                <div class="mb-5">
                                    <label for="password" class="form-label text-muted small text-uppercase" style="letter-spacing: 0.5px;">Contraseña</label>
                                    <input type="password" class="form-control border-0 border-bottom rounded-0 px-0 shadow-none" id="password" 
                                        name="password" style="background: transparent;">
                                </div>
                                <button type="submit" class="btn btn-primary py-3 w-100 rounded-0 text-uppercase" style="letter-spacing: 2px; font-weight: 500;">Ingresar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Sign In End -->
        </div>

        <style>
            /* Custom Minimalist Styles for Login */
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
        </style>
    @endsection
