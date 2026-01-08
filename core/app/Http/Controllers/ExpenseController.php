<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\ExpensePayment;
use App\Models\CashRegister;
use App\Models\CashMovement;
use App\Models\ExpenseCategory; // Added this use statement for ExpenseCategory
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $title = 'Gastos';
        $subtitle = 'Listado de Gastos';
        
        $perPage = $request->input('per_page', 10);
        
        $expenses = Expense::with(['category', 'user'])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        $categories = ExpenseCategory::all();

        return \Inertia\Inertia::render('Expenses/Index', compact('title', 'subtitle', 'expenses', 'categories'));
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
            'category_id' => 'required|exists:expense_categories,id',
            'date' => 'required|date',
            'category_id' => 'required|exists:expense_categories,id',
            'date' => 'required|date',
            'payment_method' => 'required',
            'split_payments' => 'nullable|array',
            'split_payments.*.method' => 'required_with:split_payments|in:cash,debit_card,credit_card,transfer,qr',
            'split_payments.*.amount' => 'required_with:split_payments|numeric|min:0.01',
        ]);

        try {
            DB::beginTransaction();

            $expense = Expense::create([
                'description' => $request->description,
                'amount' => $request->amount,
                'category_id' => $request->category_id,
                'date' => $request->date,
                'user_id' => Auth::id(),
                'payment_method' => $request->payment_method,
            ]);

            if ($request->payment_method === 'multiple' && $request->has('split_payments')) {
                // Validate split payments
                $splitTotal = collect($request->split_payments)->sum('amount');
                if (abs($splitTotal - $request->amount) > 0.01) {
                     DB::rollBack();
                     return redirect()->back()->withErrors(['error' => 'La suma de los pagos divididos debe ser igual al total del gasto']);
                }

                foreach ($request->split_payments as $payment) {
                    ExpensePayment::create([
                        'expense_id' => $expense->id,
                        'payment_method' => $payment['method'],
                        'amount' => $payment['amount'],
                    ]);

                    if ($payment['method'] === 'cash') {
                        $this->createCashMovement($payment['amount'], $expense->id, 'Gasto: ' . $request->description . ' (Pago parcial en efectivo)');
                    }
                }
            } else {
                if ($request->payment_method == 'cash') {
                    $this->createCashMovement($request->amount, $expense->id, 'Gasto: ' . $request->description);
                }
            }

            DB::commit();
            return redirect()->route('expense.index')->with('success', 'Gasto registrado exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update(Request $request, Expense $expense)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category_id' => 'required|exists:expense_categories,id',
            'date' => 'required|date',
            'category_id' => 'required|exists:expense_categories,id',
            'date' => 'required|date',
            'payment_method' => 'required',
            'split_payments' => 'nullable|array',
            'split_payments.*.method' => 'required_with:split_payments|in:cash,debit_card,credit_card,transfer,qr',
            'split_payments.*.amount' => 'required_with:split_payments|numeric|min:0.01',
        ]);

        try {
            DB::beginTransaction();

            $expense->update([
                'description' => $request->description,
                'amount' => $request->amount,
                'category_id' => $request->category_id,
                'date' => $request->date,
                'user_id' => Auth::id(),
                'payment_method' => $request->payment_method,
            ]);

            // Update Payments
            $expense->payments()->delete();
            // Delete old cash movements
            CashMovement::where('type', 'expense')->where('related_id', $expense->id)->delete();

            if ($request->payment_method === 'multiple' && $request->has('split_payments')) {
                // Validate split payments
                $splitTotal = collect($request->split_payments)->sum('amount');
                if (abs($splitTotal - $request->amount) > 0.01) {
                     DB::rollBack();
                     return redirect()->back()->withErrors(['error' => 'La suma de los pagos divididos debe ser igual al total del gasto']);
                }

                foreach ($request->split_payments as $payment) {
                    ExpensePayment::create([
                        'expense_id' => $expense->id,
                        'payment_method' => $payment['method'],
                        'amount' => $payment['amount'],
                    ]);

                    if ($payment['method'] === 'cash') {
                        $this->createCashMovement($payment['amount'], $expense->id, 'Gasto: ' . $request->description . ' (Pago parcial en efectivo)');
                    }
                }
            } else {
                if ($request->payment_method == 'cash') {
                    $this->createCashMovement($request->amount, $expense->id, 'Gasto: ' . $request->description);
                }
            }

            DB::commit();
            return redirect()->route('expense.index')->with('success', 'Gasto actualizado exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Expense $expense)
    {
        try {
            DB::beginTransaction();
            
            // Delete cash movement
            CashMovement::where('type', 'expense')->where('related_id', $expense->id)->delete();
            
            $expense->payments()->delete();
            $expense->delete();
            
            DB::commit();
            return redirect()->route('expense.index')->with('success', 'Gasto eliminado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('expense.index')->with('error', 'Error al eliminar el gasto: ' . $e->getMessage());
        }
    }

    private function createCashMovement($amount, $relatedId, $description)
    {
        $register = CashRegister::where('user_id', Auth::id())->where('status', 'open')->first();
        
        if (!$register) {
            throw new \Exception('No tienes una caja abierta para registrar este gasto en efectivo.');
        }

        CashMovement::create([
            'cash_session_id' => $register->id,
            'type' => 'expense',
            'amount' => $amount,
            'description' => $description,
            'related_id' => $relatedId,
        ]);
    }
}
