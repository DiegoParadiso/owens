<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsAppMessage extends Model
{
    protected $fillable = [
        'wa_id',
        'from_number',
        'from_name',
        'body',
        'media_url',
        'type',
        'status',
        'wa_timestamp',
    ];

    protected $casts = [
        'wa_timestamp' => 'datetime',
    ];
}
