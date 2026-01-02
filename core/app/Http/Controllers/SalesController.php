<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\SaleDetail;
use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{

    public function index(Request $request)
    {
        $sales = Sale::with(['user', 'payment', 'saleDetails.product'])->latest()->get();
        $products = Product::where('stock', '>', 0)->get();
        
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
            'quantity.*' => 'numeric|min:1'
        ]);

        DB::beginTransaction();

        try {
            // Data penjualan yang akan disimpan
            $sale_data = [
                'sale_date' => now(),
                'user_id' => Auth::user()->id,
                'total_price' => $request->total,
            ];

            $savedSale = Sale::create($sale_data);

            foreach ($request->product_id as $key => $productId) {
                $product = Product::find($productId);
                $quantitySold = $request->quantity[$key];

                if ($product->type == 'combo') {
                    // Check stock for all components
                    foreach ($product->components as $component) {
                        $requiredQty = $component->quantity * $quantitySold;
                        if ($component->childProduct->stock < $requiredQty) {
                            DB::rollBack();
                            return redirect()->back()->with('error', 'Stock insuficiente para el componente: ' . $component->childProduct->name . ' del combo ' . $product->name);
                        }
                    }
                    // Deduct stock
                    foreach ($product->components as $component) {
                        $requiredQty = $component->quantity * $quantitySold;
                        $component->childProduct->stock -= $requiredQty;
                        $component->childProduct->save();
                    }
                } else {
                    if ($product->stock < $quantitySold) {
                        DB::rollBack();
                        return redirect()->back()->with('error', 'Stock insuficiente para el producto: ' . $product->name);
                    }

                    $product->stock -= $quantitySold;
                    $product->save();
                }

                SaleDetail::create([
                    'sale_id' => $savedSale->id,
                    'product_id' => $productId,
                    'price' => $request->price[$key],
                    'quantity' => $quantitySold,
                    'subtotal' => $request->total_price[$key],
                ]);
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
}
