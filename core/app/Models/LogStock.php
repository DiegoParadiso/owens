<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogStock extends Model
{
    protected $table = 'log_stocks';

    protected $fillable = [
        'product_id',
        'quantity',
        'user_id',
        'type',
        'description',
    ];
}
