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
                    <div class="col-sm-12 col-xl-6">
                        <div class="bg-white rounded h-100 p-4">
                            <h6 class="mb-4">Editar Datos</h6>
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
                            <div id="error" style="display:none">
                                <div class="alert alert-danger">
                                    <p id="error-message"></p>
                                </div>
                            </div>
                            <form id='form-update-produk' method="POST">
                                <div class="mb-3">
                                    <label for="" class="form-label">Nombre del Producto</label>
                                    <input type="text" name="name" value="{{ $product->name }}" class="form-control"
                                        required>
                                </div>
                                <div class="mb-3">
                                    <label for="" class="form-label">Precio ($)</label>
                                    <input type="number" name="price" value="{{ $product->price }}" class="form-control"
                                        required>
                                </div>
                                <div class="mb-3">
                                    <label for="" class="form-label">Stock</label>
                                    <input type="number" name="stock" value="{{ $product->stock }}" class="form-control"
                                        required>
                                </div>
                                <button type="submit" class="btn btn-primary">Actualizar</button>
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
            $("#form-update-produk").submit(function(e) {
                e.preventDefault();
                dataForm = $(this).serialize() + "&_token={{ csrf_token() }}" + "&id={{ $product->id }}";
                $.ajax({
                    type: "PUT",
                    url: "{{ route('product.update', ':id') }}".replace(':id',
                        {{ $product->id }}),
                    data: dataForm,
                    dataType: "json",
                    success: function(data) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Éxito',
                            text: data.message,
                            confirmButtonText: 'Ok'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = "{{ route('product.index') }}?highlight_id=" + data.id;
                            }
                        })
                    },
                    error: function(data) {
                        console.log(data.message);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message,
                            confirmButtonText: 'Ok'
                        })
                        if (data.status == 500) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: data.responseJSON.message,
                                confirmButtonText: 'Ok'
                            })
                        }
                    }
                });
            });
        });
    </script>
@endsection
