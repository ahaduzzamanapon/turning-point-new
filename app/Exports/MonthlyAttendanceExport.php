<?php

namespace App\Exports;

use App\Models\EmployeeAttendance;
use App\Models\Employee;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Carbon\Carbon;

class MonthlyAttendanceExport implements FromCollection, WithHeadings
{
    protected $month;
    protected $employeeIds;

    public function __construct(string $month, ?string $employeeIds)
    {
        $this->month = $month;
        $this->employeeIds = $employeeIds;
    }

    public function collection()
    {
        $startDate = Carbon::parse($this->month)->startOfMonth();
        $endDate = Carbon::parse($this->month)->endOfMonth();

        $query = EmployeeAttendance::query()
            ->whereBetween('date', [$startDate, $endDate]);

        if ($this->employeeIds) {
            $employeeIdsArray = explode(',', $this->employeeIds);
            $query->whereIn('employee_id', $employeeIdsArray);
        }

        $attendance = $query->get();

        $monthlySummary = $attendance->groupBy('employee_id')->map(function ($records, $employeeId) {
            $employee = Employee::find($employeeId);
            return [
                'Employee Name' => $employee ? $employee->name : 'Unknown Employee',
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
            'Employee Name',
            'Present Days',
            'Absent Days',
            'Leave Days',
        ];
    }
}
