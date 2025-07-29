<?php

namespace App\Exports;

use App\Models\StudentAttendance;
use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Carbon\Carbon;

class ContinuousStudentAttendanceExport implements FromCollection, WithHeadings
{
    protected $fromDate;
    protected $toDate;
    protected $studentIds;

    public function __construct(string $fromDate, string $toDate, ?string $studentIds)
    {
        $this->fromDate = $fromDate;
        $this->toDate = $toDate;
        $this->studentIds = $studentIds;
    }

    public function collection()
    {
        $query = StudentAttendance::query()
            ->whereBetween('date', [$this->fromDate, $this->toDate])
            ->with('student');

        if ($this->studentIds) {
            $studentIdsArray = explode(',', $this->studentIds);
            $query->whereIn('student_id', $studentIdsArray);
        }

        $attendanceRecords = $query->get()->groupBy('student_id');

        $exportData = collect();
        $allDates = $this->getDatesBetween($this->fromDate, $this->toDate);

        foreach ($attendanceRecords as $studentId => $records) {
            $student = Student::find($studentId);
            if ($student) {
                $rowData = [
                    'Student Name' => $student->candidate_full_name,
                ];

                foreach ($allDates as $date) {
                    $formattedDate = $date->toDateString();
                    $recordForDate = $records->where('date', $formattedDate)->first();
                    $rowData[$formattedDate] = $recordForDate ? ucfirst($recordForDate->status) : 'Absent';
                }
                $exportData->push($rowData);
            }
        }

        return $exportData;
    }

    public function headings(): array
    {
        $headings = ['Student Name'];
        $allDates = $this->getDatesBetween($this->fromDate, $this->toDate);
        foreach ($allDates as $date) {
            $headings[] = $date->format('Y-m-d');
        }
        return $headings;
    }

    private function getDatesBetween($startDate, $endDate)
    {
        $dates = [];
        $currentDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);

        while ($currentDate->lte($endDate)) {
            $dates[] = $currentDate->copy();
            $currentDate->addDay();
        }
        return $dates;
    }
}
