<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'amount', 'start_date', 'end_date', 'status', 'description'];

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }
}
