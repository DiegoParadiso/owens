<?php

/**
 * Script de Autenticación AFIP (WSAA)
 * Automatiza el flujo de obtención de Token y Sign.
 */

// Configuración de rutas
$baseDir = __DIR__;
$certFile = $baseDir . '/certificado.crt';
$keyFile = $baseDir . '/privada.key';
$tokenFile = $baseDir . '/token.txt';
$signFile = $baseDir . '/sign.txt';
$traXmlFile = $baseDir . '/tra.xml';
$traCmsFile = $baseDir . '/login.cms';
$responseFile = $baseDir . '/response.xml';

// URL de WSAA (Homologación por defecto)
$url = "https://wsaahomo.afip.gov.ar/ws/services/LoginCms";

echo "--- Iniciando Autenticación AFIP WSAA ---\n";

// 1. Generar timestamps correctos (Local con offset -03:00, 10 min de margen)
$dateGen = date("Y-m-d\TH:i:sP", time() - 600); // "P" añade el offset (+00:00)
$dateExp = date("Y-m-d\TH:i:sP", time() + 600);
$uniqueId = time();
echo "   Timestamps (Local): $dateGen -> $dateExp\n";

// 2. Crear TRA.xml
$traXml = <<<XML
<loginTicketRequest version="1.0">
  <header>
    <uniqueId>{$uniqueId}</uniqueId>
    <generationTime>{$dateGen}</generationTime>
    <expirationTime>{$dateExp}</expirationTime>
  </header>
  <service>wsfe</service>
</loginTicketRequest>
XML;

file_put_contents($traXmlFile, $traXml);
echo "1. TRA.xml generado.\n";

// 3. Firmar (CMS / PKCS#7)
// AFIP requiere formato DER y no-detach. 
// Usamos shell_exec para garantizar paridad 1:1 con el comando que ya te funciona.
echo "2. Firmando TRA.xml con openssl...\n";
$cmd = "openssl smime -sign -signer " . escapeshellarg($certFile) . " -inkey " . escapeshellarg($keyFile) . " -in " . escapeshellarg($traXmlFile) . " -out " . escapeshellarg($traCmsFile) . " -outform DER -nodetach 2>&1";
$output = shell_exec($cmd);

if (!file_exists($traCmsFile) || filesize($traCmsFile) === 0) {
    die("ERROR al firmar: " . $output);
}

// 4. Convertir a base64
$cmsBinary = file_get_contents($traCmsFile);
$cmsFinalBase64 = base64_encode($cmsBinary);
echo "   CMS generado y convertido a Base64.\n";

// 5. Armar request SOAP
$soapRequest = <<<XML
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsaa="http://wsaa.view.sua.dvadac.desein.afip.gov">
   <soapenv:Header/>
   <soapenv:Body>
      <wsaa:loginCms>
         <wsaa:in0>{$cmsFinalBase64}</wsaa:in0>
      </wsaa:loginCms>
   </soapenv:Body>
</soapenv:Envelope>
XML;

// 6. Llamar WSAA via cURL
echo "3. Llamando a WSAA (AFIP)...\n";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $soapRequest);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: text/xml; charset=utf-8',
    'SOAPAction: ""'
]);

$responseXml = curl_exec($ch);
if (curl_errno($ch)) {
    die("ERROR en cURL: " . curl_error($ch));
}
curl_close($ch);

file_put_contents($responseFile, $responseXml);

// 7 & 8. Extraer token y sign
echo "4. Procesando respuesta...\n";
// Decodificar entidades HTML si vienen escapadas
$cleanXml = html_entity_decode($responseXml);

// Intentar extraer vía Regex (más directo si el XML viene con namespaces complejos o escapado)
preg_match('/<token>(.*?)<\/token>/', $cleanXml, $tokenMatches);
preg_match('/<sign>(.*?)<\/sign>/', $cleanXml, $signMatches);

if (!empty($tokenMatches[1]) && !empty($signMatches[1])) {
    file_put_contents($tokenFile, $tokenMatches[1]);
    file_put_contents($signFile, $signMatches[1]);
    echo "\n[RESULTADO] SUCCESS: Token y Sign actualizados exitosamente.\n";
    echo "Files: token.txt, sign.txt\n";
} else {
    echo "\n[ERROR] No se pudo extraer Token o Sign de la respuesta.\n";
    echo "RAW RESPONSE:\n" . $responseXml . "\n";
    echo "Revisa 'afip/response.xml' para ver el mensaje de error de AFIP.\n";
    die();
}

// Limpieza opcional (Comentada para debug)
// @unlink($traXmlFile);
// @unlink($traCmsFile);
// @unlink($responseFile);
