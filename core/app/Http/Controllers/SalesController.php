<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\SaleDetail;
use App\Models\Sale;
use App\Models\SalePayment;
use App\Models\Product;
use App\Models\CashRegister;
use App\Models\CashMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        
        $sales = Sale::with(['user', 'saleDetails.product', 'payments'])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
        
        // Include products with stock > 0 OR all combos (virtual stock)
        // For combos, load components to check stock availability
        $products = Product::where(function($query) {
            // Include all Menu items (Burgers, Extras, Combos) regardless of stock
            $query->whereIn('category', ['burger', 'extra', 'combo'])
            // OR include regular products (Single) if they have stock
                  ->orWhere(function($q) {
                      $q->where('type', 'single')
                        ->where('stock', '>', 0);
                  });
        })
        ->with('components.childProduct')
        ->get();
        
        return \Inertia\Inertia::render('Sales/Index', [
            'sales' => $sales,
            'products' => $products
        ]);
    }

    public function create()
    {
        $products = Product::where('stock', '>', 0)->get();
        return \Inertia\Inertia::render('Sales/Create', [
            'products' => $products
        ]);
    }


    public function store(Request $request)
    {
        $validate = $request->validate([
            'product_id' => 'required',
            'quantity' => 'required',
            'product_id.*' => 'exists:products,id',
            'quantity.*' => 'numeric|min:1',
            'payment_method' => 'required',
            'split_payments' => 'nullable|array',
            'split_payments.*.method' => 'required_with:split_payments|in:cash,debit_card,credit_card,transfer,qr',
            'split_payments.*.amount' => 'required_with:split_payments|numeric|min:0.01',
        ]);

        DB::beginTransaction();

        try {
            // Data penjualan yang será será guardada
            $sale_data = [
                'sale_date' => now(),
                'user_id' => Auth::user()->id,
                'total_price' => $request->total,
                'payment_method' => $request->payment_method,
            ];

            $savedSale = Sale::create($sale_data);

            foreach ($request->product_id as $key => $productId) {
                $product = Product::with('components.childProduct')->find($productId);
                $quantitySold = $request->quantity[$key];

                try {
                    $this->processStock($product, $quantitySold, 'deduct');
                } catch (\Exception $e) {
                    DB::rollBack();
                    return redirect()->back()->with('error', $e->getMessage());
                }

                SaleDetail::create([
                    'sale_id' => $savedSale->id,
                    'product_id' => $productId,
                    'price' => $request->price[$key],
                    'quantity' => $quantitySold,
                    'subtotal' => $request->total_price[$key],
                    'cost' => $product->getCurrentCost(), // SAVE HISTORICAL COST
                ]);
            }

            // Handle payments (split or single)
            if ($request->payment_method === 'multiple' && $request->has('split_payments')) {
                // Validate that split payments sum equals total
                $splitTotal = collect($request->split_payments)->sum('amount');
                if (abs($splitTotal - $request->total) > 0.01) {
                    DB::rollBack();
                    return redirect()->back()->withErrors([
                        'error' => 'La suma de los pagos divididos debe ser igual al total de la venta'
                    ]);
                }

                // Create sale payment records
                foreach ($request->split_payments as $payment) {
                    SalePayment::create([
                        'sale_id' => $savedSale->id,
                        'payment_method' => $payment['method'],
                        'amount' => $payment['amount'],
                    ]);

                    // Only create cash movement for cash portions
                    if ($payment['method'] === 'cash') {
                        $cashRegister = CashRegister::where('user_id', Auth::id())
                                                     ->where('status', 'open')
                                                     ->first();
                        
                        if (!$cashRegister) {
                            throw new \Exception('REGISTER_CLOSED');
                        }
                        
                        // Generate description with product names
                        $productNames = SaleDetail::where('sale_id', $savedSale->id)
                            ->join('products', 'sale_details.product_id', '=', 'products.id')
                            ->pluck('products.name')
                            ->implode(', ');

                        CashMovement::create([
                            'cash_session_id' => $cashRegister->id,
                            'type' => 'sale',
                            'amount' => $payment['amount'],
                            'description' => 'Venta de ' . $productNames . ' (Pago parcial en efectivo)',
                            'related_id' => $savedSale->id,
                        ]);
                    }
                }
            } else {
                // Single payment method
                if ($request->payment_method === 'cash') {
                    $cashRegister = CashRegister::where('user_id', Auth::id())
                                                 ->where('status', 'open')
                                                 ->first();
                    
                    if (!$cashRegister) {
                        throw new \Exception('REGISTER_CLOSED');
                    }
                    
                    // Generate description with product names
                    $productNames = SaleDetail::where('sale_id', $savedSale->id)
                        ->join('products', 'sale_details.product_id', '=', 'products.id')
                        ->pluck('products.name')
                        ->implode(', ');

                    CashMovement::create([
                        'cash_session_id' => $cashRegister->id,
                        'type' => 'sale',
                        'amount' => $request->total,
                        'description' => 'Venta de ' . $productNames,
                        'related_id' => $savedSale->id,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('sales.index')->with('highlight_id', $savedSale->id);
        } catch (\Exception $e) {
            DB::rollBack();
            if ($e->getMessage() === 'REGISTER_CLOSED') {
                return redirect()->back()->withErrors(['register_closed' => 'No hay caja abierta.']);
            }
            return response()->json(['status' => 500, 'message' => 'Ocurrió un error: ' . $e->getMessage()]);
        }
    }

    public function payCash($id)
    {
        $title = 'Ventas';
        $subtitle = 'Pago en Efectivo';
        $sale = Sale::find($id);
        $saleDetails = SaleDetail::join('products', 'sale_details.product_id', '=', 'products.id')
            ->where('sale_id', $id)->get();
        return view('admin.sales.pay_cash', compact('title', 'subtitle', 'sale', 'saleDetails'));
    }
    public function storeCashPayment(Request $request)
    {
        $validate = $request->validate([
            'amount_paid' => 'required',
        ]);

        $saved = Payment::create([
            'sale_id' => $request->id,
            'payment_date' => date('Y-m-d H:i:s'),
            'amount_paid' => $request->amount_paid,
            'change' => $request->change,
            'payment_status' => 'Lunas',
            'payment_method' => 'Cash',
        ]);

        if ($saved) {
            return response()->json(['status' => 200, 'message' => 'Pago exitoso', 'id' => $request->id]);
        } else {
            return response()->json(['status' => 500, 'message' => 'Pago fallido']);
        }

    }
    public function receipt($id)
    {
        $sale = Sale::find($id);
        $saleDetails = SaleDetail::join('products', 'sale_details.product_id', '=', 'products.id')
            ->where('sale_id', $id)
            ->select('sale_details.*', 'products.name as product_name')
            ->get();
        $payment = Payment::where('sale_id', $id)->get();
        $amountPaid = 0;
        $change = 0;
        foreach ($payment as $item) {
            $amountPaid = $item->amount_paid;
            $change = $item->change;
        }
        return view('admin.sales.receipt', compact('sale', 'saleDetails', 'amountPaid', 'change'));
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            
            $sale = Sale::find($id);
            if (!$sale) {
                return redirect()->route('sales.index')->with('error', 'Venta no encontrada.');
            }

            // Restaurar stock y eliminar detalles
            // Restaurar stock y eliminar detalles
            $saleDetails = SaleDetail::where('sale_id', $id)->get();
            foreach ($saleDetails as $detail) {
                $product = Product::with('components.childProduct')->find($detail->product_id);
                if ($product) {
                    $this->processStock($product, $detail->quantity, 'restore');
                }
                $detail->delete();
            }

            // Eliminar movimiento de caja si existe
            CashMovement::where('type', 'sale')->where('related_id', $id)->delete();
            
            // Eliminar la venta
            $sale->delete();
            
            DB::commit();
            return redirect()->route('sales.index')->with('success', 'Venta eliminada y stock restaurado.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('sales.index')->with('error', 'Error al eliminar la venta: ' . $e->getMessage());
        }
    }

    /**
     * Recursively process stock (deduct or restore)
     * 
     * @param Product $product
     * @param float $quantity
     * @param string $action 'deduct' or 'restore'
     */
    private function processStock($product, $quantity, $action = 'deduct')
    {
        // SMART LOGIC FOR DEDUCTION AND RESTORATION

        if ($action === 'deduct') {
            $stockToDeduct = 0;
            $remainingQty = $quantity;

            // Check available stock
            if ($product->stock > 0) {
                if ($product->stock >= $quantity) {
                    $stockToDeduct = $quantity;
                    $remainingQty = 0;
                } else {
                    $stockToDeduct = $product->stock;
                    $remainingQty = $quantity - $product->stock;
                }
            }

            // Deduct available stock
            if ($stockToDeduct > 0) {
                $product->decrement('stock', $stockToDeduct);
            }

            // If there's still quantity needed to be covered and product has components
            if ($remainingQty > 0) {
                if ($product->components->count() > 0) {
                    // Recurse for remaining quantity
                    foreach ($product->components as $component) {
                        if (!$component->childProduct) continue;

                        $componentQty = $component->quantity * $remainingQty;
                        $this->processStock($component->childProduct, $componentQty, 'deduct');
                    }
                } else {
                    // Strictly fail if no stock and no components (unless forced, but here we strict)
                    if ($remainingQty > 0.001) { 
                         throw new \Exception("Stock insuficiente para: " . $product->name . " (Faltan: $remainingQty)");
                    }
                }
            }

        } else {
            // RESTORE LOGIC
            // If it is a Made-to-Order item (Burger, Combo, Extra) OR a Formula, 
            // we should check if we should restore the Item itself or its Ingredients.
            
            // Heuristic:
            // 1. If it's a 'combo', 'burger', 'extra', primarily we restore components because we don't stock ready-made burgers.
            // 2. If it's a 'production_formula' (Salsa), we MIGHT have stock. 
            //    But if the sales deduction logic prioritized Taking from Stock, the Restore logic should ideally Put Back in Stock.
            //    However, since we don't track *how* it was deducted (from stock vs made on spot) per transaction line easily without more complex logging,
            //    we need a safe default.
            
            // Safe Default: 
            // - If category is 'burger', 'extra', 'combo': Restore Components.
            // - Else (Supply, Drinks, Pre-made Salsas): Restore Stock.

            if (in_array($product->category, ['burger', 'extra', 'combo'])) {
                if ($product->components->count() > 0) {
                    foreach ($product->components as $component) {
                        if (!$component->childProduct) continue;
                        $componentQty = $component->quantity * $quantity;
                        $this->processStock($component->childProduct, $componentQty, 'restore');
                    }
                } else {
                    // Edge case: Burger with no recipe? Restore stock I guess, or do nothing.
                    // Let's restore stock to avoid data loss, but it signals bad configuration.
                    $product->increment('stock', $quantity);
                }
            } else {
                // Supplies, Drinks, Salsas (production_formula)
                // We assume these are returned to the shelf/fridge.
                $product->increment('stock', $quantity);
            }
        }
    }
}
