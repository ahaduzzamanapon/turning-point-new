<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_full_name',
        'mobile_number',
        'email',
        'full_address',
        'payment_method_id',
        'registration_status',
        'sender_mobile_number',
        'amount_sent',
        'transaction_id',
        'payment_status',
        'course_interested_id',
        'bach_interested_id',
        'facebook_profile_link',
        'representative_id',
        'student_id',
        'is_active',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_interested_id');
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class, 'bach_interested_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function representative()
    {
        return $this->belongsTo(Representative::class);
    }
}