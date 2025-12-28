@extends('admin.template.master')

@section('css')
    <link href="{{ asset('') }}lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">
    <link href="{{ asset('') }}lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css" rel="stylesheet" />
    <link href="{{ asset('css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">

    <!-- Modal -->
    <div class="modal fade" id="modalTambahStok" data-backdrop="static" data-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Agregar Stock</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="form-tambah-stok" method="post">
                    <div class="modal-body">
                        <input type="hidden" name="id_produk" id="id_produk">
                        <label for=""> Cantidad de Stock </label>
                        <input type="number" name="stock" id="nilaiTambahStok" class="form-control" required>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        <button type="submit" class="btn btn-primary">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection

@section('content')
    <div class="container-fluid pt-4 px-4">
        <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
            aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Dashboard</a></li>
                <li class="breadcrumb-item"><a href="{{ route('sales.index') }}">{{ $title }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ $subtitle }}</li>
            </ol>
        </nav>
        <div class="row vh-100 mx-0">
            <div class="col-12">
                <div class="bg-white rounded h-100 p-4">
                    <h6 class="mb-4">{{ $title }}</h6>

                    {{-- Flash Message --}}

                    @if (session('error'))
                        <div class="alert alert-danger">
                            {{ session('error') }}
                        </div>
                    @endif

                    <div class="card-body">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($saleDetails as $item)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $item->name }}</td>
                                        <td>{{ rupiah($item->price) }}</td>
                                        <td>{{ $item->quantity }}</td>
                                        <td>{{ rupiah($item->subtotal) }}</td>
                                    </tr>
                                @endforeach

                                <tr>
                                    <td colspan="4" align="right">Precio Total</td>
                                    <td> <input type="text" name="totalHarga" id="totalHarga"
                                            value="{{ rupiah($sale->total_price) }}" readonly class="form-control">
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="4" align="right">Monto a Pagar</td>
                                    <td><input type="number" class="form-control name="amount_paid" id="JumlahBayar"></td>
                                </tr>
                                <tr>
                                    <td colspan="4" align="right">Cambio</td>
                                    <td><input type="number" class="form-control name="change" id="Kembalian" readonly>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" id="btnSimpan" class="btn btn-primary float-right mt-2">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('js')
    <script>
        $(document).ready(function() {
            $('#JumlahBayar').on('input', function() {
                var totalHarga = $('#totalHarga').val();

                var totalHarga = totalHarga.replace(/[^0-9,]/g, '').replace(",", ".");
                console.log(totalHarga);
                var JumlahBayar = $(this).val();
                var Kembalian = JumlahBayar - totalHarga;
                $('#Kembalian').val(Kembalian);
            })
        })
    </script>
    <script>
        $(document).ready(function() {
            $('#btnSimpan').on('click', function() {
                var totalHarga = $('#totalHarga').val();
                totalHarga = totalHarga.replace(/[^0-9,]/g, '').replace(",", ".");
                var JumlahBayar = $('#JumlahBayar').val();
                var Kembalian = $('#Kembalian').val();
                var id = '{{ $sale->id }}';
                if (!JumlahBayar || JumlahBayar.trim() === '' || !Kembalian || Kembalian.trim() === '') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Formulario Incompleto',
                        text: 'El monto a pagar y el cambio no pueden estar vacíos.',
                        confirmButtonText: 'Ok',
                    });
                    return; 
                }
                if (parseFloat(JumlahBayar) < parseFloat(totalHarga)) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Pago Insuficiente',
                        text: 'El monto del pago es menor que el precio total. Por favor paga la cantidad indicada.',
                        confirmButtonText: 'Cerrar',
                    });
                    return;
                }
                $.ajax({
                    type: "POST",
                    url: "{{ route('sales.storeCashPayment') }}",
                    data: {
                        _token: "{{ csrf_token() }}",
                        totalHarga: totalHarga,
                        amount_paid: JumlahBayar,
                        change: Kembalian,
                        id: id
                    },
                    success: function(response) {
                        window.location.href = "{{ route('sales.index') }}?highlight_id=" + response.id;
                    },
                    error: function(response) {
                        console.log(response);
                    }
                })
            })
        })
    </script>
@endsection
