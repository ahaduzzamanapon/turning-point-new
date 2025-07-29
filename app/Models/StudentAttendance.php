<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAttendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'date',
        'status',
        'notes',
        'check_in',
        'check_out',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
