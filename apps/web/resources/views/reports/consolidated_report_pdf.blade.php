<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Reporte Consolidado de Ventas y Caja</title>
    <style>
        body { font-family: "DejaVu Sans", Arial, sans-serif; font-size: 11px; color: #111827; }
        .header { border-bottom: 2px solid #111827; padding-bottom: 10px; margin-bottom: 16px; }
        .header h1 { margin: 0; font-size: 17px; text-transform: uppercase; }
        .meta { margin-top: 6px; font-size: 10px; color: #4b5563; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: left; }
        th { background-color: #f3f4f6; font-weight: bold; font-size: 10px; text-transform: uppercase; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .positive { color: #059669; font-weight: bold; }
        .negative { color: #dc2626; font-weight: bold; }
        .hash-box { margin-top: 24px; padding: 8px; border: 1px dashed #9ca3af; font-size: 9px; color: #4b5563; word-break: break-all; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Reporte Consolidado de Ventas y Rendicion de Caja</h1>
        <div class="meta">
            <strong>Owens Argentina</strong> &nbsp;|&nbsp;
            <strong>Periodo:</strong> {{ \Carbon\Carbon::parse($date_from)->format('d/m/Y') }} al {{ \Carbon\Carbon::parse($date_to)->format('d/m/Y') }} &nbsp;|&nbsp;
            <strong>Emitido por:</strong> {{ $generatedBy }} ({{ $generatedAt }})
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th colspan="2">Resumen Financiero del Periodo</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Ventas Totales ({{ $salesCount }} operaciones)</td>
                <td class="text-right">${{ number_format($sales, 2, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Gastos Operativos</td>
                <td class="text-right negative">-${{ number_format($expenses, 2, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Compras de Inventario</td>
                <td class="text-right negative">-${{ number_format($purchases, 2, ',', '.') }}</td>
            </tr>
            <tr>
                <td><strong>Resultado Neto Consolidado</strong></td>
                <td class="text-right {{ $netProfit >= 0 ? 'positive' : 'negative' }}">
                    ${{ number_format($netProfit, 2, ',', '.') }}
                </td>
            </tr>
        </tbody>
    </table>

    @if(!empty($salesBreakdown))
    <table>
        <thead>
            <tr>
                <th>Desglose de Ventas por Metodo de Pago</th>
                <th class="text-right">Importe</th>
            </tr>
        </thead>
        <tbody>
            @foreach($salesBreakdown as $method => $amount)
                <tr>
                    <td style="text-transform: uppercase;">{{ $method }}</td>
                    <td class="text-right">${{ number_format($amount, 2, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Responsable</th>
                <th>Cierre</th>
                <th class="text-right">Apertura</th>
                <th class="text-right">Esperado</th>
                <th class="text-right">Declarado</th>
                <th class="text-right">Diferencia</th>
            </tr>
        </thead>
        <tbody>
            @forelse($closures as $c)
                <tr>
                    <td class="text-center">#{{ $c['id'] }}</td>
                    <td>{{ $c['user'] }}</td>
                    <td>{{ \Carbon\Carbon::parse($c['closed_at'])->format('d/m/Y H:i') }}</td>
                    <td class="text-right">${{ number_format($c['opening_amount'], 2, ',', '.') }}</td>
                    <td class="text-right">${{ number_format($c['expected_balance'], 2, ',', '.') }}</td>
                    <td class="text-right">${{ number_format($c['closing_amount'], 2, ',', '.') }}</td>
                    <td class="text-right {{ $c['difference'] < 0 ? 'negative' : ($c['difference'] > 0 ? 'positive' : '') }}">
                        ${{ number_format($c['difference'], 2, ',', '.') }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center">No se registraron cierres de caja en el periodo.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="hash-box">
        <strong>Sello de Integridad (SHA-256):</strong> {{ $integrityHash }}
    </div>
</body>
</html>
