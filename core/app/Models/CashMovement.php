<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CashMovement extends Model
{
    protected $fillable = ['cash_register_id', 'type', 'amount', 'description', 'related_id'];

    public function cashRegister()
    {
        return $this->belongsTo(CashRegister::class);
    }
}
