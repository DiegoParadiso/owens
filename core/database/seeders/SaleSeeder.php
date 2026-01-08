<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SaleSeeder extends Seeder
{
    public function run()
    {
        // Ensure we have a user
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        // Create some dummy products if none exist
        if (Product::count() < 5) {
            $products = [
                ['name' => 'Hamburguesa Clásica', 'price' => 15000, 'cost' => 8000, 'stock' => 100, 'type' => 'single'],
                ['name' => 'Papas Fritas', 'price' => 8000, 'cost' => 3000, 'stock' => 200, 'type' => 'single'],
                ['name' => 'Gaseosa 500ml', 'price' => 5000, 'cost' => 2500, 'stock' => 150, 'type' => 'single'],
                ['name' => 'Hot Dog Especial', 'price' => 12000, 'cost' => 6000, 'stock' => 80, 'type' => 'single'],
                ['name' => 'Pizza Personal', 'price' => 18000, 'cost' => 9000, 'stock' => 50, 'type' => 'single'],
            ];

            foreach ($products as $prod) {
                Product::create(array_merge($prod, ['user_id' => $user->id]));
            }
        }

        $products = Product::all();
        $paymentMethods = ['cash', 'debit_card', 'credit_card', 'transfer', 'qr'];

        // Generate sales for the last 7 days + today
        for ($i = 0; $i <= 7; $i++) {
            $date = Carbon::now()->subDays($i);
            
            // Random number of sales per day (3 to 8)
            $salesCount = rand(3, 8);

            for ($j = 0; $j < $salesCount; $j++) {
                DB::transaction(function () use ($user, $products, $date, $paymentMethods) {
                    // Create Sale
                    $sale = Sale::create([
                        'sale_date' => $date->copy()->setTime(rand(9, 22), rand(0, 59)),
                        'total_price' => 0, // Will update later
                        'user_id' => $user->id,
                        'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                    ]);

                    $totalPrice = 0;
                    
                    // Add 1-4 items per sale
                    $itemsCount = rand(1, 4);
                    for ($k = 0; $k < $itemsCount; $k++) {
                        $product = $products->random();
                        $quantity = rand(1, 3);
                        $subtotal = $product->price * $quantity;

                        SaleDetail::create([
                            'sale_id' => $sale->id,
                            'product_id' => $product->id,
                            'quantity' => $quantity,
                            'price' => $product->price,
                            'subtotal' => $subtotal,
                        ]);

                        $totalPrice += $subtotal;
                    }

                    // Update sale total
                    $sale->update(['total_price' => $totalPrice]);
                });
            }
        }
    }
}
