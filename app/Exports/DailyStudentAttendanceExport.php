<?php

namespace App\Exports;

use App\Models\StudentAttendance;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DailyStudentAttendanceExport implements FromCollection, WithHeadings
{
    protected $date;
    protected $filter;
    protected $studentIds;

    public function __construct(string $date, string $filter, ?string $studentIds)
    {
        $this->date = $date;
        $this->filter = $filter;
        $this->studentIds = $studentIds;
    }

    public function collection()
    {
        $query = StudentAttendance::query()
            ->whereDate('date', $this->date)
            ->with('student');

        if ($this->filter && $this->filter !== 'all') {
            $query->where('status', $this->filter);
        }

        if ($this->studentIds) {
            $studentIdsArray = explode(',', $this->studentIds);
            $query->whereIn('student_id', $studentIdsArray);
        }

        return $query->get()->map(function ($record) {
            return [
                'Student Name' => $record->student->candidate_full_name,
                'Status' => ucfirst($record->status),
                'Check In' => $record->check_in ?? 'N/A',
                'Check Out' => $record->check_out ?? 'N/A',
                'Notes' => $record->notes ?? 'N/A',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Student Name',
            'Status',
            'Check In',
            'Check Out',
            'Notes',
        ];
    }
}
