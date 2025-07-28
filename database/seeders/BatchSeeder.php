<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Batch;
use App\Models\Course;

class BatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $batchesData = [
            ['name' => '২৪ তম ব্যাচ (রাত ৮ টায়) রেগুলার (প্রিলি. + রিটেন)(Upcoming New Batch)', 'course_name' => '২৪ তম ব্যাচ (রাত ৮ টায়) রেগুলার (প্রিলি. + রিটেন)(Upcoming New Batch)', 'start_time' => '20:00:00', 'end_time' => '22:00:00', 'status' => 'active'],
            ['name' => 'IT Special Batch-01(Only Bank Job)', 'course_name' => 'IT Special Batch-01(Only Bank Job)', 'start_time' => '10:00:00', 'end_time' => '12:00:00', 'status' => 'active'],
            ['name' => 'Basic Course (Math +English)-01', 'course_name' => 'Basic Course (Math +English)-01', 'start_time' => '09:00:00', 'end_time' => '11:00:00', 'status' => 'active'],
            ['name' => 'O.G  Crash Course', 'course_name' => 'O.G Crash Course', 'start_time' => '18:00:00', 'end_time' => '20:00:00', 'status' => 'active'],
        ];

        $courses = Course::all();
        foreach ($courses as $course) {
            foreach ($batchesData as $batchData) {
                Batch::create([
                    'course_id' => $course->id,
                    'name' => $batchData['name'],
                    'start_time' => $batchData['start_time'],
                    'end_time' => $batchData['end_time'],
                    'status' => $batchData['status'],
                ]);
            }
            
        }
    }
}
