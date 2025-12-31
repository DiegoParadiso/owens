<?php

namespace App\Services;

use App\Models\Purchase;
use App\Models\PurchaseDetail;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PurchaseService
{
    /**
     * Create a new purchase with details
     */
    public function createPurchase(array $purchaseData, array $products): Purchase
    {
        DB::beginTransaction();
        
        try {
            // Calcular costo total
            $totalCost = 0;
            foreach ($products as $productData) {
                $totalCost += $productData['quantity'] * $productData['unit_cost'];
            }
            
            $purchase = Purchase::create([
                'supplier_id' => $purchaseData['supplier_id'],
                'date' => $purchaseData['date'],
                'total_cost' => $totalCost,
                'user_id' => Auth::id(),
            ]);
            
            // Crear detalles de compra y actualizar stock de producto
            foreach ($products as $productData) {
                PurchaseDetail::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $productData['product_id'],
                    'quantity' => $productData['quantity'],
                    'unit_cost' => $productData['unit_cost'],
                    'total_cost' => $productData['quantity'] * $productData['unit_cost'],
                ]);
                
                // Actualizar stock y costo del producto
                $product = Product::find($productData['product_id']);
                $product->stock += $productData['quantity'];
                $product->cost = $productData['unit_cost'];
                $product->save();
            }
            
            DB::commit();
            
            return $purchase->load('purchaseDetails.product', 'supplier');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}


