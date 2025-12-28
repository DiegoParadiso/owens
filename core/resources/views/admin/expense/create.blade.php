@extends('admin.template.master')

@section('content')
    <div class="container-fluid pt-4 px-4">
        <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
            aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Dashboard</a></li>
                <li class="breadcrumb-item"><a href="{{ route('expense.index') }}">{{ $title }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ $subtitle }}</li>
            </ol>
        </nav>
        <div class="row vh-100 mx-0">
            <div class="col-12">
                <div class="bg-white rounded h-100 p-4">
                    <h6 class="mb-4">{{ $title }}</h6>
                    <div class="col-sm-12 col-xl-6">
                        <div class="h-100 p-4">
                            @if ($errors->any())
                                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    <ul class="mb-0">
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"
                                        aria-label="Close"></button>
                                </div>
                            @endif
                            <form action="{{ route('expense.store') }}" method="POST">
                                @csrf
                                <div class="mb-3">
                                    <label for="" class="form-label">Descripción</label>
                                    <input type="text" name="description" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label for="" class="form-label">Monto</label>
                                    <input type="number" name="amount" class="form-control" min="0" required>
                                </div>
                                <div class="mb-3">
                                    <label for="" class="form-label">Tipo de Gasto</label>
                                    <select name="type" class="form-select" required>
                                        <option value="fixed">Fijo</option>
                                        <option value="variable">Variable</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="" class="form-label">Fecha</label>
                                    <input type="date" name="date" class="form-control" value="{{ date('Y-m-d') }}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="" class="form-label">Método de Pago</label>
                                    <select name="payment_method" class="form-select" required>
                                        <option value="cash">Caja (Se descontará del saldo actual)</option>
                                        <option value="external">Externo (Banco, Tarjeta, etc.)</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary">Registrar Gasto</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
