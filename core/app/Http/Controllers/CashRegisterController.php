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
        $title = 'Caja';
        $subtitle = "Dashboard";
        
        // Check if there is an open register for the current user
        $openRegister = CashRegister::where('user_id', Auth::id())
            ->where('status', 'open')
            ->first();

        if (!$openRegister) {
            return view('admin.cash_register.create', compact('title', 'subtitle'));
        }

        // Calculate totals
        $income = $openRegister->movements()->where('type', 'income')->sum('amount');
        $expense = $openRegister->movements()->where('type', 'expense')->sum('amount');
        $currentBalance = $openRegister->opening_amount + $income - $expense;

        $movements = $openRegister->movements()->latest()->get();

        return view('admin.cash_register.index', compact('title', 'subtitle', 'openRegister', 'currentBalance', 'income', 'expense', 'movements'));
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

        // Ensure no other register is open for this user
        $existingOpen = CashRegister::where('user_id', Auth::id())->where('status', 'open')->first();
        if ($existingOpen) {
            return redirect()->route('cash_register.index')->with('error', 'Ya tienes una caja abierta.');
        }

        CashRegister::create([
            'user_id' => Auth::id(),
            'opening_amount' => $request->opening_amount,
            'status' => 'open',
            'opened_at' => Carbon::now(),
        ]);

        return redirect()->route('cash_register.index');
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

        return redirect()->route('dashboard');
    }
}
