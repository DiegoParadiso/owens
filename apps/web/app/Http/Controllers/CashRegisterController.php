<?php

namespace App\Http\Controllers;

use App\Models\CashRegister;
use App\Models\CashMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class CashRegisterController extends Controller
{
    public function downloadPdf($id)
    {
        $register = CashRegister::with(['user', 'movements.related' => function($morphTo) {
             $morphTo->morphWith([
                \App\Models\Sale::class => ['saleDetails.product'],
                \App\Models\Expense::class => [],
                \App\Models\Purchase::class => ['details.product'],
            ]);
        }])->findOrFail($id);

        $user = Auth::user();
        $isPrivileged = in_array($user->role, ['admin', 'owner', 'auditor']);

        if ($register->user_id !== $user->id && !$isPrivileged) {
            abort(403);
        }

        // Calculate totals for the report
        $income = $register->movements->whereIn('type', ['income', 'sale'])->sum('amount');
        $expense = $register->movements->whereIn('type', ['expense', 'purchase'])->sum('amount');
        $balance = $register->opening_amount + $income - $expense;

        $pdf = Pdf::loadView('reports.cash_register_pdf', compact('register', 'income', 'expense', 'balance'));
        
        return $pdf->download('Cierre_Caja_' . now()->format('Y-m-d') . '.pdf');
    }


    public function index()
    {
        // Usar SQL raw con nueva tabla para bypass planes cacheados
        $result = \DB::select("SELECT * FROM cash_sessions WHERE user_id = ? AND status = 'open' LIMIT 1", [Auth::id()]);
        
        $openRegister = null;
        if (count($result) > 0) {
            $openRegister = CashRegister::find($result[0]->id);
        }

        if (!$openRegister) {
            return \Inertia\Inertia::render('CashRegister/Index', [
                'openRegister' => null,
                'currentBalance' => 0,
                'income' => 0,
                'expense' => 0,
                'movements' => [],
                'lastClosures' => CashRegister::where('user_id', Auth::id())
                    ->where('status', 'closed')
                    ->latest('closed_at')
                    ->take(10)
                    ->get()
            ]);
        }

        // Calcular totales
        $income = $openRegister->movements()->whereIn('type', ['income', 'sale'])->sum('amount');
        $expense = $openRegister->movements()->whereIn('type', ['expense', 'purchase'])->sum('amount');
        $currentBalance = $openRegister->opening_amount + $income - $expense;

        $movements = $openRegister->movements()
            ->with([
                'related' => function ($morphTo) {
                    $morphTo->morphWith([
                        \App\Models\Sale::class => ['saleDetails.product'],
                        \App\Models\Expense::class => [],
                    ]);
                }
            ])
            ->latest()
            ->get();

        // Fetch history of closed sessions
        $lastClosures = CashRegister::where('user_id', Auth::id())
            ->where('status', 'closed')
            ->latest('closed_at')
            ->take(10)
            ->get();

        return \Inertia\Inertia::render('CashRegister/Index', [
            'openRegister' => $openRegister,
            'currentBalance' => $currentBalance,
            'income' => $income,
            'expense' => $expense,
            'movements' => $movements,
            'lastClosures' => $lastClosures
        ]);
    }



    public function create()
    {
        $title = 'Abrir Caja';
        $subtitle = "Dashboard";
        return view('admin.cash_register.create', compact('title', 'subtitle'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'opening_amount' => 'required|numeric|min:0',
        ], [
            'opening_amount.required' => 'El monto de apertura es obligatorio.',
            'opening_amount.numeric' => 'El monto debe ser numérico.',
        ]);

        // Asegurar que no haya otra caja abierta para este usuario
        $existingCheck = \DB::select("SELECT id FROM cash_sessions WHERE user_id = ? AND status = 'open' LIMIT 1", [Auth::id()]);
        if (count($existingCheck) > 0) {
            return redirect()->route('cash_register.index')->with('error', 'Ya tienes una caja abierta.');
        }

        $cashRegister = CashRegister::create([
            'user_id' => Auth::id(),
            'opening_amount' => $request->opening_amount,
            'status' => 'open',
            'opened_at' => Carbon::now(),
        ]);

        return redirect()->route('cash_register.index')->with('success', 'Caja abierta exitosamente');
    }

    public function storeMovement(Request $request, $id)
    {
        $register = CashRegister::findOrFail($id);

        if ($register->user_id !== Auth::id() && !in_array(Auth::user()->role, ['admin', 'owner'])) {
            abort(403);
        }

        if ($register->status !== 'open') {
            return redirect()->back()->with('error', 'No se pueden registrar movimientos en una caja cerrada.');
        }

        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|gt:0',
            'description' => 'required|string|max:255',
        ], [
            'type.required' => 'El tipo de movimiento es obligatorio.',
            'amount.required' => 'El monto es obligatorio.',
            'amount.gt' => 'El monto debe ser mayor a cero.',
            'description.required' => 'El motivo del movimiento es obligatorio.',
        ]);

        // UC-04 Paso 5: Verificar efectivo disponible antes de permitir un egreso manual
        if ($validated['type'] === 'expense') {
            $income = $register->movements()->whereIn('type', ['income', 'sale'])->sum('amount');
            $expense = $register->movements()->whereIn('type', ['expense', 'purchase'])->sum('amount');
            $currentBalance = $register->opening_amount + $income - $expense;

            if ((float) $validated['amount'] > $currentBalance) {
                return redirect()->back()->withErrors([
                    'amount' => 'Efectivo insuficiente en caja. Saldo disponible: $' . number_format($currentBalance, 2, ',', '.')
                ]);
            }
        }

        CashMovement::create([
            'cash_session_id' => $register->id,
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'description' => ($validated['type'] === 'income' ? 'Ingreso manual: ' : 'Retiro manual: ') . $validated['description'],
        ]);

        return redirect()->route('cash_register.index')->with('success', 'Movimiento manual registrado correctamente.');
    }

    public function close(Request $request, $id)
    {
        $register = CashRegister::findOrFail($id);
        
        if ($register->status !== 'open') {
            return redirect()->back()->with('error', 'Esta caja ya está cerrada.');
        }

        $request->validate([
            'closing_amount' => 'required|numeric|min:0',
        ], [
            'closing_amount.required' => 'El monto de cierre es obligatorio.',
            'closing_amount.numeric' => 'El monto debe ser numérico.',
        ]);

        $income = $register->movements()->whereIn('type', ['income', 'sale'])->sum('amount');
        $expense = $register->movements()->whereIn('type', ['expense', 'purchase'])->sum('amount');
        $expectedBalance = (float) $register->opening_amount + (float) $income - (float) $expense;
        $closingAmount = (float) $request->closing_amount;
        $difference = $closingAmount - $expectedBalance;

        $register->update([
            'closing_amount' => $closingAmount,
            'status' => 'closed',
            'closed_at' => Carbon::now(),
        ]);

        return redirect()->route('cash_register.index')
            ->with('success', 'Caja cerrada exitosamente')
            ->with('closure_summary', [
                'id' => $register->id,
                'opening_amount' => (float) $register->opening_amount,
                'expected_balance' => $expectedBalance,
                'closing_amount' => $closingAmount,
                'difference' => $difference,
            ]);
    }
}
