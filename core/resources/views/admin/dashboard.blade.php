@extends('admin.template.master')

@section('content')
    <!-- Sale & Revenue Start -->
    <div class="container-fluid pt-4 px-4">
        <div class="row g-3">
            <!-- Left Column: Cash Register (Spans height of 2 rows) -->
            <div class="col-sm-12 col-xl-4">
                <div class="bg-white rounded d-flex flex-column align-items-center justify-content-center p-4 h-100">
                    <i class="fa fa-cash-register fa-4x text-primary mb-3"></i>
                    <div class="text-center">
                        @if ($openRegister)
                            <h5 class="mb-2">Estado: <span class="text-success fw-bold">Abierta</span></h5>
                            <button type="button" class="btn btn-sm btn-danger mt-2" data-bs-toggle="modal" data-bs-target="#closeRegisterModal">Cerrar Caja</button>
                        @else
                            <h5 class="mb-2">Estado: <span class="text-danger">Cerrada</span></h5>
                            <a href="{{ route('cash_register.create') }}" class="btn btn-primary mt-2">Abrir Ahora</a>
                        @endif
                    </div>
                </div>
            </div>

            <!-- Right Column: 2x2 Stats Grid -->
            <div class="col-sm-12 col-xl-8">
                <div class="row g-3 h-100">
                    <div class="col-sm-6">
                        <div class="bg-white rounded d-flex align-items-center p-4 h-100">
                            <i class="fa fa-receipt fa-3x text-primary"></i>
                            <div class="ms-3">
                                <p class="mb-2">Ventas Hoy</p>
                                <h6 class="mb-0">{{ $todaySalesCount }}</h6>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="bg-white rounded d-flex align-items-center p-4 h-100">
                            <i class="fa fa-shopping-basket fa-3x text-primary"></i>
                            <div class="ms-3">
                                <p class="mb-2">Ventas Totales</p>
                                <h6 class="mb-0">{{ $totalSalesCount }}</h6>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="bg-white rounded d-flex align-items-center p-4 h-100">
                            <i class="fa fa-coins fa-3x text-primary"></i>
                            <div class="ms-3">
                                <p class="mb-2">Ingresos Hoy</p>
                                <h6 class="mb-0">{{ rupiah($todayRevenue) }}</h6>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="bg-white rounded d-flex align-items-center p-4 h-100">
                            <i class="fa fa-wallet fa-3x text-primary"></i>
                            <div class="ms-3">
                                <p class="mb-2">Ingresos Totales</p>
                                <h6 class="mb-0">{{ rupiah($totalRevenue) }}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Sale & Revenue End -->


    <!-- Sales Chart Start -->
    <div class="container-fluid pt-4 px-4">
        <div class="row g-4">
            <div class="col-sm-12 col-xl-6">
                <div class="bg-white text-center rounded p-4">
                    <div class="d-flex align-items-center justify-content-between mb-4">
                        <h6 class="mb-0">Ventas Globales</h6>
                        <a href="">Mostrar Todo</a>
                    </div>
                    <canvas id="worldwide-sales"></canvas>
                </div>
            </div>
            <div class="col-sm-12 col-xl-6">
                <div class="bg-white text-center rounded p-4">
                    <div class="d-flex align-items-center justify-content-between mb-4">
                        <h6 class="mb-0">Ventas e Ingresos</h6>
                        <a href="">Mostrar Todo</a>
                    </div>
                    <canvas id="salse-revenue"></canvas>
                </div>
            </div>
        </div>
    </div>
    <!-- Sales Chart End -->


    <!-- Recent Sales Start -->
    <div class="container-fluid pt-4 px-4">
        <div class="bg-white text-center rounded p-4">
            <div class="d-flex align-items-center justify-content-between mb-4">
                <h6 class="mb-0">Ventas Recientes</h6>
                <a href="{{ url('/sales') }}">Ver Todo</a>
            </div>
            <div class="table-responsive">
                <table class="table text-start align-middle table-bordered table-hover mb-0">
                    <thead>
                        <tr class="text-dark">
                            <th scope="col">#</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Factura</th>
                            <th scope="col">Cajero</th>
                            <th scope="col">Monto</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($recentSales as $sale)
                            <tr>
                                <th scope="row">{{ $loop->iteration }}</th>
                                <td>{{ \Carbon\Carbon::parse($sale->sale_date)->format('d M Y') }}</td>
                                <td>INV-{{ str_pad($sale->id, 4, '0', STR_PAD_LEFT) }}</td>
                                <td>{{ $sale->user->name ?? 'Unknown' }}</td>
                                <td>{{ rupiah($sale->total_price) }}</td>
                                <td>
                                    {{ optional($sale->payment)->payment_status ?? 'Pendiente' }}
                                </td>
                                <td>
                                    @if (optional($sale->payment)->payment_status === 'Lunas')
                                        <a href="{{ route('sales.receipt', $sale->id) }}" class="btn btn-success btn-sm"
                                            target="_blank">
                                            Nota
                                        </a>
                                    @else
                                        <div class="dropdown">
                                            <button class="btn btn-warning btn-sm dropdown-toggle" type="button"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                                Pagar
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a class="dropdown-item"
                                                        href="{{ route('sales.payCash', $sale->id) }}">
                                                        Efectivo
                                                    </a>
                                                </li>

                                            </ul>
                                        </div>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <!-- Recent Sales End -->

    @if ($openRegister)
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
    @endif

@endsection

@section('js')
    <script>
        const salesLabels = {!! json_encode($chartLabels) !!};
        const salesData = {!! json_encode($chartSalesData) !!};
        const revenueData = {!! json_encode($chartRevenueData) !!};

        new Chart(document.getElementById("worldwide-sales"), {
            type: "bar",
            data: {
                labels: salesLabels,
                datasets: [{
                    label: "Ventas",
                    data: salesData,
                    backgroundColor: "rgba(54, 162, 235, 0.7)"
                }]
            }
        });

        new Chart(document.getElementById("salse-revenue"), {
            type: "line",
            data: {
                labels: salesLabels,
                datasets: [{
                        label: "Ventas",
                        data: salesData,
                        borderColor: "rgba(75, 192, 192, 1)",
                        fill: false
                    },
                    {
                        label: "Ingresos",
                        data: revenueData,
                        borderColor: "rgba(255, 99, 132, 1)",
                        fill: false
                    }
                ]
            }
        });
    </script>
@endsection
