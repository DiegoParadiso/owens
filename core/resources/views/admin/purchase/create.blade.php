@extends('admin.template.master')

@section('content')
    <div class="container-fluid pt-4 px-4">
        <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
            aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Dashboard</a></li>
                <li class="breadcrumb-item"><a href="{{ route('purchase.index') }}">{{ $title }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ $subtitle }}</li>
            </ol>
        </nav>
        <div class="row bg-white rounded mx-0">
            <div class="col-12">
                <div class="h-100 p-4">
                    <h6 class="mb-4">{{ $title }}</h6>
                    
                    @if ($errors->any())
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <ul class="mb-0">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    @endif

                    <form action="{{ route('purchase.store') }}" method="POST">
                        @csrf
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="" class="form-label">Proveedor</label>
                                <select name="supplier_id" class="form-select" required>
                                    <option value="">Seleccionar Proveedor</option>
                                    @foreach ($suppliers as $supplier)
                                        <option value="{{ $supplier->id }}">{{ $supplier->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="" class="form-label">Fecha</label>
                                <input type="date" name="date" class="form-control" value="{{ date('Y-m-d') }}" required>
                            </div>
                        </div>

                        <h6 class="mb-3">Detalles de Compra</h6>
                        <table class="table table-bordered" id="purchase-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Costo Unitario</th>
                                    <th>Subtotal</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <select name="product_id[]" class="form-select product-select" required>
                                            <option value="">Seleccionar Producto</option>
                                            @foreach ($products as $product)
                                                <option value="{{ $product->id }}">{{ $product->Nama }}</option>
                                            @endforeach
                                        </select>
                                    </td>
                                    <td>
                                        <input type="number" name="quantity[]" class="form-control quantity" min="1" value="1" required>
                                    </td>
                                    <td>
                                        <input type="number" name="unit_cost[]" class="form-control unit-cost" min="0" value="0" required>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control subtotal" readonly value="0">
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-danger btn-sm remove-row"><i class="fa fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" class="btn btn-success btn-sm mb-3" id="add-row"><i class="fa fa-plus"></i> Agregar Producto</button>

                        <div class="d-flex justify-content-end">
                            <h5>Total: <span id="total-cost">0</span></h5>
                        </div>

                        <button type="submit" class="btn btn-primary mt-3">Registrar Compra</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('js')
<script>
    $(document).ready(function() {
        function calculateTotal() {
            let total = 0;
            $('#purchase-table tbody tr').each(function() {
                let qty = parseFloat($(this).find('.quantity').val()) || 0;
                let cost = parseFloat($(this).find('.unit-cost').val()) || 0;
                let subtotal = qty * cost;
                $(this).find('.subtotal').val(subtotal);
                total += subtotal;
            });
            $('#total-cost').text(total.toLocaleString('id-ID'));
        }

        $(document).on('input', '.quantity, .unit-cost', function() {
            calculateTotal();
        });

        $('#add-row').click(function() {
            let row = `<tr>
                        <td>
                            <select name="product_id[]" class="form-select product-select" required>
                                <option value="">Seleccionar Producto</option>
                                @foreach ($products as $product)
                                    <option value="{{ $product->id }}">{{ $product->Nama }}</option>
                                @endforeach
                            </select>
                        </td>
                        <td>
                            <input type="number" name="quantity[]" class="form-control quantity" min="1" value="1" required>
                        </td>
                        <td>
                            <input type="number" name="unit_cost[]" class="form-control unit-cost" min="0" value="0" required>
                        </td>
                        <td>
                            <input type="text" class="form-control subtotal" readonly value="0">
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger btn-sm remove-row"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>`;
            $('#purchase-table tbody').append(row);
        });

        $(document).on('click', '.remove-row', function() {
            $(this).closest('tr').remove();
            calculateTotal();
        });
    });
</script>
@endsection
