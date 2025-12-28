<?php

namespace App\Services;

use App\Models\CashRegister;
use App\Models\CashMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CashRegisterService
{
    /**
     * Open a new cash register
     */
    public function openCashRegister(float $openingAmount): CashRegister
    {
        // Check if user already has an open register
        $existingRegister = CashRegister::where('user_id', Auth::id())
            ->where('status', 'open')
            ->first();
            
        if ($existingRegister) {
            throw new \Exception('Ya existe una caja abierta para este usuario.');
        }
        
        return CashRegister::create([
            'user_id' => Auth::id(),
            'opening_amount' => $openingAmount,
            'status' => 'open',
            'opened_at' => now(),
        ]);
    }

    /**
     * Close the current cash register
     */
    public function closeCashRegister(CashRegister $cashRegister, float $closingAmount): CashRegister
    {
        if ($cashRegister->status !== 'open') {
            throw new \Exception('La caja no está abierta.');
        }
        
        if ($cashRegister->user_id !== Auth::id()) {
            throw new \Exception('No puedes cerrar una caja de otro usuario.');
        }
        
        $cashRegister->update([
            'status' => 'closed',
            'closing_amount' => $closingAmount,
            'closed_at' => now(),
        ]);
        
        return $cashRegister;
    }

    /**
     * Get current balance of cash register
     */
    public function getCurrentBalance(CashRegister $cashRegister): float
    {
        $income = $cashRegister->movements()->where('type', 'income')->sum('amount');
        $expense = $cashRegister->movements()->where('type', 'expense')->sum('amount');
        
        return $cashRegister->opening_amount + $income - $expense;
    }

    /**
     * Record a cash movement
     */
    public function recordMovement(CashRegister $cashRegister, string $type, float $amount, string $description): CashMovement
    {
        if ($cashRegister->status !== 'open') {
            throw new \Exception('La caja debe estar abierta para registrar movimientos.');
        }
        
        return CashMovement::create([
            'cash_register_id' => $cashRegister->id,
            'type' => $type,
            'amount' => $amount,
            'description' => $description,
        ]);
    }
}

