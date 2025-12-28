<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseDetail;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function index()
    {
        $title = 'Compras';
        $subtitle = 'Índice';
        $purchases = Purchase::with('supplier', 'user')->latest()->get();
        return view('admin.purchase.index', compact('title', 'subtitle', 'purchases'));
    }

    public function create()
    {
        $title = 'Compras';
        $subtitle = 'Registrar Compra';
        $suppliers = Supplier::all();
        $products = Product::where('type', 'single')->get(); // Only buy single products, not combos
        return view('admin.purchase.create', compact('title', 'subtitle', 'suppliers', 'products'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'product_id' => 'required|array',
            'product_id.*' => 'exists:products,id',
            'quantity' => 'required|array',
            'quantity.*' => 'integer|min:1',
            'unit_cost' => 'required|array',
            'unit_cost.*' => 'numeric|min:0',
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
            ]);

            foreach ($request->product_id as $key => $productId) {
                $qty = $request->quantity[$key];
                $cost = $request->unit_cost[$key];

                PurchaseDetail::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $productId,
                    'quantity' => $qty,
                    'unit_cost' => $cost,
                ]);

                // Update Product Stock and Cost Price (Weighted Average)
                $product = Product::find($productId);
                
                $currentStock = $product->stock;
                $currentCost = $product->cost ?? 0;
                
                $newStock = $currentStock + $qty;
                
                // Avoid division by zero if newStock is somehow 0 (unlikely here)
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
}
