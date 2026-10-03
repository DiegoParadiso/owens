<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\AfipService;

try {
    echo "--- Iniciando Test de Factura (FECAESolicitar) ---\n";
    $afip = new AfipService();
    
    $puntoVenta = 1; 
    $tipoCbte = 11; // Factura C
    
    // Obtener el ultimo comprobante
    $lastNro = $afip->getLastVoucher($puntoVenta, $tipoCbte);
    $nextNro = $lastNro + 1;
    echo "Ultimo Nro: $lastNro | Proximo a solicitar: $nextNro\n";
    
    $afipData = [
        'puntoVenta'     => $puntoVenta,
        'tipoComprobante' => $tipoCbte,
        'cbteNro'        => $nextNro,
        'docTipo'        => 99, // Consumidor Final
        'docNro'         => 0,
        'total'          => 1500.50
    ];
    
    $response = $afip->requestCAE($afipData);
    
    echo "Resultado de AFIP: " . $response->Resultado . "\n";
    
    if ($response->Resultado === 'A') {
        echo "Exito! CAE: " . $response->CAE . "\n";
    } else {
        echo "RECHAZADO.\n";
        print_r($response);
    }

} catch (\Exception $e) {
    echo "EXCEPCION: " . $e->getMessage() . "\n";
}
