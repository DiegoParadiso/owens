<?php

namespace App\Services;

use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Milon\Barcode\Facades\DNS1DFacade;

class BarcodeService
{
    /**
     * Generate barcode for a product
     */
    public function generateBarcode(Product $product): string
    {
        return DNS1DFacade::getBarcodeSVG(
            (string) $product->id,
            'C128',
            2,
            50
        );
    }

    /**
     * Generate PDF label with barcode
     */
    public function generateLabelPdf(Product $product): \Barryvdh\DomPDF\PDF
    {
        $barcode = $this->generateBarcode($product);
        
        $data = [
            'product' => $product,
            'barcode' => $barcode,
        ];
        
        return Pdf::loadView('admin.product.printlabel', $data)
            ->setPaper([0, 0, 226.77, 141.73], 'portrait'); // 80mm x 50mm label size
    }
}


