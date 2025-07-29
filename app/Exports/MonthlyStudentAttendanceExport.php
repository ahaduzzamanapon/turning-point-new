<?php

namespace App\Exports;

use App\Models\StudentAttendance;
use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Carbon\Carbon;

class MonthlyStudentAttendanceExport implements FromCollection, WithHeadings
{
    protected $month;
    protected $studentIds;

    public function __construct(string $month, ?string $studentIds)
    {
        $this->month = $month;
        $this->studentIds = $studentIds;
    }

    public function collection()
    {
        $startDate = Carbon::parse($this->month)->startOfMonth();
        $endDate = Carbon::parse($this->month)->endOfMonth();

        $query = StudentAttendance::query()
            ->whereBetween('date', [$startDate, $endDate]);

        if ($this->studentIds) {
            $studentIdsArray = explode(',', $this->studentIds);
            $query->whereIn('student_id', $studentIdsArray);
        }

        $attendance = $query->get();

        $monthlySummary = $attendance->groupBy('student_id')->map(function ($records, $studentId) {
            $student = Student::find($studentId);
            return [
                'Student Name' => $student ? $student->candidate_full_name : 'Unknown Student',
                'Present Days' => $records->where('status', 'present')->count(),
                'Absent Days' => $records->where('status', 'absent')->count(),
                'Leave Days' => $records->where('status', 'leave')->count(),
            ];
        })->values();

        return $monthlySummary;
    }

    public function headings(): array
    {
        return [
            'Student Name',
            'Present Days',
            'Absent Days',
            'Leave Days',
        ];
    }
}
