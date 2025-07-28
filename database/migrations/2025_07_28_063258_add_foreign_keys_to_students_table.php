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
        Schema::table('students', function (Blueprint $table) {
            // Drop existing string columns if they exist and are not nullable
            $table->dropColumn(['payment_method_id', 'course_interested_id', 'bach_interested_id', 'representative_id']);
        });

        Schema::table('students', function (Blueprint $table) {
            // Add new columns with correct type and foreign key constraints
            $table->unsignedBigInteger('payment_method_id')->after('full_address');
            $table->foreign('payment_method_id')->references('id')->on('payment_methods')->onDelete('cascade');

            $table->unsignedBigInteger('course_interested_id')->after('transaction_id');
            $table->foreign('course_interested_id')->references('id')->on('courses')->onDelete('cascade');

            $table->unsignedBigInteger('bach_interested_id')->after('course_interested_id');
            $table->foreign('bach_interested_id')->references('id')->on('batches')->onDelete('cascade');

            $table->unsignedBigInteger('representative_id')->after('facebook_profile_link');
            $table->foreign('representative_id')->references('id')->on('representatives')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Drop foreign keys
            $table->dropForeign(['payment_method_id']);
            $table->dropForeign(['course_interested_id']);
            $table->dropForeign(['bach_interested_id']);
            $table->dropForeign(['representative_id']);

            // Drop the new columns
            $table->dropColumn(['payment_method_id', 'course_interested_id', 'bach_interested_id', 'representative_id']);

            // Re-add the old string columns (if they were originally there and needed)
            // This part depends on the original migration. Assuming they were strings.
            $table->string('payment_method_id')->nullable()->after('full_address');
            $table->string('course_interested_id')->nullable()->after('transaction_id');
            $table->string('bach_interested_id')->nullable()->after('course_interested_id');
            $table->string('representative_id')->nullable()->after('facebook_profile_link');
        });
    }
};