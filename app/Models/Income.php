<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    use HasFactory;

    protected $fillable = [
        'ledger_id',
        'amount',
        'description',
        'date',
    ];

    public function ledger()
    {
        return $this->belongsTo(Ledger::class);
    }
}
