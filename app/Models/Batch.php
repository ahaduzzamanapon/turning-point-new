<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    use HasFactory;

    protected $fillable = ['course_id', 'name', 'start_time', 'end_time', 'status'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
