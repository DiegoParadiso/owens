<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchasePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_id',
        'payment_method',
        'amount',
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }
}
