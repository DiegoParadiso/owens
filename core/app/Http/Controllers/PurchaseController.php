<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseDetail;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\PurchasePayment;
use App\Models\CashRegister;
use App\Models\CashMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    protected $stockService;
    protected $cashRegisterService;

    public function __construct(\App\Services\StockService $stockService, \App\Services\CashRegisterService $cashRegisterService)
    {
        $this->stockService = $stockService;
        $this->cashRegisterService = $cashRegisterService;
    }

    public function index(Request $request)
    {
        $title = 'Compras';
        $subtitle = 'Listado de Compras';
        
        $perPage = $request->input('per_page', 10);
        
        $purchases = Purchase::with(['supplier', 'details.product', 'user'])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        $suppliers = Supplier::all();
        $products = Product::where('category', 'other')->get();

        return Inertia::render('Purchases/Index', compact('title', 'subtitle', 'purchases', 'suppliers', 'products'));
    }

    public function create()
    {
        $suppliers = Supplier::all();
        $products = Product::where('category', 'other')->get();
        return \Inertia\Inertia::render('Purchases/Create', [
            'suppliers' => $suppliers,
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'product_id' => 'required|array',
            'product_id.*' => 'nullable|exists:products,id',
            'product_name' => 'array',
            'product_name.*' => 'nullable|string|max:255|required_without:product_id.*',
            'sale_price' => 'array',
            'sale_price.*' => 'nullable|numeric|min:0',
            'quantity' => 'required|array',
            'quantity.*' => 'numeric|min:0.01',
            'unit_cost' => 'required|array',
            'unit_cost.*' => 'numeric|min:0',
            'payment_method' => 'required',
            'split_payments' => 'nullable|array|required_if:payment_method,multiple',
            'split_payments.*.method' => 'required_if:payment_method,multiple|in:cash,debit_card,credit_card,transfer,qr',
            'split_payments.*.amount' => 'required_if:payment_method,multiple|numeric|min:0.01',
        ]);

        try {
            DB::beginTransaction();

            $total_cost = 0;
            foreach ($request->quantity as $key => $qty) {
                $total_cost += $qty * $request->unit_cost[$key];
            }

            $purchase = Purchase::create([
                'supplier_id' => $request->supplier_id,
                'date' => $request->date,
                'total_cost' => $total_cost,
                'user_id' => Auth::id(),
                'payment_method' => $request->payment_method,
            ]);

            // Handle payments (split or single)
            if ($request->payment_method === 'multiple' && $request->has('split_payments')) {
                // Validate that split payments sum equals total
                $splitTotal = collect($request->split_payments)->sum('amount');
                // Allow small floating point difference
                if (abs($splitTotal - $total_cost) > 0.01) {
                    DB::rollBack();
                    return redirect()->back()->with('error', 'La suma de los pagos divididos debe ser igual al total de la compra');
                }

                foreach ($request->split_payments as $payment) {
                    PurchasePayment::create([
                        'purchase_id' => $purchase->id,
                        'payment_method' => $payment['method'],
                        'amount' => $payment['amount'],
                    ]);

                    // Only create cash movement for cash portions
                    if ($payment['method'] === 'cash') {
                        $this->cashRegisterService->recordMovement(
                            $payment['amount'],
                            'purchase',
                            'Compra #' . $purchase->id . ' (Pago parcial en efectivo)',
                            $purchase->id
                        );
                    }
                }
            } else {
                // Single payment method
                if ($request->payment_method === 'cash') {
                    $this->cashRegisterService->recordMovement(
                        $total_cost,
                        'purchase',
                        'Compra #' . $purchase->id,
                        $purchase->id
                    );
                }
            }

            foreach ($request->product_id as $key => $productId) {
                $qty = $request->quantity[$key]; // Quantity in Purchase Units (e.g., Packs)
                $cost = $request->unit_cost[$key]; // Cost per Purchase Unit

                // If product_id is null, create new product
                if (!$productId) {
                    $newProduct = Product::create([
                        'name' => $request->product_name[$key],
                        'price' => ($request->product_type[$key] ?? 'single') === 'supply' ? 0 : ($request->sale_price[$key] ?? 0),
                        'stock' => 0, // Will be updated below
                        'cost' => 0, // Will be updated below
                        'type' => $request->product_type[$key] ?? 'supply',
                        'user_id' => Auth::id(),
                        'purchase_unit' => !empty($request->purchase_unit[$key]) ? $request->purchase_unit[$key] : null,
                        'usage_unit' => !empty($request->usage_unit[$key]) ? $request->usage_unit[$key] : null,
                        'conversion_factor' => !empty($request->conversion_factor[$key]) ? $request->conversion_factor[$key] : 1,
                    ]);
                    $productId = $newProduct->id;
                } else {
                    // Update existing product details
                    $product = Product::find($productId);
                    if ($product) {
                        $product->update([
                            'type' => $request->product_type[$key] ?? $product->type,
                            'price' => ($request->product_type[$key] ?? $product->type) === 'supply' ? 0 : ($request->sale_price[$key] ?? $product->price),
                            'purchase_unit' => !empty($request->purchase_unit[$key]) ? $request->purchase_unit[$key] : $product->purchase_unit,
                            'usage_unit' => !empty($request->usage_unit[$key]) ? $request->usage_unit[$key] : $product->usage_unit,
                            'conversion_factor' => !empty($request->conversion_factor[$key]) ? $request->conversion_factor[$key] : ($product->conversion_factor ?? 1),
                        ]);
                    }
                }

                PurchaseDetail::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $productId,
                    'quantity' => $qty,
                    'unit_cost' => $cost,
                    'total_cost' => $qty * $cost,
                ]);

                // Update Product Stock and Cost Price (Weighted Average)
                $product = Product::find($productId);
                
                $conversionFactor = $product->conversion_factor ?? 1;
                $qtyInUsageUnits = $qty * $conversionFactor;
                // Total cost of this batch is $qty * $cost
                $totalCostOfBatch = $qty * $cost;

                $this->stockService->updateStockAndCost($product, $qtyInUsageUnits, $totalCostOfBatch);
            }

            DB::commit();
            return redirect()->route('purchase.index')->with('highlight_id', $purchase->id);

        } catch (\Exception $e) {
            DB::rollBack();
            if ($e->getMessage() === 'REGISTER_CLOSED') {
                return redirect()->back()->withErrors(['register_closed' => 'No hay caja abierta.']);
            }
            return redirect()->back()->with('error', 'Error al registrar la compra: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Purchase $purchase)
    {
        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'product_id' => 'required|array',
            'product_id.*' => 'nullable|exists:products,id',
            'product_name' => 'array',
            'product_name.*' => 'nullable|string|max:255|required_without:product_id.*',
            'sale_price' => 'array',
            'sale_price.*' => 'nullable|numeric|min:0|required_without:product_id.*',
            'quantity' => 'required|array',
            'quantity.*' => 'numeric|min:0.01',
            'unit_cost' => 'required|array',
            'unit_cost.*' => 'numeric|min:0',
            'payment_method' => 'required',
            'split_payments' => 'nullable|array',
            'split_payments.*.method' => 'required_with:split_payments|in:cash,debit_card,credit_card,transfer,qr',
            'split_payments.*.amount' => 'required_with:split_payments|numeric|min:0.01',
        ]);

        try {
            DB::beginTransaction();

            // 1. Reverse effects of old purchase
            foreach ($purchase->details as $detail) {
                $product = Product::find($detail->product_id);
                if ($product) {
                    $conversionFactor = $product->conversion_factor ?? 1;
                    $qtyInUsageUnits = $detail->quantity * $conversionFactor;
                    
                    // Direct decrement because we are reversing a purchase (taking back from stock)
                    $product->decrement('stock', $qtyInUsageUnits);
                }
            }
            
            // Delete old details
            $purchase->details()->delete();

            // 2. Update Purchase Header
            $total_cost = 0;
            foreach ($request->quantity as $key => $qty) {
                $total_cost += $qty * $request->unit_cost[$key];
            }

            $purchase->update([
                'supplier_id' => $request->supplier_id,
                'date' => $request->date,
                'total_cost' => $total_cost,
                'user_id' => Auth::id(),
                'payment_method' => $request->payment_method,
            ]);

            // 2.1 Update Payments
            $purchase->payments()->delete();
            $this->cashRegisterService->deleteRelatedMovements('purchase', $purchase->id);

            if ($request->payment_method === 'multiple' && $request->has('split_payments')) {
                 $splitTotal = collect($request->split_payments)->sum('amount');
                 if (abs($splitTotal - $total_cost) > 0.01) {
                     DB::rollBack();
                     return redirect()->back()->with('error', 'La suma de los pagos divididos debe ser igual al total de la compra');
                 }

                 foreach ($request->split_payments as $payment) {
                     PurchasePayment::create([
                         'purchase_id' => $purchase->id,
                         'payment_method' => $payment['method'],
                         'amount' => $payment['amount'],
                     ]);
 
                     if ($payment['method'] === 'cash') {
                         // Generate description with product names
                         $productNames = collect($request->product_name)->filter()->implode(', ');
                         if (empty($productNames)) {
                              $productNames = Product::whereIn('id', $request->product_id)->pluck('name')->implode(', ');
                         }
                         
                         $this->cashRegisterService->recordMovement(
                             $payment['amount'],
                             'purchase',
                             'Compra de ' . $productNames . ' (Pago parcial en efectivo)',
                             $purchase->id
                         );
                     }
                 }
            } else {
                if ($request->payment_method === 'cash') {
                    $this->cashRegisterService->recordMovement(
                        $total_cost,
                        'purchase',
                        'Compra #' . $purchase->id,
                        $purchase->id
                    );
                }
            }

            // 3. Create new details and apply effects
            foreach ($request->product_id as $key => $productId) {
                $qty = $request->quantity[$key];
                $cost = $request->unit_cost[$key];

                // If product_id is null, create new product
                if (!$productId) {
                    $newProduct = Product::create([
                        'name' => $request->product_name[$key],
                        'price' => $request->sale_price[$key] ?? 0,
                        'stock' => 0, // Will be updated below
                        'cost' => 0,
                        'type' => 'supply',
                        'user_id' => Auth::id(),
                        'conversion_factor' => 1,
                    ]);
                    $productId = $newProduct->id;
                } else {
                    // Update existing product details
                    $product = Product::find($productId);
                    if ($product) {
                        $product->update([
                            'type' => $request->product_type[$key] ?? $product->type,
                            'price' => ($request->product_type[$key] ?? $product->type) === 'supply' ? 0 : ($request->sale_price[$key] ?? $product->price),
                            'purchase_unit' => !empty($request->purchase_unit[$key]) ? $request->purchase_unit[$key] : $product->purchase_unit,
                            'usage_unit' => !empty($request->usage_unit[$key]) ? $request->usage_unit[$key] : $product->usage_unit,
                            'conversion_factor' => !empty($request->conversion_factor[$key]) ? $request->conversion_factor[$key] : ($product->conversion_factor ?? 1),
                        ]);
                    }
                }

                PurchaseDetail::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $productId,
                    'quantity' => $qty,
                    'unit_cost' => $cost,
                    'total_cost' => $qty * $cost,
                ]);

                // Update Product Stock and Cost Price
                $product = Product::find($productId);
                
                $conversionFactor = $product->conversion_factor ?? 1;
                $qtyInUsageUnits = $qty * $conversionFactor;
                $totalCostOfBatch = $qty * $cost;

                $this->stockService->updateStockAndCost($product, $qtyInUsageUnits, $totalCostOfBatch);
            }

            DB::commit();
            return redirect()->route('purchase.index')->with('success', 'Compra actualizada exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            if ($e->getMessage() === 'REGISTER_CLOSED') {
                return redirect()->back()->withErrors(['register_closed' => 'No hay caja abierta.']);
            }
            return redirect()->back()->with('error', 'Error al actualizar la compra: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, Purchase $purchase)
    {
        try {
            DB::beginTransaction();

            // Check for negative stock implications unless forced
            if (!$request->input('force')) {
                foreach ($purchase->details as $detail) {
                    $product = Product::find($detail->product_id);
                    if ($product) {
                        $conversionFactor = $product->conversion_factor ?? 1;
                        $qtyInUsageUnits = $detail->quantity * $conversionFactor;
                        
                        if (($product->stock - $qtyInUsageUnits) < 0) {
                            DB::rollBack();
                            return redirect()->back()->withErrors(['negative_stock' => 'Esta acción dejará el stock en negativo para el producto: ' . $product->name]);
                        }
                    }
                }
            }

            // Reverse stock
            foreach ($purchase->details as $detail) {
                $product = Product::find($detail->product_id);
                if ($product) {
                    $conversionFactor = $product->conversion_factor ?? 1;
                    $qtyInUsageUnits = $detail->quantity * $conversionFactor;
                    $product->decrement('stock', $qtyInUsageUnits);
                }
            }

            // Delete cash movement
            $this->cashRegisterService->deleteRelatedMovements('purchase', $purchase->id);

            $purchase->details()->delete();
            $purchase->delete();

            DB::commit();
            return redirect()->route('purchase.index')->with('success', 'Compra eliminada exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al eliminar la compra: ' . $e->getMessage());
        }
    }
}
