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
                <li class="breadcrumb-item"><a href="{{ route('sales.index') }}">{{ $title }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ $subtitle }}</li>
            </ol>
        </nav>
        <div class="row bg-white rounded mx-0">
            <div class="col-12">
                <form action="{{ route('sales.store') }}" method="post" id="formPenjualan">
                    <div class="h-100 p-4">
                        <h6 class="mb-4">{{ $title }}</h6>

                        {{-- Flash Message --}}
                        @if (session('error'))
                            <div class="alert alert-danger">
                                {{ session('error') }}
                            </div>
                        @endif
                        <table class="table table-bordered table-responsive">
                            @csrf
                            <thead>
                                <tr>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="penjualan">
                                <tr>
                                    <td>
                                        <select name="product_id[]" id="id_produk" class="form-control kode-produk"
                                            onchange="pilihProduk(this)">
                                            <option value="">Seleccionar Producto</option>
                                            @foreach ($products as $product)
                                                <option value="{{ $product->id }}" data-harga="{{ $product->price }}">
                                                    {{ $product->name }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" name="price[]" id="harga" class="form-control harga"
                                            readonly>
                                    </td>
                                    <td>
                                        <input type="number" name="quantity[]" id="JumlahProduk "
                                            class="form-control jumlahProduk" oninput="hitungTotal(this)">
                                    </td>
                                    <td>
                                        <input type="text" name="total_price[]" id="TotalHarga"
                                            class="form-control totalHarga" readonly>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-danger"
                                            onclick="hapusProduk(this)">Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                            <tfooter>
                                <tr>
                                    <td colspan="3">
                                        Precio Total
                                    </td>
                                    <td colspan="2">
                                        <div class="input-group">
                                            <span class="input-group-text bg-transparent border-end-0">$</span>
                                            <input type="text" id="total" readonly class="form-control border-start-0 ps-0" name="total">
                                        </div>
                                    </td>
                            </tfooter>
                        </table>
                        <button type="button" class="btn btn-primary" onclick="tambahProduk()">Agregar Producto</button>
                    </div>
                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
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
    <script>
        function tambahProduk() {
            const newArrow = `
            <tr>
                                        <td>
                                            <select name="product_id[]" id="id_produk" class="form-control kode-produk" onchange="pilihProduk(this)">
                                                <option value="">Seleccionar Producto</option>
                                                @foreach ($products as $product)
                                                    <option value="{{ $product->id }}" data-harga="{{ $product->price }}" >{{ $product->name }}
                                                    </option>
                                                @endforeach
                                            </select>

                                        </td>
                                        <td>
                                            <input type="text" name="price[]" id="harga" class="form-control harga" readonly>
                                        </td>
                                        <td>
                                            <input type="number" name="quantity[]" id="JumlahProduk" class="form-control jumlahProduk" oninput="hitungTotal(this)">
                                        </td>
                                        <td>
                                            <input type="text" name="total_price[]" id="TotalHarga" class="form-control totalHarga" readonly>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-danger" onclick="hapusProduk(this)">Eliminar</button>
                                        </td>
                                    </tr>
            `;
            $('#penjualan').append(newArrow);
        }

        function hapusProduk(buttonElement) {
            $(buttonElement).closest('tr').remove();
        }

        function pilihProduk(produk) {
            const selectOption = produk.options[produk.selectedIndex];
            const row = $(produk).closest('tr');

            const harga = $(selectOption).data('harga');

            const selectedKode = produk.value;
            if ($(".kode-produk").not(produk).filter((_, el) => el.value === selectedKode).length > 0) {
                alert('El producto ya existe');
                row.find('.kode-produk').val('');
                return;
            }

            row.find('.harga').val(harga);
        }

        function hitungTotal(inputElement) {
            const row = $(inputElement).closest('tr');
            const harga = parseFloat(row.find('.harga').val());
            const jumlahProduk = parseFloat(inputElement.value);
            const totalHarga = harga * jumlahProduk;
            row.find('.totalHarga').val(totalHarga);

            hitungTotalAkhir();
        }

        function hitungTotalAkhir() {
            let total = 0;

            $('.totalHarga').each(function() {
                total += parseFloat($(this).val()) || 0;
            });

            $('#total').val(total);
        }

        $(document).ready(function() {
            $('#formPenjualan').on('submit', function(e) {
                let isValid = true;
                let errorMessage = '';

                if ($('#penjualan tr').length === 0) {
                    errorMessage = 'Agrega al menos un producto para realizar la venta.';
                    isValid = false;
                } else {
                    $('#penjualan tr').each(function() {
                        const produkId = $(this).find('.kode-produk').val();
                        const jumlahProduk = $(this).find('.jumlahProduk').val();
                        const totalHargaPerItem = $(this).find('.totalHarga').val();

                        if (!produkId || produkId.trim() === '') {
                            errorMessage = 'Selecciona un producto para cada fila agregada.';
                            isValid = false;
                            return false;
                        }

                        if (!jumlahProduk || parseFloat(jumlahProduk) <= 0 || isNaN(parseFloat(
                                jumlahProduk))) {
                            errorMessage =
                                'La cantidad de productos debe ser mayor a 0.';
                            isValid = false;
                            return false;
                        }

                        if (!totalHargaPerItem || parseFloat(totalHargaPerItem) <= 0 || isNaN(
                                parseFloat(totalHargaPerItem))) {
                            errorMessage =
                                'El precio total no puede estar vacío o ser cero. Asegúrate de que el producto y la cantidad sean correctos.';
                            isValid = false;
                            return false;
                        }
                    });
                }


                if (!isValid) {
                    e.preventDefault();
                    Swal.fire({
                        icon: 'warning',
                        title: 'Error de Validación',
                        text: errorMessage,
                        confirmButtonText: 'Ok',
                    });
                }
            });

            hitungTotalAkhir();
        });
    </script>
@endsection
