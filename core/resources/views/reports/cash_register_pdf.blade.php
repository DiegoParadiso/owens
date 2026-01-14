<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Reporte de Cierre de Caja #{{ $register->id }}</title>
    <style>
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 11px;
            color: #000;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .header {
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
            text-transform: uppercase;
        }
        .header p {
            margin: 2px 0;
            font-size: 12px;
        }
        .summary-box {
            width: 100%;
            margin-bottom: 15px;
        }
        .summary-box  td {
            border: 1px solid #000;
        }
        .footer {
            margin-top: 50px;
            width: 100%;
            text-align: center;
        }
        .signature-line {
            display: inline-block;
            width: 200px;
            border-top: 1px solid #000;
            margin: 0 40px;
            padding-top: 5px;
            font-size: 10px;
        }
    </style>
</head>
<body>

    <div class="header">
        <table style="width: 100%; border: none; margin-bottom: 10px;">
            <tr style="border: none;">
                <td style="border: none; width: 60px; vertical-align: middle;">
                    <img src="{{ public_path('img/owens.png') }}" alt="Logo" style="width: 50px; height: auto;">
                </td>
                <td style="border: none; vertical-align: middle;">
                    <h1>REPORTE DE CIERRE DE CAJA</h1>
                </td>
            </tr>
        </table>
        
        <p><strong>ID Cierre:</strong> #{{ $register->id }}</p>
        <p><strong>Fecha/Hora Cierre:</strong> {{ \Carbon\Carbon::parse($register->closed_at)->format('d/m/Y H:i:s') }}</p>
        <p><strong>Cajero Responsable:</strong> {{ $register->user ? $register->user->name : 'N/A' }}</p>
        <p><strong>Duracion:</strong> {{ \Carbon\Carbon::parse($register->opened_at)->diffForHumans(\Carbon\Carbon::parse($register->closed_at), true) }}</p>
    </div>

    <!-- Resumen Financiero -->
    <table class="summary-box">
        <tr>
            <th colspan="4" class="text-center">BALANCE GENERAL</th>
        </tr>
        <tr>
            <td width="25%"><strong>Fondo Inicial (Apertura)</strong></td>
            <td width="25%" class="text-right">{{ number_format($register->opening_amount, 2) }}</td>
            <td width="25%"><strong>Efectivo Declarado (Cierre)</strong></td>
            <td width="25%" class="text-right">{{ number_format($register->closing_amount, 2) }}</td>
        </tr>
        <tr>
            <td><strong>(+) Ventas/Ingresos</strong></td>
            <td class="text-right">{{ number_format($income, 2) }}</td>
            <td><strong>Saldo Calculado (Sistema)</strong></td>
            <td class="text-right">{{ number_format($balance, 2) }}</td>
        </tr>
        <tr>
            <td><strong>(-) Compras/Egresos</strong></td>
            <td class="text-right">{{ number_format($expense, 2) }}</td>
            <td><strong>DIFERENCIA</strong></td>
            <td class="text-right" style="{{ ($register->closing_amount - $balance) != 0 ? 'font-weight:bold;' : '' }}">
                {{ number_format($register->closing_amount - $balance, 2) }}
            </td>
        </tr>
    </table>

    <!-- Detalle de Movimientos -->
    <h3>DETALLE DE MOVIMIENTOS</h3>
    <table>
        <thead>
            <tr>
                <th width="15%">HORA</th>
                <th width="45%">DESCRIPCION / CONCEPTO</th>
                <th width="20%">TIPO</th>
                <th width="20%" class="text-right">MONTO</th>
            </tr>
        </thead>
        <tbody>
            @forelse($register->movements as $mov)
                <tr>
                    <td class="text-center">{{ \Carbon\Carbon::parse($mov->created_at)->format('H:i:s') }}</td>
                    <td>
                        {{ $mov->description }}
                        @if($mov->related)
                            @if($mov->type === 'sale' && ($mov->related->saleDetails ?? $mov->related->sale_details))
                                <br><span style="font-size:9px; color:#555">
                                    Productos: {{ $mov->related->saleDetails?->map(fn($d) => $d->product?->name)->join(', ') ?? $mov->related->sale_details?->map(fn($d) => $d->product?->name)->join(', ') }}
                                </span>
                            @elseif($mov->type === 'purchase' && $mov->related->details)
                                <br><span style="font-size:9px; color:#555">
                                    Productos: {{ $mov->related->details->map(fn($d) => $d->product?->name)->join(', ') }}
                                </span>
                            @elseif($mov->type === 'expense')
                                <br><span style="font-size:9px; color:#555">
                                    {{ $mov->related->description }}
                                </span>
                            @endif
                        @endif
                    </td>
                    <td class="text-center">
                        @if($mov->type == 'income') INGRESO
                        @elseif($mov->type == 'sale') VENTA
                        @elseif($mov->type == 'purchase') COMPRA
                        @elseif($mov->type == 'expense') GASTO
                        @endif
                    </td>
                    <td class="text-right">
                        {{ in_array($mov->type, ['expense', 'purchase']) ? '-' : '+' }}{{ number_format($mov->amount, 2) }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" class="text-center">No hay movimientos registrados.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Firmas -->
    <!-- Firmas -->
    <div class="footer" style="margin-top: 50px;">
        <table width="100%">
            <tr>
                <td width="40%" align="center">
                    <br><br><br>
                    <div style="border-top: 1px solid #000; width: 80%; margin: 0 auto; padding-top: 5px;">
                        Firma del Cajero
                    </div>
                </td>
                <td width="20%"></td>
                <td width="40%" align="center">
                    <br><br><br>
                    <div style="border-top: 1px solid #000; width: 80%; margin: 0 auto; padding-top: 5px;">
                        Firma del Supervisor
                    </div>
                </td>
            </tr>
        </table>
        <br>
        <p style="font-size: 9px; color: #555; text-align: center;">Generado el {{ date('d/m/Y H:i:s') }} - ID: {{ $register->id }}</p>
    </div>

</body>
</html>
