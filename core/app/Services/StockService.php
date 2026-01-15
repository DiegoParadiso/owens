<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductComponent;
use Exception;

class StockService
{
    /**
     * Add stock to a product and update its weighted average cost.
     *
     * @param Product $product
     * @param float $quantity Quantity in PURCHASE UNITS (if applicable) or usage units
     * @param float $unitCost Cost per UNIT provided in $quantity
     * @return void
     */
    public function addStock(Product $product, float $quantity, float $unitCost)
    {
        $conversionFactor = $product->conversion_factor ?? 1;
        
        // If the quantity is in purchase units (e.g., boxes), convert to usage units (e.g., grams)
        // But the calling controller usually handles the "quantity" meaning.
        // In PurchaseController, $qty is Purchase Units.
        // In ProductController::addStock, $qty is usually "generic" (assumed usage units if no complex logic, but let's check).
        // Let's stick to the PurchaseController logic: Inputs are typically "Purchase Units".
        
        // However, to be safe and generic, we should probably accept "Usage Units".
        // But PurchaseController calculates everything based on Purchase Units.
        
        // Let's standarize: The input quantity is strictly in USAGE UNITS.
        // The caller must convert "Boxes" to "Grams" before calling this if they want to add "Grams".
        // WAIT. PurchaseController does: $qtyInUsageUnits = $qty * $conversionFactor;
        // So for PurchaseController, it sends "packs".
        
        // Let's make this method accept $quantity (raw input) and $conversionFactor explicit?
        // No, let's just make the caller do the math for "quantity added to stock (usage units)".
        
        // Revised Signature:
        // addStock(Product $product, float $addedUsageUnits, float $totalCostOfAddedStock)
        
        // But we need to calculate unit cost.
        // $newCost = (($currentStock * $currentCost) + ($addedUsageUnits * $costPerUsageUnit)) / $newStock;
    }

    /**
     * Update product stock and weighted average cost.
     * 
     * @param Product $product
     * @param float $qtyInUsageUnits The quantity to add in usage units (base units).
     * @param float $totalCost The total cost of this quantity.
     */
    public function updateStockAndCost(Product $product, float $qtyInUsageUnits, float $totalCost)
    {
        $currentStock = $product->stock;
        $currentCost = $product->cost ?? 0;
        
        $newStock = $currentStock + $qtyInUsageUnits;
        
        // Calculate Cost Per Unit of the new batch
        $costPerUsageUnit = ($qtyInUsageUnits != 0) ? ($totalCost / $qtyInUsageUnits) : 0;

        if ($newStock > 0) {
            // Weighted Average Cost
            $newCost = (($currentStock * $currentCost) + $totalCost) / $newStock;
        } else {
            // Fallback if stock is zero/negative (shouldn't happen on add, but possible)
            $newCost = $costPerUsageUnit;
        }

        $product->update([
            'stock' => $newStock,
            'cost' => $newCost,
        ]);
    }

    /**
     * Process stock deduction or restoration recursively.
     * 
     * @param Product $product
     * @param float $quantity
     * @param string $action 'deduct' or 'restore'
     * @throws Exception
     */
    public function processStock(Product $product, float $quantity, string $action = 'deduct')
    {
        if ($action === 'deduct') {
            $this->deductStock($product, $quantity);
        } else {
            $this->restoreStock($product, $quantity);
        }
    }

    public function deductStock(Product $product, float $quantity)
    {
        // Recursion for components (Combos, Burgers with recipes)
        if ($product->components && $product->components->count() > 0) {
             // If it has components, we deduct the components, NOT the main product stock usually.
             // UNLESS the main product ALSO has stock.
             // Logic from SalesController:
             // 1. Try to take from main product stock first.
             // 2. If not enough, take remainder from components.
             
            $stockToDeduct = 0;
            $remainingQty = $quantity;

            if ($product->stock > 0) {
                if ($product->stock >= $quantity) {
                    $stockToDeduct = $quantity;
                    $remainingQty = 0;
                } else {
                    $stockToDeduct = $product->stock;
                    $remainingQty = $quantity - $product->stock;
                }
            }
            
            if ($stockToDeduct > 0) {
                $product->decrement('stock', $stockToDeduct);
            }

            if ($remainingQty > 0) {
                foreach ($product->components as $component) {
                    if (!$component->childProduct) continue;
                    
                    $componentQty = $component->quantity * $remainingQty;
                    $this->deductStock($component->childProduct, $componentQty);
                }
            }

        } else {
            // Simple product (or supply) - just deduct
            // Validation: logic from SalesController threw exception if insufficient.
            // But we might want to allow negative stock? Conflicting reqs?
            // SalesController said: "Strictly fail if no stock ... unless forced".
            // Let's keep strict for now.
            
            // Wait, standard behavior for "Product" (Single) without components is simple deduction.
            // Even if stock goes negative? The SalesController had a check: 
            // if ($remainingQty > 0.001) throw Exception.
            
            // But wait, if it's a "Simple" product and stock is 0, we can't sell it?
            // SalesController: 
            // $products = Product::where('stock', '>', 0)...
            // So seemingly we only sell what we have.
            
            if ($product->stock < $quantity) {
                 // But wait, what if we have 5, sell 10? 
                 // SalesController logic:
                 // "if ($remainingQty > 0.001) throw" Only if NO COMPONENTS were found to cover it.
                 // So yes, strictly fail.
                 
                 throw new Exception("Stock insuficiente para: " . $product->name . " (Disponible: " . $product->stock . ", Solicitado: " . $quantity . ")");
            }
            
            $product->decrement('stock', $quantity);
        }
    }

    public function restoreStock(Product $product, float $quantity)
    {
        // Restore logic depends on Category
        if (in_array($product->category, ['burger', 'extra', 'combo'])) {
            if ($product->components && $product->components->count() > 0) {
                foreach ($product->components as $component) {
                    if (!$component->childProduct) continue;
                    $componentQty = $component->quantity * $quantity;
                    $this->restoreStock($component->childProduct, $componentQty);
                }
            } else {
                // Return to stock if no components (fallback)
                $product->increment('stock', $quantity);
            }
        } else {
            // Supplies, Drinks, etc.
            $product->increment('stock', $quantity);
        }
    }
}
