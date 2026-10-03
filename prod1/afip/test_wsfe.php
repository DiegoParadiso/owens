<?php

/**
 * Script de Simulación AFIP (WSFE)
 * Verifica que el Token y Sign sean válidos para Facturación.
 */

// Configuración
$cuity = "20453390153";
$token = file_get_contents(__DIR__ . '/token.txt');
$sign = file_get_contents(__DIR__ . '/sign.txt');
$url = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL";

// Punto de Venta y Tipo de Comprobante (1 = Factura A, 6 = Factura B, 11 = Factura C)
$puntoVenta = 1; 
$tipoComprobante = 11;

echo "--- Iniciando Simulación AFIP WSFE (Sin SoapClient) ---\n";
echo "Pto Vta: $puntoVenta | Tipo Cbte: $tipoComprobante\n";

try {
    // Simulamos la lógica del nuevo AfipService
    function callSoap($url, $method, $params) {
        $xmlParams = arrayToXml($params);
        $soapXml = <<<XML
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gov.afip.dif.FEV1/">
   <soapenv:Header/>
   <soapenv:Body>
      <ar:{$method}>
         {$xmlParams}
      </ar:{$method}>
   </soapenv:Body>
</soapenv:Envelope>
XML;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $soapXml);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: text/xml; charset=utf-8',
            'SOAPAction: "http://ar.gov.afip.dif.FEV1/' . $method . '"'
        ]);

        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
    }

    function arrayToXml($array) {
        $xml = "";
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $xml .= "<ar:$key>" . arrayToXml($value) . "</ar:$key>";
            } else {
                $xml .= "<ar:$key>$value</ar:$key>";
            }
        }
        return $xml;
    }

    $params = [
        'Auth' => [
            'Token' => $token,
            'Sign'  => $sign,
            'Cuit'  => $cuity
        ],
        'PtoVta'   => $puntoVenta,
        'CbteTipo' => $tipoComprobante
    ];

    echo "1. Consultando último comprobante autorizado...\n";
    $response = callSoap($url, 'FECompUltimoAutorizado', $params);
    
    if (strpos($response, 'CbteNro') !== false) {
        preg_match('/<CbteNro>(.*?)<\/CbteNro>/', $response, $matches);
        echo "[SUCCESS] El último número autorizado es: " . ($matches[1] ?? 'N/A') . "\n";
        echo "¡La integración funciona SIN depender de SoapClient!\n";
    } else {
        echo "[ERROR AFIP] No se pudo obtener el número. Respuesta:\n" . $response . "\n";
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
