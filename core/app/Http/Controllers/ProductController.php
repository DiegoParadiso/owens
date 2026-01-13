<?php

namespace App\Http\Controllers;

use App\Models\LogStock;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ProductController extends Controller
{
    public function index(Request $request)
    {
        $title = 'Inventario';
        $subtitle = 'Gestión de Productos';
        
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $products = Product::whereIn('type', ['single', 'supply'])
            ->where(function ($query) {
                $query->whereNotIn('category', ['burger', 'extra', 'combo'])
                      ->orWhereNull('category');
            });
        
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
    public function indexMenu(Request $request)
    {
        $title = 'Menú';
        $subtitle = 'Gestión del Menú';
        
        $perPage = $request->input('per_page', 10);
        
        // Fetch products by category
        // We might want to paginate each category separately or just fetch all for now if list is small?
        // Or maybe just pass all and filter in frontend? Pagination makes it tricky.
        // Let's stick to simple pagination for now, but maybe we need to filter by category in request?
        // The user wants tabs. Usually tabs imply separate lists.
        // Let's fetch all for now as menu shouldn't be huge, or implement filtering.
        // Let's implement filtering by category in the request, default to 'burger'.
        
        $category = $request->input('category', 'burger');
        
        $products = Product::where('category', $category)
            ->with('components.childProduct')
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        // Also need list of supplies/products for creating recipes/combos
        $supplies = Product::where('type', '!=', 'combo')->get();

        return \Inertia\Inertia::render('Menu/Index', compact('title', 'subtitle', 'products', 'supplies', 'category'));
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
            'price' => 'nullable|numeric|min:0',
            'stock' => 'required|numeric|min:0', // Changed to numeric to allow decimals for usage units
            'cost' => 'nullable|numeric|min:0',
            'type' => 'nullable|in:single,supply',
            'purchase_unit' => 'nullable|string|max:50',
            'usage_unit' => 'nullable|string|max:50',
            'conversion_factor' => 'nullable|numeric|min:0.0001',
            'base_unit' => 'nullable|string|max:50',
            'usage_factor' => 'nullable|numeric|min:0.0001',
        ]);
        
        $validated['type'] = $request->input('type', 'single');
        if ($validated['type'] === 'supply') {
            $validated['price'] = null;
        }
        $validated['user_id'] = auth()->id();
        $validated['conversion_factor'] = $request->input('conversion_factor', 1);
        $validated['usage_factor'] = $request->input('usage_factor', 1);
        
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
            'price' => 'nullable|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'purchase_unit' => 'nullable|string|max:50',
            'usage_unit' => 'nullable|string|max:50',
            'conversion_factor' => 'nullable|numeric|min:0.0001',
            'base_unit' => 'nullable|string|max:50',
            'usage_factor' => 'nullable|numeric|min:0.0001',
        ]);
        
        $validate['user_id'] = Auth::user()->id;
        $validate['conversion_factor'] = $request->input('conversion_factor', 1);
        $validate['usage_factor'] = $request->input('usage_factor', 1);
        
        // If type is supply (we might need to check current type if not in request, but usually it is)
        // Actually, type is not in validation for update, so we assume it's not changing or we should check.
        // If we want to support changing type, we should add it.
        // For now, let's just check if price is null, it's fine.
        // But if the user explicitly sends empty price, we should save it as null.
        
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


    public function createCombo()
    {
        $title = 'Producto';
        $subtitle = 'Crear Combo';
        $products = Product::where('type', 'single')->get();
        return view('admin.product.create_combo', compact('title', 'subtitle', 'products'));
    }

    public function storeMenu(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|in:burger,extra,combo',
            'child_product_id' => 'nullable|array',
            'child_product_id.*' => 'exists:products,id',
            'quantity' => 'nullable|array',
            'quantity.*' => 'numeric|min:0.01',
        ]);

        try {
            DB::beginTransaction();

            $type = $request->category === 'combo' ? 'combo' : 'single';

            $product = Product::create([
                'name' => $request->name,
                'price' => $request->price,
                'stock' => 0, // Menu items usually don't have direct stock if they are recipes/combos
                'type' => $type,
                'category' => $request->category,
                'user_id' => Auth::id(),
            ]);

            if ($request->has('child_product_id')) {
                foreach ($request->child_product_id as $key => $childId) {
                    if (!isset($request->quantity[$key]) || $request->quantity[$key] <= 0) continue;
                    
                    \App\Models\ProductComponent::create([
                        'parent_product_id' => $product->id,
                        'child_product_id' => $childId,
                        'quantity' => $request->quantity[$key],
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('product.indexMenu', ['category' => $request->category])->with('highlight_id', $product->id);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error creating menu item: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al crear ítem del menú: ' . $e->getMessage());
        }
    }

    public function updateMenu(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|in:burger,extra,combo',
            'child_product_id' => 'nullable|array',
            'child_product_id.*' => 'exists:products,id',
            'quantity' => 'nullable|array',
            'quantity.*' => 'numeric|min:0.01',
        ]);

        try {
            DB::beginTransaction();

            $product = Product::findOrFail($id);
            $type = $request->category === 'combo' ? 'combo' : 'single';
            
            $product->update([
                'name' => $request->name,
                'price' => $request->price,
                'type' => $type,
                'category' => $request->category,
                'user_id' => Auth::id(),
            ]);

            // Delete existing components
            \App\Models\ProductComponent::where('parent_product_id', $product->id)->delete();

            // Create new components
            if ($request->has('child_product_id')) {
                foreach ($request->child_product_id as $key => $childId) {
                    if (!isset($request->quantity[$key]) || $request->quantity[$key] <= 0) continue;

                    \App\Models\ProductComponent::create([
                        'parent_product_id' => $product->id,
                        'child_product_id' => $childId,
                        'quantity' => $request->quantity[$key],
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('product.indexMenu', ['category' => $request->category])->with('success', 'Ítem actualizado exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error updating menu item: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al actualizar ítem: ' . $e->getMessage());
        }
    }
}