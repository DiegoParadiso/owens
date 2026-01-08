<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sale extends Model
{
    use HasFactory;

    protected $table = 'sales';

    protected $fillable = [
        'sale_date',
        'total_price',
        'user_id',
        'payment_method'
    ];

    protected $casts = [
        'sale_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function saleDetails()
    {
        return $this->hasMany(SaleDetail::class, 'sale_id', 'id');
    }

    public function payment()
    {
        return $this->hasOne(SalePayment::class, 'sale_id', 'id');
    }

    public function payments()
    {
        return $this->hasMany(SalePayment::class);
    }
}
