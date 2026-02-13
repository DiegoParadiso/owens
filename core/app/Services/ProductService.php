<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductComponent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class ProductService
{
    /**
     * Create a new product
     */
    public function createProduct(array $data): Product
    {
        $data['user_id'] = Auth::id();
        $data['type'] = $data['type'] ?? 'single';
        
        return Product::create($data);
    }

    /**
     * Update an existing product
     */
    public function updateProduct(Product $product, array $data): bool
    {
        $data['user_id'] = Auth::id();
        
        return $product->update($data);
    }

    /**
     * Delete a product
     */
    public function deleteProduct(Product $product): bool
    {
        try {
            return $product->delete();
        } catch (QueryException $e) {
            if ($e->getCode() == '23000') {
                throw new \Exception('El producto no se puede eliminar porque está registrado en transacciones de venta.');
            }
            throw $e;
        }
    }

    /**
     * Add stock to a product
     */
    public function addStock(Product $product, float $quantity): Product
    {
        $product->stock += $quantity;
        $product->save();
        
        return $product;
    }

    /**
     * Create a combo product with components
     */
    public function createCombo(array $data, array $components): Product
    {
        DB::beginTransaction();
        
        try {
            $data['user_id'] = Auth::id();
            $data['type'] = 'combo';
            $data['stock'] = 0; // Combos don't have stock
            
            $combo = Product::create($data);
            
            foreach ($components as $component) {
                ProductComponent::create([
                    'parent_product_id' => $combo->id,
                    'child_product_id' => $component['product_id'],
                    'quantity' => $component['quantity'],
                ]);
            }
            
            DB::commit();
            
            return $combo;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Check if product has sufficient stock
     */
    public function hasSufficientStock(Product $product, float $quantity): bool
    {
        if ($product->type === 'combo') {
            foreach ($product->components as $component) {
                $requiredQty = $component->quantity * $quantity;
                if ($component->childProduct->stock < $requiredQty) {
                    return false;
                }
            }
            return true;
        }
        
        return $product->stock >= $quantity;
    }

    /**
     * Deduct stock from product
     */
    public function deductStock(Product $product, float $quantity): void
    {
        if ($product->type === 'combo') {
            foreach ($product->components as $component) {
                $requiredQty = $component->quantity * $quantity;
                $component->childProduct->stock -= $requiredQty;
                $component->childProduct->save();
            }
        } else {
            $product->stock -= $quantity;
            $product->save();
        }
    }
}



