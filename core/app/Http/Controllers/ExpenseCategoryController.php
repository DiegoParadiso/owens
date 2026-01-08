<?php

namespace App\Http\Controllers;

use App\Models\ExpenseCategory;
use Illuminate\Http\Request;

class ExpenseCategoryController extends Controller
{
    public function index()
    {
        $categories = ExpenseCategory::withCount('expenses')->get();
        return \Inertia\Inertia::render('ExpenseCategories/Index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:fixed,variable',
        ]);

        ExpenseCategory::create([
            'name' => $request->name,
            'type' => $request->type,
        ]);

        return redirect()->route('expense-categories.index')->with('success', 'Categoría creada exitosamente');
    }

    public function update(Request $request, ExpenseCategory $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:fixed,variable',
        ]);

        $category->update([
            'name' => $request->name,
            'type' => $request->type,
        ]);

        return redirect()->route('expense-categories.index')->with('success', 'Categoría actualizada exitosamente');
    }

    public function destroy(ExpenseCategory $category)
    {
        if ($category->expenses()->count() > 0) {
            return redirect()->back()->withErrors([
                'error' => 'No se puede eliminar una categoría con gastos asociados'
            ]);
        }

        $category->delete();
        return redirect()->route('expense-categories.index')->with('success', 'Categoría eliminada exitosamente');
    }
}
