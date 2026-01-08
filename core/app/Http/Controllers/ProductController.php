<?php

namespace App\Http\Controllers;

use App\Models\LogStock;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Milon\Barcode\Facades\DNS1DFacade;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $title = 'Inventario';
        $subtitle = 'Gestión de Productos';
        
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $products = Product::where('type', 'single');
        
        if ($search) {
            $products->where(function($q) use ($search) {
                $q->where('name', 'LIKE', '%' . $search . '%')
                  ->orWhere('price', 'LIKE', '%' . $search . '%');
            });
        }

        $products = $products->latest()
            ->paginate($perPage)
            ->withQueryString();

        return \Inertia\Inertia::render('Products/Index', compact('title', 'subtitle', 'products'));
    }
    public function indexCombo(Request $request)
    {
        $title = 'Combos';
        $subtitle = 'Gestión de Combos';
        
        $perPage = $request->input('per_page', 10);
        
        $combos = Product::where('type', 'combo')
            ->with('components.childProduct')
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        $products = Product::where('type', 'simple')->get();

        return \Inertia\Inertia::render('Combos/Index', compact('title', 'subtitle', 'combos', 'products'));
    }
    public function create()
    {
        $title = 'Producto';
        $subtitle = 'Crear';
        return view('admin.product.create', compact('title', 'subtitle'));
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'cost' => 'nullable|numeric|min:0',
        ]);
        
        $validated['type'] = 'single';
        $validated['user_id'] = auth()->id();
        
        Product::create($validated);
        
        return redirect()->route('product.index');
    }

    public function edit($id)
    {
        $title = 'Producto';
        $subtitle = 'Editar';
        $product = Product::find($id);

        return view('admin.product.edit', compact('title', 'subtitle', 'product'));
    }
    public function update(Request $request, Product $product)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);
        
        $validate['user_id'] = Auth::user()->id;
        $product->update($validate);
        
        return redirect()->route('product.index');
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return redirect()->route('product.index')->with('error', 'Producto no encontrado.');
        }

        try {
            $delete = $product->delete();

            if ($delete) {
                return redirect(route('product.index'));
            } else {
                return redirect(route('product.index'))->with('error', 'Error al eliminar el producto.');
            }
        } catch (QueryException $e) {
            if ($e->getCode() == '23000') {
                return redirect()->route('product.index')->with('error', 'El producto no se puede eliminar porque está registrado en transacciones de venta. Por favor, revisa los detalles de ventas relacionados.');
            }
            return redirect()->route('product.index')->with('error', 'Ocurrió un error inesperado en la base de datos: ' . $e->getMessage());
        } catch (\Exception $e) {
            return redirect()->route('product.index')->with('error', 'Ocurrió un error inesperado: ' . $e->getMessage());
        }
    }
    public function addStock(Request $request, $id)
    {
        $validate = $request->validate([
            'stock' => 'required|numeric',
        ]);
        $product = Product::find($id);
        $product->stock += $validate['stock'];
        $update = $product->save();
        if ($update) {
            return response()->json(['status' => 200, 'message' => 'Stock agregado con éxito']);
        } else {
            return response()->json(['status' => 500, 'message' => 'Error al agregar stock']);
        }
    }
    /*
    public function logProduct()
    {
        $title = 'Producto';
        $subtitle = 'Historial de Productos';
        $products = LogStock::join('products', 'log_stocks.product_id', '=', 'products.id')
            ->join('users', 'log_stocks.user_id', '=', 'users.id')
            ->select('log_stocks.quantity', 'log_stocks.created_at', 'products.name', 'users.name')->get();
        return view('admin.product.logproduct', compact('title', 'subtitle', 'products'));
    }
    */
    public function printLabel(Request $request)
    {
        $id_produk = $request->id_produk;
        $barcodes = [];

        if (is_array($id_produk)) {
            foreach ($id_produk as $id) {
                $id = (string) $id;
                $product = Product::find($id);
                $harga = $product->price;
                $nama_produk = $product->name;
                $barcode = DNS1DFacade::getBarcodeHTML($id, 'C128');
                $barcodes[] = ['barcode' => $barcode, 'harga' => $harga, 'nama_produk' => $nama_produk];
            }
        } else {
            $id_produk = (string) $id_produk;
            $product = Product::find($id_produk);
            $harga = $product->price;
            $nama_produk = $product->name;
            $barcode = DNS1DFacade::getBarcodeHTML($id_produk, 'C128');
            $barcodes[] = ['barcode' => $barcode, 'harga' => $harga, 'nama_produk' => $nama_produk];
        }
        $pdf = Pdf::loadView('admin.product.printlabel', compact('barcodes'));

        $file_path = storage_path('app/public/barcodes.pdf');
        $pdf->save($file_path);

        return response()->json(['url' => asset('storage/barcodes.pdf')]);
    }

    public function createCombo()
    {
        $title = 'Producto';
        $subtitle = 'Crear Combo';
        $products = Product::where('type', 'single')->get();
        return view('admin.product.create_combo', compact('title', 'subtitle', 'products'));
    }

    public function storeCombo(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'child_product_id' => 'required|array',
            'child_product_id.*' => 'exists:products,id',
            'quantity' => 'required|array',
            'quantity.*' => 'integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $combo = Product::create([
                'name' => $request->name,
                'price' => $request->price,
                'stock' => 0,
                'type' => 'combo',
                'user_id' => Auth::id(),
            ]);

            foreach ($request->child_product_id as $key => $childId) {
                \App\Models\ProductComponent::create([
                    'parent_product_id' => $combo->id,
                    'child_product_id' => $childId,
                    'quantity' => $request->quantity[$key],
                ]);
            }

            DB::commit();
            return redirect()->route('product.indexCombo')->with('highlight_id', $combo->id);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error creating combo: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al crear combo: ' . $e->getMessage());
        }
    }

    public function updateCombo(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'child_product_id' => 'required|array',
            'child_product_id.*' => 'exists:products,id',
            'quantity' => 'required|array',
            'quantity.*' => 'integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $combo = Product::findOrFail($id);
            $combo->update([
                'name' => $request->name,
                'price' => $request->price,
                'user_id' => Auth::id(),
            ]);

            // Delete existing components
            \App\Models\ProductComponent::where('parent_product_id', $combo->id)->delete();

            // Create new components
            foreach ($request->child_product_id as $key => $childId) {
                \App\Models\ProductComponent::create([
                    'parent_product_id' => $combo->id,
                    'child_product_id' => $childId,
                    'quantity' => $request->quantity[$key],
                ]);
            }

            DB::commit();
            return redirect()->route('product.indexCombo')->with('success', 'Combo actualizado exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error updating combo: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al actualizar combo: ' . $e->getMessage());
        }
    }
}