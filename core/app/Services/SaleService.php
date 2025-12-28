<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Product;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SaleService
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Create a new sale with details
     */
    public function createSale(array $saleData, array $products): Sale
    {
        DB::beginTransaction();
        
        try {
            $saleData['sale_date'] = now();
            $saleData['user_id'] = Auth::id();
            
            $sale = Sale::create($saleData);
            
            foreach ($products as $productData) {
                $product = Product::find($productData['product_id']);
                $quantity = $productData['quantity'];
                
                // Check stock availability
                if (!$this->productService->hasSufficientStock($product, $quantity)) {
                    DB::rollBack();
                    throw new \Exception('Stock insuficiente para el producto: ' . $product->name);
                }
                
                // Deduct stock
                $this->productService->deductStock($product, $quantity);
                
                // Create sale detail
                SaleDetail::create([
                    'sale_id' => $sale->id,
                    'product_id' => $productData['product_id'],
                    'price' => $productData['price'],
                    'quantity' => $quantity,
                    'subtotal' => $productData['subtotal'],
                ]);
            }
            
            DB::commit();
            
            return $sale->load('saleDetails.product');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Process cash payment for a sale
     */
    public function processCashPayment(Sale $sale, float $amountPaid): Payment
    {
        if ($amountPaid < $sale->total_price) {
            throw new \Exception('El monto pagado debe ser mayor o igual al total de la venta.');
        }
        
        return Payment::create([
            'sale_id' => $sale->id,
            'amount_paid' => $amountPaid,
            'change' => $amountPaid - $sale->total_price,
            'payment_status' => 'paid',
            'payment_method' => 'cash',
        ]);
    }
}

