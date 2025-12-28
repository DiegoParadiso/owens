@extends('admin.template.master')

@section('content')
    <div class="container-fluid pt-4 px-4">
        <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
            aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Dashboard</a></li>
                <li class="breadcrumb-item"><a href="{{ route('product.index') }}">{{ $title }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ $subtitle }}</li>
            </ol>
        </nav>
        <div class="row vh-100 mx-0">
            <div class="col-12">
                <div class="h-100 p-4">
                    <h6 class="mb-4">{{ $title }}</h6>
                    
                    <div class="col-sm-12 col-xl-8">
                        <div class="bg-white rounded h-100 p-4">
                            <h6 class="mb-4">Crear Combo</h6>
                            <form id="form-create-combo">
                                @csrf
                                <div class="mb-3">
                                    <label for="" class="form-label">Nombre del Combo</label>
                                    <input type="text" name="name" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label for="" class="form-label">Precio del Combo ($)</label>
                                    <input type="number" name="price" class="form-control" min="0" required>
                                </div>

                                <h6 class="mb-3">Componentes del Combo</h6>
                                <table class="table table-bordered" id="combo-table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <select name="child_product_id[]" class="form-select" required>
                                                    <option value="">Seleccionar Producto</option>
                                                    @foreach ($products as $product)
                                                        <option value="{{ $product->id }}">{{ $product->name }}</option>
                                                    @endforeach
                                                </select>
                                            </td>
                                            <td>
                                                <input type="number" name="quantity[]" class="form-control" min="1" value="1" required>
                                            </td>
                                            <td>
                                                <button type="button" class="btn btn-danger btn-sm remove-row"><i class="fa fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button type="button" class="btn btn-success btn-sm mb-3" id="add-row"><i class="fa fa-plus"></i> Agregar Componente</button>

                                <br>
                                <button type="submit" class="btn btn-primary">Crear Combo</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('js')
<script>
    $(document).ready(function() {
        $('#add-row').click(function() {
            let row = `<tr>
                        <td>
                            <select name="child_product_id[]" class="form-select" required>
                                <option value="">Seleccionar Producto</option>
                                @foreach ($products as $product)
                                    <option value="{{ $product->id }}">{{ $product->name }}</option>
                                @endforeach
                            </select>
                        </td>
                        <td>
                            <input type="number" name="quantity[]" class="form-control" min="1" value="1" required>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger btn-sm remove-row"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>`;
            $('#combo-table tbody').append(row);
        });

        $(document).on('click', '.remove-row', function() {
            $(this).closest('tr').remove();
        });

        $("#form-create-combo").submit(function(e) {
            e.preventDefault();
            let dataForm = $(this).serialize();
            $.ajax({
                type: "POST",
                url: "{{ route('product.storeCombo') }}",
                data: dataForm,
                dataType: "json",
                success: function(data) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: data.message,
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "{{ route('product.indexCombo') }}?highlight_id=" + data.id;
                        }
                    });
                },
                error: function(data) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.responseJSON.message || 'Ocurrió un error',
                        confirmButtonText: 'Ok'
                    });
                }
            });
        });
    });
</script>
@endsection
