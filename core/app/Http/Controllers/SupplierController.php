<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $title = 'Proveedores';
        $subtitle = 'Gestión de Proveedores';
        
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $query = Supplier::latest();

        if ($search) {
             $query->where('name', 'LIKE', "%{$search}%")
                   ->orWhere('contact_info', 'LIKE', "%{$search}%");
        }
        
        $suppliers = $query->paginate($perPage)
            ->withQueryString();

        return \Inertia\Inertia::render('Suppliers/Index', compact('title', 'subtitle', 'suppliers'));
    }

    public function create()
    {
        $title = 'Proveedores';
        $subtitle = 'Crear';
        return view('admin.supplier.create', compact('title', 'subtitle'));
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'contact_info' => 'nullable|string',
        ], [
            'name.required' => 'El nombre del proveedor es obligatorio.',
        ]);

        $supplier = Supplier::create($validate);

        return redirect()->route('supplier.index')->with('highlight_id', $supplier->id);
    }

    public function edit($id)
    {
        $supplier = Supplier::findOrFail($id);
        return \Inertia\Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier
        ]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'contact_info' => 'nullable|string',
        ], [
            'name.required' => 'El nombre del proveedor es obligatorio.',
        ]);

        $supplier->update($validate);

        return redirect()->route('supplier.index')->with('highlight_id', $supplier->id);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return redirect()->route('supplier.index');
    }
}
