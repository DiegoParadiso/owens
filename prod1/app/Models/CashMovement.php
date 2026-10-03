<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashMovement extends Model
{
    use HasFactory;

    protected $table = 'cash_transactions';

    protected $fillable = [
        'cash_session_id',
        'type',
        'amount',
        'description',
        'related_id',
        'related_type',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function cashRegister()
    {
        return $this->belongsTo(CashRegister::class, 'cash_session_id');
    }

    public function related()
    {
        return $this->morphTo();
    }
}
