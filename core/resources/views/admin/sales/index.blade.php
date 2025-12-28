@extends('admin.template.master')

@section('css')
    <link href="{{ asset('') }}lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">
    <link href="{{ asset('') }}lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css" rel="stylesheet" />
    <link href="{{ asset('css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
@endsection

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
                <div class="h-100 p-4">
                    <h6 class="mb-4 d-flex justify-content-between align-items-center">
                        {{ $title }}
                        <a href="{{ route('sales.create') }}" class="btn btn-sm btn-primary">Agregar</a>
                    </h6>

                    <table class="table text-start align-middle table-bordered table-hover mb-0 table-responsive">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Fecha de Venta</th>
                                <th scope="col">Producto</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Vendedor</th>
                                <th scope="col">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($sales as $sale)
                                <tr class="{{ session('highlight_id') == $sale->id ? 'highlight-row' : '' }}">
                                    <th scope="row">{{ $loop->iteration }}</th>
                                    <td>{{ $sale->sale_date }}</td>
                                    <td>
                                        @if ($sale->saleDetails->isNotEmpty())
                                            @foreach ($sale->saleDetails as $detail)
                                                @if ($detail->product)
                                                    {{ $detail->product->name }} ({{ $detail->quantity }}
                                                    unidades)<br>
                                                @else
                                                    Producto no encontrado (ID: {{ $detail->product_id }})<br>
                                                @endif
                                            @endforeach
                                        @else
                                            No hay productos
                                        @endif
                                    </td>
                                    <td>{{ rupiah($sale->total_price) }}</td>
                                    <td>{{ $sale->name }}</td>
                                    <td>
                                        @if ($sale->payment_status == 'Lunas')
                                            <a href="{{ route('sales.receipt', $sale->id) }}" class="btn btn-success"
                                                target="_blank">Recibo</a>
                                        @else
                                            <div class="dropdown">
                                                <button class="btn btn-secondary dropdown-toggle" type="button"
                                                    id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Pagar
                                                </button>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    <li><a class="dropdown-item"
                                                            href="{{ route('sales.payCash', $sale->id) }}">Efectivo</a>
                                                    </li>
                                                    <li><a class="dropdown-item" href="#"
                                                            id="qris-not-available">Transferencia/QRIS</a></li>
                                                </ul>
                                            </div>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="text-center">No hay datos de ventas</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('js')
    <script src="{{ asset('') }}lib/chart/chart.min.js"></script>
    <script src="{{ asset('') }}lib/easing/easing.min.js"></script>
    <script src="{{ asset('') }}lib/waypoints/waypoints.min.js"></script>
    <script src="{{ asset('') }}lib/owlcarousel/owl.carousel.min.js"></script>
    <script src="{{ asset('') }}lib/tempusdominus/js/moment.min.js"></script>
    <script src="{{ asset('') }}lib/tempusdominus/js/moment-timezone.min.js"></script>
    <script src="{{ asset('') }}lib/tempusdominus/js/tempusdominus-bootstrap-4.min.js"></script>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <!-- Bootstrap JS -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#qris-not-available').on('click', function(e) {
                e.preventDefault();
                Swal.fire({
                    title: 'Función no disponible',
                    text: 'La función Transferencia/QRIS aún no está disponible. Si deseas apoyar el desarrollo de esta función, por favor ayuda con tu apoyo.',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Apoyar al Desarrollador',
                    cancelButtonText: 'Cerrar',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.open('https://saweria.co/basukiridho', '_blank');
                    }
                });
            });
        });
    </script>
@endsection
