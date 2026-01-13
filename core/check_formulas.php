<?php

use App\Models\Product;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$categories = Product::select('category')->distinct()->pluck('category')->toArray();
echo "Existing Categories: " . implode(', ', $categories) . "\n";
