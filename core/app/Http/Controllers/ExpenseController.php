<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\CashRegister;
use App\Models\CashMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::with('user')->latest()->get();
        return \Inertia\Inertia::render('Expenses/Index', [
            'expenses' => $expenses
        ]);
    }

    public function create()
    {
        $title = 'Gastos';
        $subtitle = 'Registrar Gasto';
        return view('admin.expense.create', compact('title', 'subtitle'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:fixed,variable',
            'date' => 'required|date',
            'payment_method' => 'required|in:cash,external',
        ]);

        try {
            DB::beginTransaction();

            $expense = Expense::create([
                'description' => $request->description,
                'amount' => $request->amount,
                'type' => $request->type,
                'date' => $request->date,
                'user_id' => Auth::id(),
            ]);

            if ($request->payment_method == 'cash') {
                // Check for open register
                $register = CashRegister::where('user_id', Auth::id())->where('status', 'open')->first();
                
                if (!$register) {
                    throw new \Exception('No tienes una caja abierta para registrar este gasto en efectivo.');
                }

                CashMovement::create([
                    'cash_register_id' => $register->id,
                    'type' => 'expense',
                    'amount' => $request->amount,
                    'description' => 'Gasto: ' . $request->description,
                    'related_id' => $expense->id,
                ]);
            }

            DB::commit();
            DB::commit();
            return redirect()->route('expense.index')->with('highlight_id', $expense->id);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
