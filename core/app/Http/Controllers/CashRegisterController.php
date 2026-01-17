<?php

namespace App\Http\Controllers;

use App\Models\CashRegister;
use App\Models\CashMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


class CashRegisterController extends Controller
{


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
                        \App\Models\Purchase::class => ['details.product'],
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

    public function close(Request $request, $id)
    {
        $register = CashRegister::findOrFail($id);
        
        if ($register->status !== 'open') {
            return redirect()->back()->with('error', 'Esta caja ya está cerrada.');
        }

        $request->validate([
            'closing_amount' => 'required|numeric|min:0',
        ]);

        $register->update([
            'closing_amount' => $request->closing_amount,
            'status' => 'closed',
            'closed_at' => Carbon::now(),
        ]);

        return redirect()->route('dashboard')->with('success', 'Caja cerrada exitosamente');
    }
}
