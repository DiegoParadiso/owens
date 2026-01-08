<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpensePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'expense_id',
        'payment_method',
        'amount',
    ];

    public function expense()
    {
        return $this->belongsTo(Expense::class);
    }
}
