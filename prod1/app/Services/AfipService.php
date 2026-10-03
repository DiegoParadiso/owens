<?php

namespace App\Services;

use Exception;
use SoapClient;

class AfipService
{
    protected $cuity;
    protected $token;
    protected $sign;
    protected $wsfe_url;

    public function __construct()
    {
        $this->cuity = "20453390153"; // CUIT proporcionado por el usuario
        $this->wsfe_url = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL";
        $this->loadTokens();
    }

    /**
     * Carga el token y sign desde los archivos generados por WSAA.
     */
    protected function loadTokens()
    {
        $tokenPath = base_path('afip/token.txt');
        $signPath = base_path('afip/sign.txt');

        if (!file_exists($tokenPath) || !file_exists($signPath)) {
            throw new Exception("Token o Sign de AFIP no encontrados. Ejecuta la autenticación primero.");
        }

        $this->token = file_get_contents($tokenPath);
        $this->sign = file_get_contents($signPath);
    }

    /**
     * Realiza una llamada SOAP cruda usando CURL (sin depender de SoapClient).
     */
    protected function callSoap($method, $params)
    {
        $xml = $this->buildSoapEnvelope($method, $params);
        
        $ch = curl_init($this->wsfe_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: text/xml; charset=utf-8',
            'SOAPAction: "http://ar.gov.afip.dif.FEV1/' . $method . '"'
        ]);

        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            throw new Exception("Error CURL: " . curl_error($ch));
        }
        curl_close($ch);

        return $this->parseSoapResponse($method, $response);
    }

    /**
     * Construye un sobre SOAP básico.
     */
    protected function buildSoapEnvelope($method, $params)
    {
        $xmlParams = $this->arrayToXml($params);
        return <<<XML
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gov.afip.dif.FEV1/">
   <soapenv:Header/>
   <soapenv:Body>
      <ar:{$method}>
         {$xmlParams}
      </ar:{$method}>
   </soapenv:Body>
</soapenv:Envelope>
XML;
    }

    /**
     * Convierte un array asociativo a fragmentos XML (recursivo simple).
     */
    protected function arrayToXml($array)
    {
        $xml = "";
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $xml .= "<ar:$key>" . $this->arrayToXml($value) . "</ar:$key>";
            } else {
                $xml .= "<ar:$key>$value</ar:$key>";
            }
        }
        return $xml;
    }

    /**
     * Parsea la respuesta SOAP usando SimpleXML.
     */
    protected function parseSoapResponse($method, $response)
    {
        $cleanXml = str_ireplace(['soap:', 'soapenc:', 'ar:', 'xmlns:'], '', $response);
        $xmlObj = simplexml_load_string($cleanXml);
        
        $resultField = "{$method}Result";
        $body = $xmlObj->Body->{$method . "Response"}->$resultField;

        if (isset($body->Errors)) {
            throw new Exception("Error AFIP: " . (string)$body->Errors->Err->Msg);
        }

        return $body;
    }

    /**
     * Obtiene el último comprobante autorizado.
     */
    public function getLastVoucher($puntoVenta, $tipoComprobante)
    {
        $params = [
            'Auth' => [
                'Token' => $this->token,
                'Sign'  => $this->sign,
                'Cuit'  => $this->cuity
            ],
            'PtoVta'   => $puntoVenta,
            'CbteTipo' => $tipoComprobante
        ];

        $result = $this->callSoap('FECompUltimoAutorizado', $params);
        return (int) $result->CbteNro;
    }

    /**
     * Solicita un CAE para una factura.
     */
    public function requestCAE($data)
    {
        $params = [
            'Auth' => [
                'Token' => $this->token,
                'Sign'  => $this->sign,
                'Cuit'  => $this->cuity
            ],
            'FeCAEReq' => [
                'FeCabReq' => [
                    'CantReg'  => 1,
                    'PtoVta'   => $data['puntoVenta'],
                    'CbteTipo' => $data['tipoComprobante']
                ],
                'FeDetReq' => [
                    'FECAEDetRequest' => [
                        'Concepto'    => 1,
                        'DocTipo'     => $data['docTipo'],
                        'DocNro'      => $data['docNro'],
                        'CbteDesde'   => $data['cbteNro'],
                        'CbteHasta'   => $data['cbteNro'],
                        'CbteFch'     => date('Ymd'),
                        'CondicionIVAReceptorId' => 5, // Consumidor Final (Requisito AFIP RG 5616)
                        'ImpTotal'    => round($data['total'], 2),
                        'ImpTotConc'  => 0,
                        'ImpNeto'     => round($data['total'], 2), // Factura C no separa IVA
                        'ImpOpEx'     => 0,
                        'ImpTrib'     => 0,
                        'ImpIVA'      => 0, // Factura C no lleva IVA
                        'MonId'       => 'PES',
                        'MonCotiz'    => 1,
                        // El objeto Iva NO debe enviarse en Factura C
                    ]
                ]
            ]
        ];

        $result = $this->callSoap('FECAESolicitar', $params);
        return $result->FeDetResp->FECAEDetResponse;
    }
}
