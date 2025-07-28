<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            ['name' => 'Ad + Govt. Bank + Private Bank Regular Batch (Pri.+Written)', 'amount' => 5000, 'start_date' => '2025-08-01', 'end_date' => '2025-12-31', 'status' => 'active', 'description' => 'Comprehensive preparation for bank jobs.'],
            ['name' => 'Premium Written Batch (Only Bank Job )', 'amount' => 3000, 'start_date' => '2025-09-01', 'end_date' => '2025-11-30', 'status' => 'active', 'description' => 'Focused training for written examinations.'],
            ['name' => 'IT Special Batch (Only Bank Job)', 'amount' => 4000, 'start_date' => '2025-08-15', 'end_date' => '2025-12-15', 'status' => 'active', 'description' => 'Specialized IT training for bank job aspirants.'],
            ['name' => 'Basic Course (Math +English)', 'amount' => 2500, 'start_date' => '2025-09-10', 'end_date' => '2025-11-10', 'status' => 'active', 'description' => 'Strengthen fundamentals in Math and English.'],
            ['name' => 'O.G Crash Course', 'amount' => 2000, 'start_date' => '2025-10-01', 'end_date' => '2025-10-31', 'status' => 'active', 'description' => 'Intensive crash course for quick preparation.'],
            ['name' => '২৪ তম ব্যাচ (রাত ৮ টায়) রেগুলার (প্রিলি. + রিটেন)(Upcoming New Batch)', 'amount' => 5500, 'start_date' => '2025-08-05', 'end_date' => '2026-01-05', 'status' => 'active', 'description' => 'Upcoming 24th batch for regular preparation.'],
            ['name' => 'IT Special Batch-01(Only Bank Job)', 'amount' => 4200, 'start_date' => '2025-09-20', 'end_date' => '2026-01-20', 'status' => 'active', 'description' => 'First IT special batch.'],
            ['name' => 'Basic Course (Math +English)-01', 'amount' => 2700, 'start_date' => '2025-10-10', 'end_date' => '2025-12-10', 'status' => 'active', 'description' => 'First basic course for Math and English.'],
        ];

        foreach ($courses as $courseData) {
            $course = Course::create($courseData);
        }
    }
}
