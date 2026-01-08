<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SalePayment extends Model
{
    use HasFactory;

    protected $fillable = ['sale_id', 'payment_method', 'amount'];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
