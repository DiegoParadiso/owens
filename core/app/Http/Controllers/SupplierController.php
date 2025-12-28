<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $title = 'Proveedores';
        $subtitle = 'Índice';
        $suppliers = Supplier::latest()->get();
        return view('admin.supplier.index', compact('title', 'subtitle', 'suppliers'));
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
        ]);

        $supplier = Supplier::create($validate);

        return redirect()->route('supplier.index')->with('highlight_id', $supplier->id);
    }

    public function edit(Supplier $supplier)
    {
        $title = 'Proveedores';
        $subtitle = 'Editar';
        return view('admin.supplier.edit', compact('title', 'subtitle', 'supplier'));
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'contact_info' => 'nullable|string',
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
