<?php

namespace App\Services;

use App\Models\Product;

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
        if ($product->stock < $quantity) {
             throw new Exception("Stock insuficiente para: " . $product->name . " (Disponible: " . $product->stock . ", Solicitado: " . $quantity . ")");
        }
        $product->decrement('stock', $quantity);
    }

    public function restoreStock(Product $product, float $quantity)
    {
        $product->increment('stock', $quantity);
    }
}
