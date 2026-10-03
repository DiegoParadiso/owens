<?php

return [
    'business_name' => env('AFIP_BUSINESS_NAME', 'OWENS'),
    'business_address' => env('AFIP_BUSINESS_ADDRESS', 'Calle Falsa 123, Buenos Aires'),
    'business_cuit' => env('AFIP_BUSINESS_CUIT', '20453390153'),
    'business_iva' => env('AFIP_BUSINESS_IVA', 'Responsable Inscripto'),
    'business_iibb' => env('AFIP_BUSINESS_IIBB', '20453390153'),
    'business_start_date' => env('AFIP_BUSINESS_START_DATE', '01/01/2024'),
    'punto_venta' => env('AFIP_PUNTO_VENTA', 1),
    'service_url' => env('AFIP_URL', 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL'),
];
