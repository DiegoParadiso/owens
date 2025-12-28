<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="title" content="Simple Cashier App by SUKI">
    <meta name="author" content="Ridhsuki">
    <title>Nota</title>
</head>

<style>
    table,
    td,
    th {
        border: 1px solid;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }
</style>

<body>
    <h1 align="center">Recibo Tienda RIDHSUKI</h1>
    <h5>Dirección: Politeknik IDN Bogor</h5>

    <table width="100%">
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
                     <td>{{ $item->product_name ?? 'Producto no encontrado' }}</td>
                    <td>{{ rupiah($item->price) }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>{{ rupiah($item->subtotal) }}</td>
                </tr>
            @endforeach

            <tr>
                <td colspan="4" align="right">Precio Total</td>
                <td> {{ rupiah($sale->total_price) }}
                </td>
            </tr>
            <tr>
                <td colspan="4" align="right">Monto Pagado</td>
                <td>{{ rupiah($amount_paid) }}</td>
            </tr>
            <tr>
                <td colspan="4" align="right">Cambio</td>
                <td>{{ rupiah($change) }}</td>
            </tr>

            <tr>
                <td colspan="4" align="right">Cajero</td>
                <td>{{ Auth::user()->name }}</td>
            </tr>
        </tbody>
    </table>
</body>

</html>

<script>
    window.print();
</script>