<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{
    public function index()
    {
        return Inertia::render('Tables/Index', [
            'tables' => Table::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:table,cart',
            'seats' => 'nullable|integer|min:0',
        ], [
            'name.required' => 'El nombre de la mesa es obligatorio.',
            'type.required' => 'El tipo es obligatorio.',
            'seats.integer' => 'La cantidad de asientos debe ser un número.',
        ]);

        $table = Table::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'seats' => $validated['seats'] ?? 4,
            'x_position' => 0, // Default position, can be changed later
            'y_position' => 0,
        ]);

        return redirect()->back();
    }

    public function updatePositions(Request $request)
    {
        $validated = $request->validate([
            'positions' => 'required|array',
            'positions.*.id' => 'required|exists:tables,id',
            'positions.*.x' => 'required|integer',
            'positions.*.y' => 'required|integer',
        ], [
            'positions.required' => 'No se recibieron posiciones para actualizar.',
        ]);

        foreach ($validated['positions'] as $position) {
            Table::where('id', $position['id'])->update([
                'x_position' => $position['x'],
                'y_position' => $position['y'],
            ]);
        }

        return redirect()->back();
    }

    public function destroy($id)
    {
        Table::findOrFail($id)->delete();
        return redirect()->back();
    }
}
