
try {
    echo "Testing Product relationship...\n";
    $products = \App\Models\Product::where('type', 'combo')->with('components.childProduct')->get();
    echo "Loaded " . $products->count() . " combos.\n";
    
    foreach ($products as $product) {
        echo "Combo: " . $product->name . "\n";
        foreach ($product->components as $component) {
            echo " - Component: " . ($component->childProduct ? $component->childProduct->name : 'NULL') . "\n";
        }
    }
    echo "Success!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
