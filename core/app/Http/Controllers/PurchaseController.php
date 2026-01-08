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
        $products = Product::all();

        return Inertia::render('Purchases/Index', compact('title', 'subtitle', 'purchases', 'suppliers', 'products'));
    }

    public function create()
    {
        $suppliers = Supplier::all();
        $products = Product::where('type', 'single')->get();
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
            'sale_price.*' => 'nullable|numeric|min:0|required_without:product_id.*',
            'quantity' => 'required|array',
            'quantity.*' => 'integer|min:1',
            'unit_cost' => 'required|array',
            'unit_cost.*' => 'numeric|min:0',
            'payment_method' => 'required',
            'split_payments' => 'nullable|array',
            'split_payments.*.method' => 'required_with:split_payments|in:cash,debit_card,credit_card,transfer,qr',
            'split_payments.*.amount' => 'required_with:split_payments|numeric|min:0.01',
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
                        $this->createCashMovement($payment['amount'], $purchase->id, 'Compra #' . $purchase->id . ' (Pago parcial en efectivo)');
                    }
                }
            } else {
                // Single payment method
                if ($request->payment_method === 'cash') {
                    $this->createCashMovement($total_cost, $purchase->id, 'Compra #' . $purchase->id);
                }
            }

            foreach ($request->product_id as $key => $productId) {
                $qty = $request->quantity[$key];
                $cost = $request->unit_cost[$key];

                // If product_id is null, create new product
                if (!$productId) {
                    $newProduct = Product::create([
                        'name' => $request->product_name[$key],
                        'price' => $request->sale_price[$key],
                        'stock' => 0, // Will be updated below
                        'cost' => $cost,
                        'type' => 'single',
                        'user_id' => Auth::id(),
                    ]);
                    $productId = $newProduct->id;
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
                
                $currentStock = $product->stock;
                $currentCost = $product->cost ?? 0;
                
                $newStock = $currentStock + $qty;
                
                if ($newStock > 0) {
                    $newCost = (($currentStock * $currentCost) + ($qty * $cost)) / $newStock;
                } else {
                    $newCost = $cost;
                }

                $product->update([
                    'stock' => $newStock,
                    'cost' => $newCost,
                ]);
            }

            DB::commit();
            return redirect()->route('purchase.index')->with('highlight_id', $purchase->id);

        } catch (\Exception $e) {
            DB::rollBack();
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
            'quantity.*' => 'integer|min:1',
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
                // We only decrease stock. Reversing weighted average cost is too complex/risky, 
                // so we assume the cost remains the current cost (or we could try to revert it but it depends on order of operations).
                // For simplicity and safety, we just reduce stock. The new weighted average will be calculated when we re-add.
                $product->decrement('stock', $detail->quantity);
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
            // Delete old payments
            $purchase->payments()->delete();
            // Also need to reverse old cash movements? 
            // For simplicity, we won't reverse old cash movements automatically here as it's complex (register might be closed).
            // But we should create new ones if needed. 
            // Ideally we should delete old cash movements related to this purchase if possible, but let's stick to creating new ones for now or just updating payments.
            // Actually, if we edit a purchase, we should probably void the old cash movement.
            // Let's remove old cash movements for this purchase.
            CashMovement::where('type', 'purchase')->where('related_id', $purchase->id)->delete();

            if ($request->payment_method === 'multiple' && $request->has('split_payments')) {
                 // Validate that split payments sum equals total
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
                         $this->createCashMovement($payment['amount'], $purchase->id, 'Compra de ' . $productNames . ' (Pago parcial en efectivo)');
                     }
                 }
            } else {
                if ($request->payment_method === 'cash') {
                    $this->createCashMovement($total_cost, $purchase->id, 'Compra #' . $purchase->id);
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
                        'price' => $request->sale_price[$key],
                        'stock' => 0, // Will be updated below
                        'cost' => $cost,
                        'type' => 'single',
                        'user_id' => Auth::id(),
                    ]);
                    $productId = $newProduct->id;
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
                
                $currentStock = $product->stock;
                $currentCost = $product->cost ?? 0;
                
                $newStock = $currentStock + $qty;
                
                if ($newStock > 0) {
                    $newCost = (($currentStock * $currentCost) + ($qty * $cost)) / $newStock;
                } else {
                    $newCost = $cost;
                }

                $product->update([
                    'stock' => $newStock,
                    'cost' => $newCost,
                ]);
            }

            DB::commit();
            return redirect()->route('purchase.index')->with('success', 'Compra actualizada exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al actualizar la compra: ' . $e->getMessage());
        }
    }

    public function destroy(Purchase $purchase)
    {
        try {
            DB::beginTransaction();

            // Reverse stock
            foreach ($purchase->details as $detail) {
                $product = Product::find($detail->product_id);
                if ($product) {
                    $product->decrement('stock', $detail->quantity);
                }
            }

            // Delete cash movement
            CashMovement::where('type', 'purchase')->where('related_id', $purchase->id)->delete();

            $purchase->details()->delete();
            $purchase->delete();

            DB::commit();
            return redirect()->route('purchase.index')->with('success', 'Compra eliminada exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al eliminar la compra: ' . $e->getMessage());
        }
    }

    private function createCashMovement($amount, $relatedId, $description)
    {
        $cashRegister = CashRegister::where('user_id', Auth::id())
                                     ->where('status', 'open')
                                     ->first();
        
        if (!$cashRegister) {
            throw new \Exception('No tienes una caja abierta para registrar pagos en efectivo');
        }
        
        CashMovement::create([
            'cash_session_id' => $cashRegister->id,
            'type' => 'purchase', // Ensure 'purchase' is a valid enum value in DB if enum is used. 
            // Checking CashMovement migration... usually it's string or enum. 
            // If it's enum, we need to be careful. 
            // Assuming it accepts 'purchase' or string.
            'amount' => $amount, // Cash OUT is usually negative in some systems, but here likely positive with type 'expense'/'purchase' handled as deduction.
            // Wait, standard logic: Sales = Income, Purchase/Expense = Expense.
            // Let's check how ExpenseController does it: 'type' => 'expense', 'amount' => $request->amount.
            // So we should use 'purchase' type.
            'description' => $description,
            'related_id' => $relatedId,
        ]);
    }
}
