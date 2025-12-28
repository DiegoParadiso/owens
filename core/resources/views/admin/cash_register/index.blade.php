@extends('admin.template.master')

@section('content')
    <div class="container-fluid pt-4 px-4">
        <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
            aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Dashboard</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ $title }}</li>
            </ol>
        </nav>
        <div class="row mx-0">
            <div class="col-12">
                <div class="bg-white rounded p-4">
                    <h6 class="mb-4 d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            {{ $title }} - Estado: <span class="badge bg-success ms-2">Abierta</span>
                        </div>
                        <button type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#closeRegisterModal">Cerrar Caja</button>
                    </h6>

                    {{-- Flash Message --}}
                    @if (session('error'))
                        <div class="alert alert-danger">
                            {{ session('error') }}
                        </div>
                    @endif

                    <div class="row mb-4">
                        <div class="col-md-4">
                            <div class="card text-white bg-primary mb-3">
                                <div class="card-header">Saldo Actual</div>
                                <div class="card-body">
                                    <h4 class="card-title text-white">{{ rupiah($currentBalance) }}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-white bg-success mb-3">
                                <div class="card-header">Ingresos</div>
                                <div class="card-body">
                                    <h4 class="card-title text-white">{{ rupiah($income) }}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-white bg-danger mb-3">
                                <div class="card-header">Egresos</div>
                                <div class="card-body">
                                    <h4 class="card-title text-white">{{ rupiah($expense) }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h6 class="mb-3">Movimientos Recientes</h6>
                    <table class="table text-start align-middle table-bordered table-hover mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Hora</th>
                                <th scope="col">Tipo</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($movements as $movement)
                                <tr>
                                    <td>{{ \Carbon\Carbon::parse($movement->created_at)->format('H:i') }}</td>
                                    <td>
                                        @if ($movement->type == 'income')
                                            <span class="badge bg-success">Ingreso</span>
                                        @else
                                            <span class="badge bg-danger">Egreso</span>
                                        @endif
                                    </td>
                                    <td>{{ $movement->description }}</td>
                                    <td>{{ rupiah($movement->amount) }}</td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="text-center">No hay movimientos</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Close Register Modal -->
    <div class="modal fade" id="closeRegisterModal" tabindex="-1" aria-labelledby="closeRegisterModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="closeRegisterModalLabel">Cerrar Caja</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="{{ route('cash_register.close', $openRegister->id) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="modal-body">
                        <p>Saldo esperado en sistema: <strong>{{ rupiah($currentBalance) }}</strong></p>
                        <div class="mb-3">
                            <label for="closing_amount" class="form-label">Monto Real en Caja (Contado)</label>
                            <input type="number" name="closing_amount" class="form-control" min="0" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-danger">Cerrar Caja</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
