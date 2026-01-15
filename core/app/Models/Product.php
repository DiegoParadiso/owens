<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model // Changed class name from Produk to Product
{
    use HasFactory; // Added this line

    protected $table = 'products'; // Added this line

    protected $fillable = [
        'name', // Changed from 'Nama' to 'name'
        'price', // Changed from 'Harga' to 'price'
        'stock', // Changed from 'Stok' to 'stock'
        'cost', // Changed from 'cost_price' to 'cost'
        'type',
        'category',
        'purchase_unit',
        'usage_unit',
        'conversion_factor',
        'base_unit',
        'usage_factor',
        'user_id' // Changed from 'Users_id' to 'user_id'
    ];

    public function saleDetails() // Changed method name from detailPenjualans to saleDetails
    {
        return $this->hasMany(SaleDetail::class, 'product_id', 'id'); // Changed DetailPenjualan to SaleDetail and ProdukId to product_id
    }

    public function components()
    {
        return $this->hasMany(ProductComponent::class, 'parent_product_id');
    }

    public function purchaseDetails()
    {
        return $this->hasMany(PurchaseDetail::class, 'product_id');
    }

    /**
     * Calculate current cost.
     * If product has direct cost (Supply), return it.
     * If product is a Menu Item (Burger) with 0 cost but has components, calculate from ingredients.
     */
    public function getCurrentCost()
    {
        if ($this->cost > 0) {
            return $this->cost;
        }

        // Calculate from recipe
        // Load components if not loaded
        if ($this->relationLoaded('components') || $this->components()->exists()) {
            $totalCost = 0;
            foreach ($this->components as $component) {
                if ($component->childProduct) {
                    $totalCost += $component->quantity * $component->childProduct->getCurrentCost();
                }
            }
            return $totalCost;
        }

        return 0;
    }
}
