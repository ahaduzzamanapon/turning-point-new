<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->unique()->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('candidate_full_name');
            $table->string('mobile_number');
            $table->string('email')->unique();
            $table->text('full_address');
            $table->string('payment_method_id');
            $table->string('sender_mobile_number');
            $table->decimal('amount_sent', 10, 2);
            $table->string('transaction_id');
            $table->string('course_interested_id');
            $table->string('bach_interested_id');
            $table->string('facebook_profile_link')->nullable();
            $table->string('representative_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};