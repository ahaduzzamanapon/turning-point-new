<?php

namespace App\Exports;

use App\Models\EmployeeAttendance;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DailyAttendanceExport implements FromCollection, WithHeadings
{
    protected $date;
    protected $filter;
    protected $employeeIds;

    public function __construct(string $date, string $filter, ?string $employeeIds)
    {
        $this->date = $date;
        $this->filter = $filter;
        $this->employeeIds = $employeeIds;
    }

    public function collection()
    {
        $query = EmployeeAttendance::query()
            ->whereDate('date', $this->date)
            ->with('employee');

        if ($this->filter && $this->filter !== 'all') {
            $query->where('status', $this->filter);
        }

        if ($this->employeeIds) {
            $employeeIdsArray = explode(',', $this->employeeIds);
            $query->whereIn('employee_id', $employeeIdsArray);
        }

        return $query->get()->map(function ($record) {
            return [
                'Employee Name' => $record->employee->name,
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
            'Employee Name',
            'Status',
            'Check In',
            'Check Out',
            'Notes',
        ];
    }
}
