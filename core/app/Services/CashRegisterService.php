<?php

namespace App\Services;

use App\Models\CashRegister;
use App\Models\CashMovement;
use Illuminate\Support\Facades\Auth;
use Exception;

class CashRegisterService
{
    /**
     * Get the currently open cash register for the authenticated user.
     * 
     * @return CashRegister
     * @throws Exception if no register is open
     */
    public function getOpenRegister()
    {
        $cashRegister = CashRegister::where('user_id', Auth::id())
                                     ->where('status', 'open')
                                     ->first();
        
        if (!$cashRegister) {
            throw new Exception('REGISTER_CLOSED');
        }

        return $cashRegister;
    }

    /**
     * Record a cash movement.
     * 
     * @param float $amount
     * @param string $type 'sale', 'purchase', 'expense', etc.
     * @param string $description
     * @param int|null $relatedId ID of the related Sale/Purchase/Expense
     */
    public function recordMovement(float $amount, string $type, string $description, int $relatedId = null)
    {
        $register = $this->getOpenRegister();

        CashMovement::create([
            'cash_session_id' => $register->id,
            'type' => $type,
            'amount' => $amount,
            'description' => $description,
            'related_id' => $relatedId,
        ]);
    }
    
    /**
     * Delete movements related to a transaction.
     * 
     * @param string $type
     * @param int $relatedId
     */
    public function deleteRelatedMovements(string $type, int $relatedId)
    {
        CashMovement::where('type', $type)->where('related_id', $relatedId)->delete();
    }
}
