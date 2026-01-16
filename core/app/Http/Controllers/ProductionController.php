<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\LogStock;
use App\Models\ProductComponent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProductionController extends Controller
{
    /**
     * Display the Kitchen View for Production.
     */
    public function index()
    {
        $title = 'Producción';
        // Filter products that can be produced:
        // Must NOT be 'burger', 'combo' categories (menu items).
        // Must be 'supply' type or 'single' (like sauces sold separately).
        // Convention: Items that are recipes/intermediate usually have components but are not main menu items.
        // Let's enable production for ANY product that is NOT burger/combo/extra, so basically 'supply' type or category 'other'.
        
        $products = Product::whereIn('category', ['production_formula', 'burger']) // Only Formulas and Burgers
                           ->get()
                           ->map(function ($product) {
                               return [
                                   'id' => $product->id,
                                   'name' => $product->name,
                                   'stock' => $product->stock,
                                   'usage_unit' => $product->usage_unit,
                                   'batch_yield' => $product->batch_yield, // Pass yield to frontend
                                   'components' => $product->components->map(function ($comp) {
                                       return [
                                           'id' => $comp->id,
                                           'name' => $comp->childProduct->name ?? '?',
                                           'quantity' => $comp->quantity,
                                           'unit' => $comp->childProduct->usage_unit ?? '',
                                           'stock' => $comp->childProduct->stock ?? 0
                                       ];
                                   }),
                                   // Calculate max producible based on ingredients
                                   'max_producible' => $this->calculateMaxProducible($product)
                               ];
                           });

        // Get Recent History
        // Fetch last 10 log entries of type 'production'
        // Assuming we added 'type' column to log_stocks or using description. 
        // User requested adding 'type' and 'description' to log_stocks migrated in previous steps.
        // If the migration was reverted, we might need to be careful with 'type' column.
        // I will assume for now we will restore the migration changes too.
        
        try {
            $history = LogStock::where('log_stocks.type', 'production')
                ->join('products', 'log_stocks.product_id', '=', 'products.id')
                ->join('users', 'log_stocks.user_id', '=', 'users.id')
                ->select(
                    'log_stocks.id',
                    'log_stocks.created_at',
                    'log_stocks.quantity',
                    'log_stocks.description',
                    'products.name as product_name',
                    'users.name as user_name'
                )
                ->orderBy('log_stocks.created_at', 'desc')
                ->take(10)
                ->get();
        } catch (\Exception $e) {
            $history = []; // Fallback if column missing
        }

        return Inertia::render('Production/Index', [
            'title' => $title,
            'products' => $products,
            'history' => $history
        ]);
    }

    private function calculateMaxProducible($product)
    {
        if ($product->components->count() === 0) {
            return 9999; // Represents infinity/no limit by ingredients
        }

        $max = 999999;
        foreach ($product->components as $component) {
            if (!$component->childProduct) continue;
            
            $stock = $component->childProduct->stock;
            $required = $component->quantity;
            
            if ($required > 0) {
                $possible = floor($stock / $required);
                if ($possible < $max) {
                    $max = $possible;
                }
            }
        }
        return $max;
    }

    /**
     * Handle the production process.
     * Deduct ingredients, Add to stock.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.01',
        ]);

        try {
            DB::beginTransaction();

            $product = Product::findOrFail($request->product_id);
            $batches = $request->quantity; // Conceptually "Batches" if yield exists

            // 1. Deduct Ingredients
            foreach ($product->components as $component) {
                if ($component->childProduct) {
                    // Usage is simply Formula Component Qty * Number of Batches
                    $requiredQty = $component->quantity * $batches;
                    $child = $component->childProduct;

                    if ($child->stock < $requiredQty) {
                        throw new \Exception("Stock insuficiente de {$child->name}. Requerido: {$requiredQty}, Disponible: {$child->stock}");
                    }

                    $child->decrement('stock', $requiredQty);
                    
                    // Log usage
                    LogStock::create([
                        'product_id' => $child->id,
                        'quantity' => -$requiredQty, // Negative for deduction
                        'user_id' => Auth::id(),
                        'type' => 'production_ingredient',
                        'description' => "Usado para producir {$batches} lotes de {$product->name}"
                    ]);
                }
            }

            // 2. Add Finished Product to Stock
            // If batch_yield is defined, production = Batches * Yield
            // Otherwise legacy behavior: production = Input Quantity
            $productionQty = ($product->batch_yield && $product->batch_yield > 0) 
                           ? ($batches * $product->batch_yield) 
                           : $batches;

            $product->increment('stock', $productionQty);
            
            // Log production
            LogStock::create([
                'product_id' => $product->id,
                'quantity' => $productionQty,
                'user_id' => Auth::id(),
                'type' => 'production',
                'description' => "Producción de cocina ({$batches} lotes)"
            ]);

            DB::commit();

            return redirect()->back()->with('success', "Producido: {$productionQty} {$product->usage_unit} de {$product->name}");

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function formulas()
    {
        $formulas = Product::where('category', 'production_formula')
            ->with('components.childProduct')
            ->get()
            ->map(function ($f) {
                // Ensure batch_yield is explicit if needed, though default serialization should include it.
                // Just making sure existing frontend logic receives what it expects + new field.
                $f->batch_yield = $f->batch_yield ? (float) $f->batch_yield : null; 
                return $f;
            });

        $supplies = Product::all(); // Ingredients

        return Inertia::render('Production/Formulas', [
            'formulas' => $formulas,
            'supplies' => $supplies
        ]);
    }

    public function storeFormula(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'usage_unit' => 'nullable|string',
            'batch_yield' => 'nullable|numeric|min:0',
            'ingredients' => 'nullable|array',
            'ingredients.*.id' => 'required|exists:products,id',
            'ingredients.*.quantity' => 'required|numeric|min:0.001',
        ]);

        try {
            DB::beginTransaction();

            if ($request->id) {
                $product = Product::findOrFail($request->id);
                $product->update([
                    'name' => $request->name,
                    'usage_unit' => $request->usage_unit,
                    'base_unit' => $request->usage_unit,
                    'batch_yield' => $request->batch_yield, // Save yield
                    'user_id' => Auth::id(),
                ]);
            } else {
                $product = Product::create([
                    'name' => $request->name,
                    'usage_unit' => $request->usage_unit,
                    'type' => 'supply',
                    'category' => 'production_formula',
                    'user_id' => Auth::id(),
                    'stock' => 0,
                    'base_unit' => $request->usage_unit, // Formulas usually defined in their base unit
                    'batch_yield' => $request->batch_yield, // Save yield
                    'conversion_factor' => 1,
                    'usage_factor' => 1,
                    'price' => 0,
                    'purchase_unit' => null,
                ]);
            }

            // Sync ingredients
            $product->components()->delete();
            
            $totalCost = 0;

            if ($request->ingredients) {
                foreach ($request->ingredients as $ing) {
                   ProductComponent::create([
                       'parent_product_id' => $product->id,
                       'child_product_id' => $ing['id'],
                       'quantity' => $ing['quantity']
                   ]);
                   
                   // Calculate simplified cost
                   $child = Product::find($ing['id']);
                   if ($child && $child->cost) {
                       $totalCost += $child->cost * $ing['quantity'];
                   }
                }
            }

            $product->update(['cost' => $totalCost]);

            DB::commit();
            return redirect()->back()->with('success', 'Fórmula guardada correctamente');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error saving formula: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al guardar: ' . $e->getMessage());
        }
    }

    public function destroyFormula($id)
    {
        try {
            DB::beginTransaction();
            $product = Product::findOrFail($id);

            // Ensure it's a formula
            if ($product->category !== 'production_formula') {
                 throw new \Exception('Este producto no es una fórmula.');
            }
            
            // Delete product (cascade deletes components, or we can force it)
            $product->components()->delete();
            $product->delete();

            DB::commit();
            return redirect()->back()->with('success', 'Fórmula eliminada correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al eliminar: ' . $e->getMessage());
        }
    }
}
