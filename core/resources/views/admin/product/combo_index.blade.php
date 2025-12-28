@extends('admin.template.master')

@section('content')
    <div class="container-fluid pt-4 px-4">
        <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
            aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">{{ $title }}</li>
            </ol>
        </nav>
        <div class="row bg-white rounded mx-0">
            <div class="col-12">
                <div class="p-4">
                    <h6 class="mb-4 d-flex justify-content-between align-items-center">
                        {{ $title }}
                        <a href="{{ route('product.createCombo') }}" class="btn btn-sm btn-primary">Crear Nuevo Combo</a>
                    </h6>

                    <table class="table text-start align-middle table-bordered table-hover mb-0">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nombre del Combo</th>
                                <th scope="col">Precio de Venta</th>
                                <th scope="col">Componentes (Lo que descuenta)</th>
                                <th scope="col">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($products as $product)
                                <tr class="{{ session('highlight_id') == $product->id ? 'highlight-row' : '' }}">
                                    <th scope="row">{{ $loop->iteration }}</th>
                                    <td>{{ $product->name }}</td>
                                    <td>{{ rupiah($product->price) }}</td>
                                    <td>
                                        <ul class="mb-0 ps-3">
                                            @foreach ($product->components as $component)
                                                <li>{{ $component->quantity }}x {{ $component->childProduct->name }}</li>
                                            @endforeach
                                        </ul>
                                    </td>
                                    <td>
                                        <form class="form-delete-product"
                                            action="{{ route('product.destroy', $product->id) }}" method="POST">
                                            @csrf
                                            @method('DELETE')
                                            {{-- Future: Add Edit Combo Route --}}
                                            {{-- <a href="{{ route('product.editCombo', $product->id) }}" class="btn btn-sm btn-warning">Editar</a> --}}
                                            <button type="submit" class="btn btn-sm btn-danger">Eliminar</button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="text-center">No hay combos registrados</td>
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
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        $(document).on('submit', '.form-delete-product', function(e) {
            e.preventDefault();
            var form = this;
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Se eliminará este combo",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#df0f13',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '¡Sí, eliminar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            })
        });
    </script>
@endsection
