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
        <div class="row bg-white rounded mx-0">
            <div class="col-12">
                <div class="p-4">
                    <h6 class="mb-4 d-flex justify-content-between align-items-center">
                        {{ $title }} - {{ \Carbon\Carbon::parse($date)->format('d M Y') }}
                        <form action="{{ route('report.index') }}" method="GET" class="d-flex">
                            <input type="date" name="date" class="form-control me-2" value="{{ $date }}">
                            <button type="submit" class="btn btn-primary">Filtrar</button>
                        </form>
                    </h6>

                    <div class="row mb-4">
                        <div class="col-md-3">
                            <div class="card text-white bg-primary mb-3">
                                <div class="card-header">Ventas Totales</div>
                                <div class="card-body">
                                    <h4 class="card-title text-white">{{ rupiah($sales) }}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-white bg-warning mb-3">
                                <div class="card-header">Costo de Ventas (COGS)</div>
                                <div class="card-body">
                                    <h4 class="card-title text-white">{{ rupiah($totalCostOfGoods) }}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-white bg-danger mb-3">
                                <div class="card-header">Gastos Operativos</div>
                                <div class="card-body">
                                    <h4 class="card-title text-white">{{ rupiah($expenses) }}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-white {{ $netProfit >= 0 ? 'bg-success' : 'bg-danger' }} mb-3">
                                <div class="card-header">Resultado Neto (Ganancia/Pérdida)</div>
                                <div class="card-body">
                                    <h4 class="card-title text-white">{{ rupiah($netProfit) }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-info">
                        <strong>Nota:</strong> El Resultado Neto se calcula como: <em>Ventas - Costo de Productos Vendidos - Gastos Operativos</em>.
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
