<?php
use App\Models\Product;

$p = Product::where('name', 'LIKE', '%American Simples%')->first();

if ($p) {
    echo "Product Found: {$p->name}\n";
    echo "ID: {$p->id}\n";
    echo "Type: {$p->type}\n";
    echo "Category: {$p->category}\n";
    echo "Stock: {$p->stock}\n";
    echo "Created At: {$p->created_at}\n";
    echo "Usage Unit: {$p->usage_unit}\n";
} else {
    echo "Product Not Found.\n";
}
