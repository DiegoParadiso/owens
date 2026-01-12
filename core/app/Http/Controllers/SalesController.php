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
                            DB::rollBack();
                            return redirect()->back()->withErrors([
                                'error' => 'No tienes una caja abierta para registrar pagos en efectivo'
                            ]);
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
                        DB::rollBack();
                        return redirect()->back()->withErrors([
                            'error' => 'No tienes una caja abierta para registrar ventas en efectivo'
                        ]);
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
        // Load components if not already loaded
        if (!$product->relationLoaded('components')) {
            $product->load('components.childProduct');
        }

        // If product is a combo or has components (recipe), process components recursively
        if ($product->type === 'combo' || $product->components->count() > 0) {
            foreach ($product->components as $component) {
                if (!$component->childProduct) {
                    continue;
                }
                
                $componentQty = $component->quantity * $quantity;
                
                // Recursively process the child product
                $childProduct = $component->childProduct;
                
                $this->processStock($childProduct, $componentQty, $action);
            }
        } else {
            // Base case: Leaf node (Supply or Simple Product without components)
            if ($action === 'deduct') {
                if ($product->stock < $quantity) {
                     throw new \Exception("Stock insuficiente para: " . $product->name . " (Req: $quantity, Disp: " . $product->stock . ")");
                }
                $product->decrement('stock', $quantity);
            } else {
                $product->increment('stock', $quantity);
            }
        }
    }
}
